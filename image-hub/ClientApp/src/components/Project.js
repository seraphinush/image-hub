import React, { Component } from 'react';
import { Title } from './Title';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import axios from 'axios'
import { adalConfig, authContext } from '../adalConfig';
import { Link } from 'react-router-dom';
import { adalGetToken } from "react-adal";

export class Project extends Component {

  constructor(props) {

    super(props);

    this.state = {
      projects: [],
      showAdd: false,
      ProjectName: "",
      CreatedDate: "",
      Description: "",
      Active: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.PostProject = this.PostProject.bind(this);
    this.PutProject = this.PutProject.bind(this);

  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // get all projects
  GetProjects() {
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.get("/api/project", { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            return res;
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  };

  // get a project with projectname
  GetProject(projectname) {
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.get("/api/project/" + projectname, { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log("project: " + JSON.stringify(res));
            return res;
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  };

  // post a project
  PostProject(event) {
    event.preventDefault();
    let date = new Date(Date.now());
    const that = this;

    if (this.state.ProjectName === "") return alert("Please fill in the Project Name");
    this.setState({ CreatedDate: date.toDateString() });

    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        let payload = that.state;
        axios.post("/api/project", payload, { headers: { 'Authorization': "bearer " + token } })
          .then(response => {
            console.log(response);
            window.location.reload();
          })
          .catch(error => {
            console.log(error);
            alert("The Project Name already exists!")
          });
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  }

  // put a project with project name
  PutProject(state, projectName, isActive) {
    //event.preventDefault();
    const that = state;
    /*let project = that.state.projects.find(function (project) {
      return project.ProjectName === that.state.ProjectName;
    });*/

    let payload = {
      CreatedDate: null,
      ProjectName: null,
      Description: null,
      Active: isActive
    };

    // if (project === undefined || project === null) return alert("Project Doesn't Exist");


    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.put("/api/project/" + projectName, payload,
          { headers: { 'Authorization': "bearer " + token } })
          .then(response => {
            alert("Project: " + projectName + " has been set to " + isActive + " for Active.");
            that.setState({ projects: that.state.projects });
          })
          .catch(error => {
            console.log(error);
          });
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  }

  searchProject(projectName) {
    this.props.history.push("/search?project=" + projectName);
  }

  ///////////////////////////////////////////////////////////

  componentDidMount() {
    const that = this;
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.get("/api/project", { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            that.setState({ projects: res.data })
          }).catch(err => {
            console.log(err);
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  }


  render() {
    return (
      <div>
        <Title title='MANAGEMENT : PROJECT' />
        {this.renderFunction()}
        {this.renderAddProject()}
        {this.renderContent()}
      </div>
    );
  }


  renderFunction() {
    return (
      <div className="fnbar">
        <button onClick={() => { this.setState({ showAdd: !this.state.showAdd }); }}>Create Project</button>
      </div>
    )
  }

  renderAddProject() {
    return (
      <div className={this.state.showAdd ? '' : 'hidden'}>
        <form onSubmit={this.PostProject} className="handleTag">
          New Project Name:
          <label>
            <input type="text" name="ProjectName" value={this.state.ProjectName} onChange={this.handleChange} />
          </label>
          <br />
          Active?:
                <label>
            <input
              type="checkbox"
              name="Active"
              checked={this.state.Active}
              onChange={this.handleChange} />
          </label>
          <input type="submit" value="Add" />
        </form>
      </div>
    )
  }

  renderContent() {
    const { projects } = this.state;
    const tableData = [];

    for (let i = 0; i < projects.length; i++) {
      let project = {};
      project.name = <Link to={{
        pathname: "/search",
        hash: "project",
        state: { projectName: projects[i].ProjectName }
      }}
      >
        {projects[i].ProjectName} </Link>;


      project.uniqueName = projects[i].ProjectName;
      project.date = projects[i].CreatedDate.substring(0, 10);

      project.description = projects[i].Description;
      project.active = projects[i].Active;
      project.id = i;
      tableData.push(project);
    }

    const statusStyle = {
      margin: '0px 0px 0px 70px'
    };

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Status',
        accessor: 'active',
        Cell: (props) => <span><input type="checkbox" checked={props.original.active} onChange={(e) => {
          //alert("Project: " + props.original.uniqueName + " has been set to " + !props.original.active + " for Active.");

          this.state.projects[props.original.id].Active = !this.state.projects[props.original.id].Active;
          //this.setState({ projects: this.state.projects });
          this.PutProject(this, props.original.uniqueName, this.state.projects[props.original.id].Active);
        }} style={statusStyle} /></span>
      },
      {
        Header: 'Date Created',
        accessor: 'date'
      },
      {
        Header: 'Description',
        accessor: 'description',
        show: false
      },
    ];

    return (
      <div>
        <ReactTable
          data={tableData}
          columns={columns}
          defaultPageSize={10}
          minRows={10}
          defaultSorted={[{ id: "date", desc: true }]}
        />
      </div>
    )
  }

}
