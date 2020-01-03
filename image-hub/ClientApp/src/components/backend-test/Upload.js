import React, { Component } from 'react';
import axios from 'axios'

export class Upload extends Component {
    displayName = Upload.name

    constructor(props) {
        super(props);

        this.state = {
            images: []
        }
    }

    state = {
        selectedFile: null
    };


    fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    };

    fileUploadHandler = () => {
        const fd = new FormData();
        if (this.state.selectedFile && this.state.selectedFile.name) {
            fd.append('image', this.state.selectedFile, this.state.selectedFile.name);

            axios({
                url: '/api/image/',
                method: 'POST',
                data: fd,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                console.log(res.data)
                let uri = "/api/image/" + res.data["iId"];
                this.state.images.push(uri);
                this.setState({
                    images: this.state.images
                });
            })
        }
    };

    fileLoadHandler = () => {
        axios.get("/api/user/todo/images")
            .then(res => {
                let a = [];
                console.log(res.data)
                res.data.forEach((image) => { a.push("/api/image/" + image.iId) })
                this.setState({
                    images: a
                });
            })
    };

    render() {
        console.log(this.state.images);
        const listItems = this.state.images.map((i) =>
            <li><p></p><img src={i} alt="" className="img-responsive" width="400px" height="400px" /><p></p></li>
        );

        return (
            <div>
                <h1>Image Upload</h1>
                <input type="file" onChange={this.fileSelectedHandler} />
                <button onClick={this.fileUploadHandler}>Upload</button>
                <button onClick={this.fileLoadHandler}>Load Files</button>
                <ul>{listItems}</ul>
            </div>
        );
    }
}


