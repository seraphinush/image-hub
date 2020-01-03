import React, { Component } from 'react';
import axios from 'axios'
import { getToken } from '../../adalConfig';

export class User extends Component {
    displayName = User.name

    constructor(props) {
        super(props);
    }

    GetUserImages() {
        axios.get("/api/user/userA/images", { headers: { 'Authorization': "bearer " + getToken() } })
        .then(res => {
            return;
        })
    }


    GetUser() {
        axios.get("/api/user/userA", { headers: { 'Authorization': "bearer " + getToken() } })
            .then(res => {
                return;
            })
    }

    GetUsers() {
        axios.get("/api/user", { headers: { 'Authorization': "bearer " + getToken() } })
            .then(res => {
                return;
            })
    }

    PostUser() {
        axios.post("/api/user", {
            UId: 'user777',
            UserName: 'testUser',
            Role: 'tester',
            Admin: 0,
            Active: 1
        }, { headers: { 'Authorization': "bearer " + getToken() } })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    PutUser() {
        axios.put("/api/user/user777", {
            UId: 'user777',
            UserName: 'testUser',
            Role: 'tester',
            Admin: 1,
            Active: 1
        }, { headers: { 'Authorization': "bearer " + getToken() } })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <br/>
                <button onClick={this.GetUserImages}>GetUserImages</button><br/>
                <button onClick={this.GetUser}>GetUser</button><br />
                <button onClick={this.GetUsers}>GetUsers</button><br />
                <button onClick={this.PostUser}>PostUser</button><br/>
                <button onClick={this.PutUser}>PutUser</button><br/>
            </div>
        );
    }
}