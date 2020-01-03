import React, { Component } from 'react';
import { Title } from './Title';
import ReactTable from 'react-table'
import axios from 'axios'
import { adalConfig, authContext } from '../adalConfig';
import { adalGetToken } from "react-adal";

export class Metadata extends Component {

  constructor(props) {

    super(props);

    this.state = {
      classification: [],
      metadata: [],
      newTag: "",
      newDescription: "",
      showTags: false,
      showMeta: true,
      showNew: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  changeActiveTag(tagName, isActive, description, tagLink) {
    let _tagName = tagName;         // string
    let _description = description; // string
    let _isActive = isActive;       // boolean
    let _tagLink = tagLink;         // array (probably empty?)

    let tagPayload = { TagName: _tagName, Description: _description, Active: _isActive, TagLink: _tagLink };
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.put("api/tag/" + _tagName, tagPayload, { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log("successfully changed tag!");
            console.log(res);
          })
          .catch(res => {
            console.log("caught error for changing tag!");
            console.log(res);
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  }

  changeMetaTag(metaName, isActive, isMandatory) {
    let _metaName = metaName;       // string
    let _isActive = isActive;       // boolean
    let _isMandatory = isMandatory; // boolean
    if (!_isActive) {
      _isMandatory = false;
    }

    let metaPayload = { MetaName: _metaName, Active: _isActive, Mandatory: _isMandatory };

    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.put("api/metadata/" + _metaName, metaPayload, { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log("successfully changed metadata!");
            console.log(res);
          })
          .catch(res => {
            console.log("caught error for changing metadata!");
            console.log(res);
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  }

  createTag(tagName, description) {
    let _tagName = tagName;
    let _description = description;
    let _isActive = true;

    let tagPayload = { TagName: _tagName, Description: _description, Active: _isActive };

    console.log("inside createTag!");
    console.log(tagPayload);

    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.post("api/tag", tagPayload, { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log("successfully created tag!");
            // alert("New Classification Created. Name: " + this.state.newTag + ", Description: " + _description);
            console.log(res);
            window.location.reload()

          })
          .catch(res => {
            console.log("caught error for creating tag!");
            console.log(res);
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });

  }

  componentDidMount() {
    const that = this;
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.get("/api/tag", { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log("successfully grabbed tag!");
            console.log("this is the result: ");
            console.log(res.data);

            that.setState({ classification: res.data });
          })
          .catch(res => {
            console.log("caught error for getting tag!");
            console.log(res);
          });

        axios.get("/api/metadata", { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log("successfully grabbed metadata!");
            console.log("this is the result: ");
            console.log(res.data);

            that.setState({ metadata: res.data });
          })
          .catch(res => {
            console.log("caught error for getting tag!");
            console.log(res);
          });
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });

    this.setState({ showTags: false, showMeta: true, showAdd: false });
  }

  render() {
    return (
      <div>
        <div className={this.state.showTags ? '' : 'hidden'}>
          <Title title='MANAGEMENT: CLASSIFICATION' />
          <div className="fnbar">
            <button onClick={() => { this.setState({ showTags: true, showMeta: false }); }}>Show Classification</button>
            <button onClick={() => { this.setState({ showMeta: true, showTags: false }); }}>Show Metadata</button>
          </div>
          {this.renderAddTag()}
          {this.renderClassification()}
        </div>
        <div className={this.state.showMeta ? '' : 'hidden'}>
          <Title title='MANAGEMENT: METADATA' />
          <div className="fnbar">
            <button onClick={() => { this.setState({ showTags: true, showMeta: false }); }}>Show Classification</button>
            <button onClick={() => { this.setState({ showMeta: true, showTags: false }); }}>Show Metadata</button>
          </div>
          {this.renderMetadata()}
        </div>
      </div>
    );
  }

  handleChange(event) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let _description = this.state.newDescription;

    if (_description === "") {
      _description = this.state.newTag;
    }
    if (!(this.state.newTag === "")) {
      this.createTag(this.state.newTag, _description);
      // this.setState({newTag: ""});
    }
    else {
      alert("Please input name for new classification.");
    }

  }

  renderAddTag() {
    return (
      <div>
        <div className="fnbar">
          <button onClick={() => { this.setState({ showAdd: !this.state.showAdd }); }}>Add Classification</button>
        </div>
        <div className={this.state.showAdd ? '' : 'hidden'}>
          <form onSubmit={this.handleSubmit} className="handleTag">
            New Classification Name:
                        <label>
              <input type="text" name="newTag" color={'black'} value={this.state.newTag} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Add" />
          </form>
        </div>
      </div>
    )
  }

  renderMetadata() {
    if (this.state) {
      // console.log("this is metadata!");
      // console.log(this.state.metadata);
      const metadata = this.state.metadata;


      const statusStyle = {
        margin: '0px 0px 0px 70px'
      };

      //data for data table
      const dataM = [];
      for (let i = 0; i < metadata.length; i++) {
        let individualMetadata = {};
        individualMetadata.id = i;
        individualMetadata.MetaName = metadata[i].MetaName;
        individualMetadata.Active = metadata[i].Active;
        individualMetadata.Mandatory = metadata[i].Mandatory;
        dataM.push(individualMetadata);
      }

      const columns = [
        {
          Header: 'Metadata Name',
          accessor: 'MetaName'
        },
        {
          Header: 'Active',
          accessor: 'Active',
          Cell: (props) => <span><input type="checkbox" checked={props.original.Active} onChange={(e) => {
            if (this.state.metadata[props.original.id].Active) {
              this.state.metadata[props.original.id].Mandatory = false;
            }
            this.state.metadata[props.original.id].Active = !this.state.metadata[props.original.id].Active;
            this.setState({ metadata: this.state.metadata });
            this.changeMetaTag(props.original.MetaName, !props.original.Active, props.original.Mandatory);
          }} style={statusStyle} /></span>
        },
        {
          Header: 'Mandatory',
          accessor: 'Mandatory',
          Cell: (props) => <span><input type="checkbox" checked={props.original.Mandatory} onChange={(e) => {
            if (this.state.metadata[props.original.id].Active) {
              this.state.metadata[props.original.id].Mandatory = !this.state.metadata[props.original.id].Mandatory;
              this.setState({ metadata: this.state.metadata });
              this.changeMetaTag(props.original.MetaName, props.original.Active, !props.original.Mandatory);
            }
            else {
              alert("Metadata: " + props.original.MetaName + " is inactive.");
            }
          }} style={statusStyle} /></span>
        },
      ];

      return (
        <div>
          <ReactTable
            data={dataM}
            columns={columns}
            defaultPageSize={10}
            minRows={10}
          />
        </div>
      )
    }
  }

  renderClassification() {
    if (this.state) {
      // console.log("this is state!");
      // console.log(this.state.classification);
      const classification = this.state.classification;


      const statusStyle = {
        margin: '0px 0px 0px 70px'
      };

      //data for data table
      const data = [];
      for (let i = 0; i < classification.length; i++) {
        let individualTag = {};
        individualTag.id = i;
        individualTag.TagName = classification[i].TagName;
        individualTag.Active = classification[i].Active;
        individualTag.Description = classification[i].Description;
        individualTag.TagLink = classification[i].TagLink;
        data.push(individualTag);
      }

      const columns = [
        {
          Header: 'Classification Name',
          accessor: 'TagName'
        },
        {
          Header: 'Active',
          accessor: 'Active',
          // Checked grabs the active value from props, and changes this with changeActiveTag(TagName, opposite of current value for Active).
          Cell: (props) => <span><input type="checkbox" checked={props.original.Active} onChange={(e) => {
            this.state.classification[props.original.id].Active = !this.state.classification[props.original.id].Active;
            this.setState({ classification: this.state.classification });
            this.changeActiveTag(props.original.TagName, !props.original.Active, props.original.Description, props.original.TagLink);
          }} style={statusStyle} /></span>
        },
      ];

      return (
        <div>
          <ReactTable
            data={data}
            columns={columns}
            defaultPageSize={10}
            minRows={10}
          />
        </div>
      )
    }
  }

}
