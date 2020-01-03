import React, { Component } from 'react';
import { Title } from './Title';
import '../index.css';
import Gallery from './custom-photo-gallery';
import SelectedImage from './SelectedImage';
import axios from 'axios'
import { authContext, isAdmin, adalConfig, getUser, isIE } from '../adalConfig';
import { Redirect } from "react-router-dom";
import { adalGetToken } from "react-adal";

export class Trash extends Component {

  constructor(props) {

    super(props);

    this.state = {
      admin: false,
      validId: false,
      userId: "",

      photos: [],
      selected: [],

      selectAll: false,
      showRecover: false,

      redirect: false,
      redirectLink: '',
      redirectOption: 0
    };

    this.GetUserTrashedImages = this.GetUserTrashedImages.bind(this);
    this.RecoverSelectedImages = this.RecoverSelectedImages.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectPhoto = this.selectPhoto.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);

    this.componentDidMount();
    this.GetUserTrashedImages();

  }

  // TODO valid id logic [have to change db]
  componentDidMount() {
    let param = this.props.location.search;
    this.state.validId = param.includes("?");
    this.state.userId = param.substring(1);
    this.state.admin = isAdmin();
    this.state.redirect = false;
  }

  //
  // axios request
  //
  deleteSelected() {
    const selected = this.state.photos.filter((value, index, array) => {
      return value.selected;
    });

    const notSelected = this.state.photos.filter((value, index, array) => {
      return !value.selected;
    });

    let promises = [];
    const that = this;
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        for (let i = 0; i < selected.length; i++) {
          promises.push(
            axios.delete("api/image/" + selected[i].meta.IId,
              { headers: { 'Authorization': "bearer " + token } })
          )
        }
      })
      .catch(function (err) { console.log("Could not authorize: " + err.response); });

    axios.all(promises)
      .then(function () {
        that.setState({ photos: notSelected })

      })
      .catch(function (err) { console.log("Delete failed: " + err.response); });
  }

  // get Images with the userid
  GetUserTrashedImages() {
    let userid = getUser().profile.oid;

    // TODO -- add check for validId
    if (this.state.admin && this.state.validId) {
      userid = this.state.userId;
    }

    const that = this;
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.get("/api/user/" + userid + "/images/trashed", { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            var images = [];
            res.data.map((image, index) => {
              images.push({
                src: "/api/image/" + image.IId, width: 5, height: 4, alt: image.IId, meta: image
              });
            });
            that.setState({ photos: images });
          })
      })
      .catch(function () { console.log("Error: Could not get token"); });
  }

  RecoverSelectedImages() {
    const selected = this.state.photos.filter((value, index, array) => {
      return value.selected;
    });

    const notSelected = this.state.photos.filter((value, index, array) => {
      return !value.selected;
    });

    let promises = [];

    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        for (let i = 0; i < selected.length; i++) {
          selected[i].meta.Trashed = false;
          promises.push(
            axios.put("/api/image/" + selected[i].meta.IId, selected[i].meta,
              { headers: { 'Authorization': "bearer " + token } })
          )
        }
      }).catch(function (err) { console.log(err.message); });

    const that = this;
    axios.all(promises)
      .then(function () {
        that.setState({ photos: notSelected });
        /*if (isIE() && selected.length > 0) {
          window.location.reload();
        }*/
      })
      .catch(function (err) { console.log(err.message); });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  onRecoverBtnClick = () => {
    const selected = this.state.photos.filter((value, index, array) => {
      return value.selected;
    })

    if (selected.length <= 0) {
      alert("please select at least one image");
    } else {
      this.setState({
        selected: selected,
        redirectOption: 3,
        redirect: true
      });
    }
  }

  onGetInfo = () => {
    const selected = this.state.photos.filter((value) => { return value.selected; });

    if (selected.length > 0) {
      this.setState({ redirect: true, redirectOption: 1 });
      return;
    }

    alert("Please select image(s).");
  }

  //
  // gallery
  //
  selectPhoto(event, obj) {
    let photos = this.state.photos;
    photos[obj.index].selected = !photos[obj.index].selected;

    this.setState({ photos: photos });
  }

  toggleSelect() {
    let photos = this.state.photos.map((photo, index) => {
      return { ...photo, selected: !this.state.selectAll };
    });
    this.setState({ photos: photos, selectAll: !this.state.selectAll });
  }

  //
  // redirect
  //
  renderRedirect() {
    let redirectLink;

    switch (this.state.redirectOption) {
      case 1: // get info
        redirectLink = 'getinfo';
        if (this.state.redirect) {
          const selected = this.state.photos.filter((value, index, array) => {
            return value.selected;
          });
          return <Redirect to={{
            pathname: redirectLink,
            state: {
              photos: selected,
              redirectLink: 'trash'
            }
          }} />;
        }
        break;
      case 2: // edit image
        redirectLink = 'edit?src=' + this.state.redirectLink;
        break;
      case 3:
        if (this.state.redirect) {
          return <Redirect to={{
            pathname: "/recover",
            search: "?src",
            state: { selected: this.state.selected }
          }} />;
        }
        break;
    }

    if (this.state.redirect) {
      return <Redirect to={redirectLink} />;
    }
  }

  render() {
    return (
      <div>
        <Title title='TRASH' />
        {this.renderRedirect()}
        {this.renderFunction()}
        {this.renderContent()}
      </div>
    );
  }

  renderFunction() {
    return (
      <div className="fnbar">
        <button onClick={this.onGetInfo}>Get Info</button>
        {isAdmin() ?
          <button onClick={this.onRecoverBtnClick}>Recover</button> :
          <button onClick={this.RecoverSelectedImages}>Recover</button>}
        <button onClick={this.toggleSelect}>Select All</button>
        {isAdmin() ? <button onClick={this.deleteSelected}>Delete</button> : null}
      </div>
    );
  }

  renderContent() {
    return (
      <div>
        <Gallery
          photos={this.state.photos}
          columns={4}
          onClick={this.selectPhoto}
          ImageComponent={SelectedImage}
          margin={4}
          direction={"row"}
        />
      </div>
    );
  }

}
