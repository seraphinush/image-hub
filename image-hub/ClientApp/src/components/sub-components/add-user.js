import React, { Component } from 'react';
import { Title } from '../Title';
import axios from 'axios';
import { adalConfig, authContext } from '../../adalConfig';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { adalGetToken } from "react-adal";
import { Tooltip } from "react-bootstrap";
export class AddUser extends Component {

	constructor(props) {

		super(props);

		this.state = {
			email: "",
			displayName: "",
			givenName: "",
			surname: "",
			mailNickname: "",
			userPrincipalName: "",
			value: ""
		};

		this.handleChange = this.handleChange.bind(this);
		this.addUser = this.addUser.bind(this);

	}

	handleChange(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	inviteGuestUser(email) {
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then(token => {
				axios.post("api/graph/" + email, { headers: { 'Authorization': "bearer " + token } })
					.then(res => {
						alert("Invitation has been sent");
					})
					.catch(err => {
						console.log(err);
					});
			});
	}

	addUser(event) {
		event.preventDefault();
		let email = this.state.email;
		let msg = "A New Guest User Has Been Created. Please Check Your Email To Activate Your Account";
		// TODO -- isGuest is currently hardcoded
		const isGuest = !this.state.email.includes("@sample");
		if (!isGuest &&
			(this.state.displayName === ""
				|| this.state.givenName === ""
				|| this.state.surname === ""
				|| this.state.mailNickname === "")
			|| this.state.email === ""
		) return alert("Missing Required Fields");

		if (!isGuest) {
			this.setState({ userPrincipalName: email, email: "" })
		}
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then(token => {
				axios.post("api/graph/" + this.state.email, this.state, { headers: { 'Authorization': "bearer " + token } })
					.then(res => {
						if (!isGuest) {
							alert("Password for the newly created user is: " + res.data + "\n" + "Make sure to save the password.");
						} else {
							alert(msg);
						}
					})
					.catch(err => {
						let data = err.response.data;
						if (data.includes("userPrincipalName already exists")) {
							return alert("User Already Exists");
						}
						console.log(err);
						return alert("Couldn't Add The User");
					});
			});
	}

	render() {
		const usernameStyle = { marginLeft: '22px', };
		const firstnameStyle = { marginLeft: '23px', };
		const lastnameStyle = { marginLeft: '25px', };
		const emailStyle = { marginLeft: '56px', };
		const nicknameStyle = { marginLeft: '29px', };
		const submitStyle = { marginLeft: '0px', };

		return (
			<div>
				<Title title='MANAGEMENT: USER' />
				<div className="addUser">
					<form onSubmit={this.addUser}>
						<label>
							User Name:
                                <input type="text"
								style={usernameStyle}
								placeholder="UserName"
								name="displayName"
								value={this.state.displayName}
								onChange={this.handleChange} />
						</label>
						<br />
						<label>
							First Name:
                                <input type="text"
								style={firstnameStyle}
								name="givenName"
								placeholder="FirstName"
								value={this.state.givenName}
								onChange={this.handleChange} />
						</label>
						<br />
						<label>
							Last Name:
                                <input type="text"
								style={lastnameStyle}
								name="surname"
								placeholder="LastName"
								value={this.state.surname}
								onChange={this.handleChange} />
						</label>
						<br />
						<label>
							E-Mail:
                                <input type="text"
								style={emailStyle}
								placeholder="E-Mail"
								name="email"
								value={this.state.email}
								onChange={this.handleChange} />
						</label>
						<br />
						<label>
							Nickname:
                                <input type="text"
								style={nicknameStyle}
								name="mailNickname"
								placeholder="Nickname"
								value={this.state.mailNickname}
								onChange={this.handleChange} />
						</label>
						<br />
						<input type="submit" style={submitStyle} value="Submit" />
					</form>
				</div>
			</div>
		);
	}

}