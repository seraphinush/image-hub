import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
import FlipMove from 'react-flip-move';
import UploadIcon from './UploadIcon.svg';
import axios from 'axios';
import {adalConfig, authContext} from '../../adalConfig';
import Popup from 'reactjs-popup';
import {adalGetToken} from "react-adal";


const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%"
};

class ReactImageUploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: props.defaultImage ? [props.defaultImage] : [],
      files: [],
      notAcceptedFileType: [],
      notAcceptedFileSize: []
    };
    this.inputElement = '';
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
      this.uploadImagesToServer = this.uploadImagesToServer.bind(this)
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.files !== this.state.files){
      this.props.onChange(this.state.files, this.state.pictures);
    }
  }

  /*
   Load image at the beggining if defaultImage prop exists
   */
  componentWillReceiveProps(nextProps){
    if(nextProps.defaultImage){
      this.setState({pictures: [nextProps.defaultImage]});
    }
  }

  /*
	 Check file extension (onDropFile)
	 */
  hasExtension(fileName) {
    const pattern = '(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
  }

  /*
   Handle file validation
   */
  onDropFile(e) {
    const files = e.target.files;
    const allFilePromises = [];

    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i++) {
      let f = files[i];
      // Check for file extension
      if (!this.hasExtension(f.name)) {
        const newArray = this.state.notAcceptedFileType.slice();
        newArray.push(f.name);
        this.setState({notAcceptedFileType: newArray});
        continue;
      }
      // Check for file size
      if(f.size > this.props.maxFileSize) {
        const newArray = this.state.notAcceptedFileSize.slice();
        newArray.push(f.name);
        this.setState({notAcceptedFileSize: newArray});
        continue;
      }

      allFilePromises.push(this.readFile(f));
    }

    Promise.all(allFilePromises).then(newFilesData => {
      const dataURLs = this.state.pictures.slice();
      const files = this.state.files.slice();

      newFilesData.forEach(newFileData => {
          dataURLs.push({ "value" : newFileData.dataURL });
        files.push(newFileData.file);
      });

      this.setState({pictures: dataURLs, files: files});
    });
  }

  onUploadClick(e) {
    e.target.value = null;
  }

  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // Read the image via FileReader API and save image result in state.
            reader.onload = function (e) {
                // Add the file name to the data URL
                let dataURL = e.target.result;
                dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
                resolve({ file, dataURL });
            };
            reader.readAsDataURL(file);
        });
    }

  /*
   Remove the image from state
   */
  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex(e => e === picture);
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
    const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);

    this.setState({pictures: filteredPictures, files: filteredFiles}, () => {
      this.props.onChange(this.state.files, this.state.pictures);
    });
  }

  /*
   Check if any errors && render
   */
  renderErrors() {
    let notAccepted = '';
    if (this.state.notAcceptedFileType.length > 0) {
      notAccepted = this.state.notAcceptedFileType.map((error, index) => {
        return (
          <div className={'errorMessage ' + this.props.errorClass} key={index} style={this.props.errorStyle}>
            * {error} {this.props.fileTypeError}
          </div>
        )
      });
    }
    if (this.state.notAcceptedFileSize.length > 0) {
      notAccepted = this.state.notAcceptedFileSize.map((error, index) => {
        return (
          <div className={'errorMessage ' + this.props.errorClass} key={index} style={this.props.errorStyle}>
            * {error} {this.props.fileSizeError}
          </div>
        )
      });
    }
    return notAccepted;
  }

  /*
   Render the upload icon
   */
  renderIcon() {
    if (this.props.withIcon) {
      return <img src={UploadIcon} className="uploadIcon"	alt="Upload Icon" />;
    }
  }

  /*
   Render label
   */
  renderLabel() {
    if (this.props.withLabel) {
      return <p className={this.props.labelClass} style={this.props.labelStyles}>{this.props.label}</p>
    }
  }

  /*
   Render preview images
   */
  renderPreview() {
    return (
      <div className="uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    );
  }

    renderPreviewPictures() {
        return this.state.pictures.map((picture, index) => {
            let uploadstatus;
            let deleteButton;
            if (picture.status != null) {
                deleteButton = null
                let success = <Popup trigger={<div className="imageUploadSuccess" onClick={() => this.removeImage(picture)}>✓</div>} position="top center" on="hover">Image successfully uploaded</Popup> ;
                let fail = <Popup trigger={<div className="imageUploadfail" onClick={() => this.removeImage(picture)}>!</div>} position="top center" on="hover">Image exists in the system</Popup> 
                uploadstatus = picture.status ? success : fail; 
            } else {
                deleteButton = <div className="deleteImage" onClick={() => this.removeImage(picture)}>X</div>;
                uploadstatus = null;
            }
            return (
                <div key={index} className="uploadPictureContainer">
                    {deleteButton}
                    {uploadstatus}
                    <img src={picture.value} className="uploadPicture" alt="preview" />
                </div>
            );
        });
    }

  /*
   On button click, trigger input file to open
   */
  triggerFileUpload() {
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({pictures: []})
  }

    uploadImagesToServer() {
        this.state.files.map((picture, index) => {
            var fd = new FormData();
            const that = this;
            fd.append('image', picture, picture.name);
            
            adalGetToken(authContext, adalConfig.endpoints.api)
                .then(function (token) {
                    axios({
                        url: '/api/image/',
                        method: 'POST',
                        data: fd,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': "bearer " + token
                        }
                    }).then(res => {
                        delete that.state.files[index]
                        that.state.pictures[index].status = true;
                        that.props.onChange(that.state.files, that.state.pictures);
                    }).catch(err => {
                        delete that.state.files[index]
                        that.state.pictures[index].status = false;
                        that.props.onChange(that.state.files, that.state.pictures);
                    })
                }).catch(function (err) {
                console.log("Error: Couldn't get token")
            });
        })
    }

    render() {
        return (
            <div className={"fileUploader " + this.props.className} style={this.props.style}>
                <div className="fileContainer" style={this.props.fileContainerStyle}>
                    {this.renderIcon()}
                    {this.renderLabel()}
                    <div className="errorsContainer">
                        {this.renderErrors()}
                    </div>

                    <div className="buttonContainer">
                        <button
                            type={this.props.buttonType}
                            className={"chooseImageButton " + this.props.chooseImageButtonClassName}
                            style={this.props.buttonStyles}
                            onClick={this.triggerFileUpload}
                        >
                            {this.props.chooseImageButtonText}
                        </button>
                        <button
                            type={this.props.buttonType}
                            className={"uploadImagesButton " + this.props.uploadButtonClassName}
                            style={this.props.buttonStyles}
                            onClick={this.uploadImagesToServer}
                        >
                            {this.props.uploadToServerButtonText}
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={input => this.inputElement = input}
                        name={this.props.name}
                        multiple={!this.props.singleImage}
                        onChange={this.onDropFile}
                        onClick={this.onUploadClick}
                        accept={this.props.accept}
                    />
                    {this.props.withPreview ? this.renderPreview() : null}
                </div>
            </div>
        )
    }
}

