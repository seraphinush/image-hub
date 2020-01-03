import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Search } from './components/Search';
import { Palette } from './components/Palette';
import { GetInfo } from './components/sub-components/get-info';
import { Log } from './components/Log';
import { Trash } from './components/Trash';
import { Project } from './components/Project';
import { Metadata } from './components/Metadata';
import { User } from './components/User';
import { Upload } from './components/Upload';
import { ImageEditor } from './components/ImageEditor'
import { Submit } from './components/Submit'
import { LogView } from './components/LogView'
import {GetInfoTrash} from "./components/sub-components/get-info-trash";
import {RecoverTrash} from "./components/RecoverTrash";
import {AddUser} from "./components/sub-components/add-user";

export default class App extends Component {
    displayName = App.name

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/submit' component={Submit} />
                <Route path='/search' component={Search} />
                <Route path='/upload' component={Upload} />
                <Route path='/palette' component={Palette} />
                <Route path='/getinfo' component={GetInfo} />
                <Route path='/trashinfo' component={GetInfoTrash} />
                <Route path='/edit' component={ImageEditor} />
                <Route path='/log' component={Log} />
                <Route path='/logview' component={LogView} />
                <Route path='/trash' component={Trash} />
                <Route path='/project' component={Project} />
                <Route path='/metadata' component={Metadata} />
                <Route path='/user' component={User} />
                <Route path='/recover' component={RecoverTrash} />
                <Route path='/adduser' component={AddUser} />
            </Layout>
        );
    }
}