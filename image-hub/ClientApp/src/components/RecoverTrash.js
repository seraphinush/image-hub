import React, { Component } from 'react';
import { Title } from './Title';
import Select from 'react-select';
import { adalConfig, authContext, isAdmin } from '../adalConfig';
import { adalGetToken } from "react-adal";
import axios from 'axios';
import Gallery from './custom-photo-gallery';
import { Redirect } from 'react-router-dom';

import '../index.css';

export class RecoverTrash extends Component {

	constructor(props) {

		super(props);

		this.state = {
			images: this.props.location.state.selected,
			redirect: false,
			admin: false,
			validId: false,
			userId: null,
			user: null,
			project: null,
			users: [],
			trashed: true
		};

		this.componentDidMount();
		this.getUsers();

	}

	componentDidMount() {
		this.state.admin = isAdmin();
	}

	//
	// axios request
	//
	getUsers() {
		const that = this;
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then(function (token) {
				axios.get("/api/graph", { headers: { 'Authorization': "bearer " + token } })
					.then(res => {
						let users = [];
						res.data.map((user, index) => {
							users.push({
								value: user.id,
								label: user.displayName
							})
						});
						that.setState({ users: users });
					})
			}).catch(function (err) {
				console.log("Error: Couldn't get token")
			});
	}

	onSubmit = () => {
		if (!this.state.user) {
			alert("please select a user");
			return;
		}

		let images = [];

		for (let i = 0; i < this.state.images.length; i++) {
			images.push({
				IId: this.state.images[i].meta.IId,
				meta: this.state.images[i].meta
			});
		}
		let promises = [];

		if (this.state.trashed) {
			this.setState({ trashed: false });
			const that = this;
			adalGetToken(authContext, adalConfig.endpoints.api)
				.then(function (token) {
					for (let i = 0; i < images.length; i++) {
						images[i].meta.Trashed = false;
						images[i].meta.UId = that.state.user.value;
						promises.push(
							axios.put("/api/image/" + images[i].meta.IId, images[i].meta,
								{ headers: { 'Authorization': "bearer " + token } })
						)
					}
				}).catch(function (err) {
					console.log(err.message);
				});

			axios.all(promises)
				.then(function () {
					that.setState({
						redirect: true
					});
				})
				.catch(function (err) {
					console.log(err.message);
				});

		}
	};

	//
	// handle
	//
	handleDropdownChange = (event) => {
		console.log(event);
		this.setState({ user: event });
	}

	onCancel = () => {
		this.setState({ redirect: true });
	}

	//
	// redirect
	//
	renderRedirect = () => {
		let redirectLink = 'user';

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
				<Title title='RECOVER IMAGES' />
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
				<button onClick={this.onSubmit}>Recover</button>
			</div>
		);
	}

	renderContent() {
		const userOptions = this.state.users;

		return (
			<div>
				<div>
					<Select
						placeholder='Select User..'
						value={this.state.user}
						onChange={this.handleDropdownChange}
						options={userOptions}
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