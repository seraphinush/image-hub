import React, { Component } from 'react';
import axios from 'axios'
import { getToken } from '../../adalConfig';

export class Log extends Component {
    displayName = Log.name

    constructor(props) {

        super(props);
    }

    GetLogs() {
        axios.get("/api/log", { headers: { 'Authorization': "bearer " + getToken() } })
            .then(res => {
                return;
            })
    };

    GetAuth() {
        axios.get("/api/log/auth", { headers: { 'Authorization': "bearer " + getToken() } })
            .then(res => {
                return;
            })
    };
    
    PostLog() {
        axios.post("/api/log", {
            LId: 'log777',
            UId: 'userA',
            CreatedDate: '2009-05-08 14:40:52',
            Log1: 'TESTLOG'
        }, { headers: { 'Authorization': "bearer " + getToken() } })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <br />
                <button onClick={this.GetAuth}>GetAuth</button><br />
                <button onClick={this.GetLogs}>GetLogs</button><br/>
                <button onClick={this.PostLog}>PostLog</button><br/>
            </div>
        );
    }
}
