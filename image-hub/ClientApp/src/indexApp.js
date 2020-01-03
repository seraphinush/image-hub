import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {adalConfig, authContext, getUser} from "./adalConfig";
import  axios from "axios";
import {adalGetToken} from "react-adal";

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <App />
  </BrowserRouter>,
  rootElement);
let done = 0;

function addUser(done) {
    if (done > 1) return;
    let userID = getUser().profile.oid;
    let exists = false;

    adalGetToken(authContext, adalConfig.endpoints.api)
        .then(function (token) {
            axios.get("api/user/" + userID,  { headers: { 'Authorization': "bearer " + token } })
                .then(function (res) {
                    exists = true;
                    done++;
                }).catch(function (err) {
            }).finally(function (cont) {
                if (!exists) {
                    axios.post("api/user", null, { headers: { 'Authorization': "bearer " + token } })
                        .then(function (res) {
                            console.log("hmm")
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                }
            })
        }).catch(function (err) {
        console.log("Error: Couldn't get token")
    });

}

addUser(done);

registerServiceWorker();