ReactImageUploadComponent.defaultProps = {
    className: '',
    fileContainerStyle: {},
    chooseImageButtonClassName: "",
    uploadButtonClassName: "",
    buttonStyles: {},
    withPreview: false,
    accept: "image/*",
    name: "",
    withIcon: true,
    chooseImageButtonText: "Choose Images",
    uploadToServerButtonText: "Upload Images",
    buttonType: "button",
    withLabel: true,
    label: "Max file size: 50MB, accepted: jpg | gif | png | jpeg",
    labelStyles: {},
    labelClass: "",
    imgExtension: ['.jpg', '.jpeg', '.gif', '.png'],
    maxFileSize: 52428800,
    fileSizeError: " file size is too big",
    fileTypeError: " is not a supported file extension",
    errorClass: "",
    style: {},
    errorStyle: {},
    singleImage: false,
    onChange: () => { },
    defaultImage: ""
};

ReactImageUploadComponent.propTypes = {
    style: PropTypes.object,
    fileContainerStyle: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    buttonClassName: PropTypes.string,
    buttonStyles: PropTypes.object,
    buttonType: PropTypes.string,
    withPreview: PropTypes.bool,
    accept: PropTypes.string,
    name: PropTypes.string,
    withIcon: PropTypes.bool,
    buttonText: PropTypes.string,
    withLabel: PropTypes.bool,
    label: PropTypes.string,
    labelStyles: PropTypes.object,
    labelClass: PropTypes.string,
    imgExtension: PropTypes.array,
    maxFileSize: PropTypes.number,
    fileSizeError: PropTypes.string,
    fileTypeError: PropTypes.string,
    errorClass: PropTypes.string,
    errorStyle: PropTypes.object,
    singleImage: PropTypes.bool,
    defaultImage: PropTypes.string
};

export default ReactImageUploadComponent;
