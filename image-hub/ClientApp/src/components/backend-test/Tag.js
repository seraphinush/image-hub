import React, { Component } from 'react';
import axios from 'axios'
import { getToken } from '../../adalConfig';

export class Tag extends Component {
    displayName = Tag.name

    constructor(props) {
        super(props);
    }

    GetTags() {
        axios.get("/api/tag", { headers: { 'Authorization': "bearer " + getToken() } })
            .then(res => {
                return;
            })
    }

    PostTag() {
        axios.post("/api/tag", {
            TagName: 'testTag',
            Description: 'TESTTAG',
            Active: 1
        }, { headers: { 'Authorization': "bearer " + getToken() } })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }

    PutTag() {
        axios.put("/api/tag/testTag", {
            TagName: 'testTag',
            Description: 'TESTTAG',
            Active: 0
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
                <button onClick={this.GetTags}>GetTags</button><br/>
                <button onClick={this.PostTag}>PostTag</button><br/>
                <button onClick={this.PutTag}>PutTag</button><br/>
            </div>
        );
    }
}