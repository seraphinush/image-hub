import React, { Component } from 'react';
import { Title } from './Title';
import axios from 'axios';
import { adalConfig, authContext, getToken } from '../adalConfig';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { adalGetToken } from "react-adal";
import { Redirect } from "react-router-dom";

export class User extends Component {

  constructor(props) {
    super(props);
    this.getUsers = this.getUsers.bind(this);
    this.getUsers();

    this.state = {
      users: [],
      redirect: false

    };
  }

  viewPalette(userid) {
    this.props.history.push("/palette?" + userid);
  }

  viewTrash(userid) {
    this.props.history.push("/trash?" + userid);
  }

  onAddUser = () => {
    this.setState({ redirect: true });
  };

  makeAdmin(userId) {
    console.log(userId);
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.put("/api/graph/" + userId, null, { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            console.log(res);
            alert("The selected User has been made an admin.");
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });

  }

  getUsers() {
    const that = this;
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(function (token) {
        axios.get("/api/graph", { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            var users = [];
            console.log(res);
            res.data.map((user, index) => {
              users.push({
                name: user.displayName,
                email: user.mail,
                uid: user.id,
                userPrincipalName: user.userPrincipalName
              })
            });
            that.setState({ users: users });
          })
      }).catch(function (err) {
        console.log("Error: Couldn't get token")
      });
  }

  deleteUser(uid) {
    const that = this;
    let users = this.state.users;
    adalGetToken(authContext, adalConfig.endpoints.api)
      .then(token => {
        axios.delete("api/graph/" + uid, { headers: { 'Authorization': "bearer " + token } })
          .then(res => {
            let index = users.map(value => {
              return value.uid;
            }).indexOf(uid);

            users.splice(index, 1);
            this.setState({ users: users });
          })
          .catch(err => {
            console.log(err);
          });
      })
  }

  renderRedirect() {
    let redirectLink = 'adduser';

    if (this.state.redirect) {
      return <Redirect to={{
        pathname: redirectLink,
      }} />;
    }
  }

  render() {
    return (
      <div>
        {this.renderRedirect()}

        <div>
          <div>
            <Title title='MANAGEMENT: USER' />
            <div className="fnbar">
            </div>
          </div>
        </div>
        <div id="palcontent">
          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderContent() {
    const statusStyle = {
      margin: '0px 0px 0px 70px'
    };

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
        show: true
      },
      {
        Header: 'UId',
        accessor: 'uid',
        show: false
      },
      {
        Header: 'userPrincipalName',
        accessor: 'userPrincipalName',
        show: false
      }
    ];

    const sub_columns = columns.slice(0);
    sub_columns.push({
      id: 'button',
      accessor: 'uid',
      Cell: ({ value }) => (<div class="fnbar">
        <button onClick={() => {
          this.makeAdmin(value);
        }}>Make Admin
        </button>
      </div>)
    });

    sub_columns.push({
      id: 'button2',
      accessor: 'uid',
      Cell: ({ value }) => (<div className="fnbar">
        <button onClick={() => {
          this.viewPalette(value);
        }}>View Palette
        </button>
      </div>)
    });

    sub_columns.push({
      id: 'button3',
      accessor: 'uid',
      Cell: ({ value }) => (<div className="fnbar">
        <button onClick={() => {
          this.viewTrash(value);
        }}>View Trash
                </button>
      </div>)
    });

    sub_columns.push({
      id: 'button4',
      accessor: 'uid',
      Cell: ({ value }) => (<div className="fnbar">
        <button onClick={() => {
          this.deleteUser(value);
        }}>Delete User
        </button>
      </div>)
    });
    return (
      <div>
        <div className='fnbar'>
          <button onClick={this.onAddUser}>Add User</button>
        </div>
        <div>
          <ReactTable
            data={this.state.users}
            columns={sub_columns}
            defaultPageSize={10}
            minRows={10}
          />
        </div>
      </div>
    )
  }

}