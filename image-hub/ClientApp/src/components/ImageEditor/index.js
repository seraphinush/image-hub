import React, { Component } from 'react';
import { Title } from '../Title';
import { TextInput } from '../sub-components/form-text-input';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import {adalConfig, authContext} from '../../adalConfig';
import { Redirect } from 'react-router-dom';

import './edit-image.css';
import {adalGetToken} from "react-adal";

export class ImageEditor extends Component {

  constructor(props)
  {
    super(props);

    let params = new URLSearchParams(window.location.search);
    let src = "/api/image/" + params.get('src');

    this.state = {
      src: src,
      cropResult: null,
      redirect: false,
    };

    this.submitImage = this.submitImage.bind(this);
  }

  //
  // TO REMOVE
  //
  /* onChange(e) 
  {
    e.preventDefault();

    let files;

    if (e.dataTransfer)
    {
      files = e.dataTransfer.files;
    }
    else if (e.target)
    {
      files = e.target.files;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  } */

  dataURItoBlob(dataURI)
  {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;

    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++)
    {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  //
  // axios request
  //
  submitImage = () =>
  {    
    var fd = new FormData();
    const that = this;

    fd.append('image', this.dataURItoBlob(this.cropper.getCroppedCanvas().toDataURL()), "edited image");
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
          })
              .then(res => {
                that.setState({ redirect: true });
              })
        }).catch(function (err) {
      console.log("Error: Couldn't get token")
    });
    
  };

  //
  // edit image functions
  //
  resetImage = () =>
  {
    this.cropper.reset();
  }

  cropImage = () =>
  {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined')
    {
      return;
    }

    this.setState({ cropResult: this.cropper.getCroppedCanvas().toDataURL() });
  }

  rotateCW = () =>
  {
    this.cropper.rotate(90);
  }

  rotateCounterCW = () =>
  {
    this.cropper.rotate(-90);
  }

  scaleXY = () =>
  {
    let sizeX = Number(this.state.scaleX);
    let sizeY = Number(this.state.scaleY);

    if (isNaN(sizeX) || isNaN(sizeY))
    {
      alert('Input must be a number.');
      return;
    }

    this.cropper.scale(this.state.scaleX, this.state.scaleY);
  }

  setDocReadySize = () =>
  {
    //
  }

  handleScaleChange = (e) =>
  {
    let value = e.target.value;
    
    if (e.target.id === 'edit_scaleX')
    {
      this.setState({ scaleX: value });
    }
    else if (e.target.id === 'edit_scaleY')
    {
      this.setState({ scaleY: value });
    }
  }

  //
  // direct
  //
  setRedirect = () =>
  {
    this.setState({ redirect: true });
  };

  renderRedirect = () => 
  {
    let redirectLink = 'palette';
    if (this.state.redirect)
    {
      return <Redirect to={redirectLink} />;
    }
  };
  
  //
  // redirect
  //
  render() 
  {
    return (
      <div>
        <Title title='EDIT IMAGE' />
        {this.renderRedirect()}
        {this.renderFunction()}
        {this.renderEditImage()}
      </div>
    );
  }

  renderFunction()
  {
    return (
      <div>
        <div className="fnbar">
          <button onClick={this.setRedirect}>Cancel</button>
          <button onClick={this.submitImage}>Submit</button>
          <button onClick={this.resetImage}>Reset</button>
        </div>
        
        <div className="fnbar">
          <button onClick={this.scaleXY}>Scale</button>
          <div style={{ float: 'right', margin: '0px', padding: '0px 0px' }}>
            <TextInput
              disabled={false}
              id="edit_scaleX"
              placeholder="X"
              onChange={this.handleScaleChange}/>
            <TextInput
              disabled={false}
              id="edit_scaleY"
              placeholder="Y"
              onChange={this.handleScaleChange}/>
          </div>
          <button onClick={this.rotateCW}>Rotate Clockwise</button>
          <button onClick={this.rotateCounterCW}>Rotate Counter-clockwise</button>
        </div>
      </div>
    );
  }

  renderEditImage()
  {
    return (
      <div id="edit_cropper">
        <Cropper
          style={{ height: 550, width: '95%', margin: 'auto' }}
          guides={false}
          src={this.state.src}
          ref={cropper => { this.cropper = cropper; }} />
      </div>
    );
  }

}

