import React, { Component } from 'react';
import { Title } from './Title';
import Select from 'react-select';
import { adalConfig, authContext, isAdmin } from '../adalConfig';
import { adalGetToken } from "react-adal";
import axios from 'axios';
import Gallery from './custom-photo-gallery';
import { Redirect } from 'react-router-dom';

import '../index.css';

export class Submit extends Component {

  constructor(props) {

    super(props);

    this.state = {
      images: this.props.location.state.selected,
      redirect: false,
      admin: false,
      validId: false,
      userId: '',
      project: null,
      projectOptions: [],
      submitted: false
    };

    this.componentDidMount();
    this.getProjectOptions();

  }

  // TODO valid id logic [have to change db]
  componentDidMount() {
    let param = this.props.location.search;
    this.state.admin = isAdmin();
  }

  //
  // axios request
  //
  getProjectOptions = () => {
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then((token) => {
        axios.get("/api/project", { headers: { 'Authorization': "bearer " + token } })
          .then((res) => {
            let projectOptions = [];

            for (let i = 0; i < res.data.length; i++) {
              let isActive = res.data[i].Active;

              if (isActive) {
                let projectName = res.data[i].ProjectName;
                projectOptions.push({ value: projectName, label: projectName });
              }
            }

            this.setState({ projectOptions: projectOptions });
          })
          .catch(function (err) { console.log(err.message); });
      })
      .catch(function () { console.log("Error: Couldn't get token"); });
  }

  onSubmit = () => {
    if (!this.state.project) {
      alert("please select a project");
      return;
    }

    let images = [];

    for (let i = 0; i < this.state.images.length; i++) {
      images.push(this.state.images[i].meta.IId);
    }

    if (!this.state.submitted) {
      const that = this;
      this.setState({ submitted: true });
      adalGetToken(authContext, adalConfig.endpoints.api)
        .then(function (token) {
          axios({
            url: '/api/submit',
            method: 'POST',
            data: { images: images, project: that.state.project.value },
            headers: {
              'Authorization': "bearer " + token
            }
          }).then(res => {
            that.setState({
              redirect: true
            });
          })
        }).catch(function (err) {
          console.log("Error: Couldn't get token");
        });
    }
  }

  //
  // handle
  //
  handleDropdownChange = (event) => {
    this.setState({ project: event });
  }

  onCancel = () => {
    this.setState({ redirect: true });
  }

  //
  // redirect
  //
  renderRedirect = () => {
    let redirectLink = 'palette';

    if (this.state.redirect) {
      return <Redirect to={redirectLink} />
    }
  }

  //
  // render
  //
  render() {
    return (
      <div>
        <Title title='SUBMIT IMAGES' />
        {this.renderRedirect()}
        {this.renderFunction()}
        {this.renderContent()}
      </div>
    );
  }

  renderFunction() {
    return (
      <div className="fnbar">
        <button onClick={this.onCancel}>Cancel</button>
        <button onClick={this.onSubmit}>Submit</button>
      </div>
    );
  }

  renderContent() {
    const { projectOptions } = this.state;

    return (
      <div>
        <div>
          <Select
            placeholder='Select Project..'
            value={this.state.project}
            onChange={this.handleDropdownChange}
            options={projectOptions}
            isSearchable={true}
          />
        </div>
        <div>
          <Gallery
            photos={this.state.images}
            columns={3}
            margin={4}
            direction={"row"}
          />
        </div>
      </div>
    );
  }

}