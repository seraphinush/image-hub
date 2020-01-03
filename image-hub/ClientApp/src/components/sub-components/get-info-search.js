import React, { Component } from 'react';
import { Title } from '../Title';
import { TextInput } from './form-text-input';
import { Dropdown } from './form-dropdown';
import { Redirect } from 'react-router-dom';

import { authContext, adalConfig } from "../../adalConfig";
import axios from 'axios';

import './get-info.css';

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { adalGetToken } from "react-adal";

export class GetInfoSearch extends Component {

	constructor(props) {

		super(props);

		this.state = {
			classification: {},
			photos: props.location.state.photos,

			redirectLink: props.location.state.redirectLink,
			redirectOption: false,
			redirect: false,
			photoIndex: 0,
			isOpen: false
		};

		this.getClassification();

	}

	//
	// axios request
	//
	getClassification = () => {
		const that = this;
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then(function (token) {
				axios.get("/api/tag", { headers: { 'Authorization': "bearer " + token } })
					.then((res) => {
						let obj = {};
						obj[''] = '';

						res.data.forEach((item) => {
							let name = item.TagName.slice(0, 1).toUpperCase() + item.TagName.substring(1);
							obj[name] = {
								name: name,
								selected: false
							};
						});

						that.setState({ classification: obj });
					})
					.catch((err) => { console.log(err); });
			}).catch(function (err) {
				console.log("Error: Couldn't get token")
			});
	};

	getProject = () => {
		// STUB
	}

	//
	// helper
	//
	listItems(photo, item) {
		let str = '';

		if (item === 'classification') {
			str = photo.TagLink[0] || '';

			for (let i = 1; i < photo.TagLink.length; i++) {
				str = str + ', ' + photo.TagLink[i];
			}
		}
		else if (item === 'project') {
			str = photo.ProjectLink[0] || '';

			for (let i = 1; i < photo.ProjectLink.length; i++) {
				str = str + ', ' + photo.ProjectLink[i];
			}
		}

		return str;
	}

	onCancel = () => {
		this.setState({
			redirectOption: false,
			redirect: true
		});
	};

	//
	// redirect
	//
	renderRedirect = () => {
		if (this.state.redirect) {
			if (this.state.redirectOption) {
				return <Redirect to={{
					pathname: this.state.redirectLink,
					state: { photos: this.state.photos }
				}} />
			}
			else {
				return <Redirect to={this.state.redirectLink} />;
			}
		}
	};

	//
	// render
	//
	render() {
		return (
			<div>
				<Title title='GET INFO' />
				{this.renderRedirect()}
				{this.renderFunction()}
				{this.renderGetInfo()}
			</div>
		);
	}

	renderFunction() {
		const { photoIndex, isOpen } = this.state;
		let images = [];
		this.state.photos.map((i) =>
			images.push(i.src)
		);
		console.log(images);

		return (
			<div className="fnbar">
				<button onClick={this.onCancel}>Close</button>
				<button type="button" onClick={() => this.setState({ isOpen: true })}>
					Zoom
                </button>
				{isOpen && (
					<Lightbox
						mainSrc={images[photoIndex]}
						nextSrc={images[(photoIndex + 1) % images.length]}
						prevSrc={images[(photoIndex + images.length - 1) % images.length]}
						onCloseRequest={() => this.setState({ isOpen: false })}
						onMovePrevRequest={() =>
							this.setState({
								photoIndex: (photoIndex + images.length - 1) % images.length
							})
						}
						onMoveNextRequest={() =>
							this.setState({
								photoIndex: (photoIndex + 1) % images.length
							})
						}
					/>
				)}
			</div>
		);

	}

	renderGetInfo() {
		let selected = this.state.photos;

		let placeholder = selected.length > 1 ? 'Various' : this.listItems(selected[0].meta, 'classification');

		const class_options = this.state.classification;
		class_options[''] = placeholder;

		return (
			<div id="getinfo">
				<div className="float-left">
					{this.renderImages()}
				</div>

				<div className="float-right">
					<h2>IMAGE NAME :</h2>
					<p>
						<TextInput
							disabled={true}
							id='getinfo_name'
							value={selected.length > 1 ? 'Various' : null}
							placeholder={selected.length > 1 ? 'Various' : selected[0].meta.ImageName}
							onChange={null} />
						<br />
					</p>
					<h2>UPLOADED DATE :</h2>
					<p>
						<TextInput
							disabled={true}
							id='getinfo_date'
							value={selected.length > 1 ? 'Various' : selected[0].meta.UploadedDate}
							onChange={null} />
						<br />
					</p>
					<h2>UPLOADED BY :</h2>
					<p>
						<TextInput
							disabled={true}
							id='getinfo_user'
							value={selected.length > 1 ? 'Various' : selected[0].meta.UId}
							onChange={null} />
						<br />
					</p>
					<h2>CLASSIFICATION :</h2>
					<p>
						{<TextInput
							disabled={true}
							id="getinfo_class"
							value={[]}
							onChange={null} />}
					</p>
					<h2>PROJECT :</h2>
					<p>
						<TextInput
							disabled={true}
							id='getinfo_proj'
							placeholder={selected.length > 1 ? 'Various' : selected[0].meta.ProjectLink[0]}
							onChange={null} />
					</p>
				</div>
			</div>
		);
	}

	renderImages = () => {
		let render = [];

		for (let i = 0; i < this.state.photos.length; i++) {
			render.push(
				<div key={i}>
					<img key={i} src={this.state.photos[i].src} />
					<p style={{ textAlign: 'center' }}>{this.state.photos[i].meta.ImageName}</p>
				</div>
			);
		}

		return render;
	}

}