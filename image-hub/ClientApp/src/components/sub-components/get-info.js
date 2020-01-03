import React, { Component } from 'react';
import { Title } from '../Title';
import { TextInput } from './form-text-input';
import { Redirect } from 'react-router-dom';
import Select from "react-dropdown-select";
import axios from 'axios';

import './get-info.css';

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { adalGetToken } from "react-adal";
import { authContext, adalConfig } from "../../adalConfig";

export class GetInfo extends Component {

	constructor(props) {

		super(props);

		this.state = {
			classifications: [],
			projects: [],
			selected_images: props.location.state.photos,

			redirectLink: props.location.state.redirectLink,
			redirectOption: false,
			redirect: false,
			photoIndex: 0,
			isOpen: false,
		}
		if (this.props.location.state.redirectLink === "search") {
			this.state.searchString = this.props.location.state.searchString;
			this.state.searchOption = this.props.location.state.searchOption;
		}
		this.getClassifications();

	}

	//
	// axios request
	//
	getClassifications = () => {
		const that = this;
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then(function (token) {
				axios.get("/api/tag", { headers: { 'Authorization': "bearer " + token } })
					.then((res) => {
						for (let tag of res.data) {
							if (tag.Active) {
								that.state.classifications.push(tag);
							}
						}
					}).catch((err) => { console.log(err); });
			}).catch(function (err) {
				console.log("Error: Couldn't get token")
			});
	}

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

	//
	// redirect
	//
	renderRedirect = () => {
		console.log(this.state.redirectLink)

		if (this.state.redirect) {
			if (this.state.redirectOption) {
				return <Redirect to={{
					pathname: this.state.redirectLink,
				}} />
			} else {
				return <Redirect to={this.state.redirectLink} />;
			}
		}
	};

	renderFunction() {
		const { photoIndex, isOpen } = this.state;
		let images = [];
		this.state.selected_images.map((i) =>
			images.push(i.src)
		);
		return (
			<div className="fnbar">
				<button onClick={this.onCancel}>Cancel</button>
				<button onClick={this.onSave}>Save</button>
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

	/* map of renderGetInfo
		 (trash || search)
				 (multiple)
				 (single)
		 (palette)
				 (multiple)
				 (single)  str[0] == "'" && str[str.length - 1] == "'"
	 */
	renderGetInfo() {
		let str = this.state.searchString;
		console.log(JSON.stringify(str));
		if (this.state.redirectLink === "trash" || this.state.redirectLink === "search") {
			if (this.state.redirectLink === "search" && this.state.selected_images.length > 1
				&& this.state.searchOption === "Project" && str.indexOf('"') === 0 && str.lastIndexOf('"') === str.length - 1) {
				return (
					<div id="getinfo">
						<div className="float-left">
							{this.renderImages()}
						</div>

						<div className="float-right">
							<h2>IMAGE NAME :</h2>
							<TextInput
								disabled={true}
								id='getinfo_name'
								value={'multi-images selected'}
							/>
							<br />
							<h2>UPLOADED DATE :</h2>
							<TextInput
								disabled={true}
								id='getinfo_date'
								value={'multi-images selected'}
							/>
							<br />
							<h2>UPLOADED BY :</h2>
							<TextInput
								disabled={true}
								id='getinfo_user'
								value={'multi-images selected'}
							/>
							<br />
							<h2>CLASSIFICATION :</h2>
							<Select
								multi
								disabled={true}
								values={['multi-images selected']}
								labelField="TagName"
								valueField="TagName"
								options={this.state.classifications}
							/>
							<h2>PROJECT :</h2>
							<TextInput
								disabled={true}
								id='getinfo_proj'
								value={this.state.searchString}
							/>
						</div>
					</div>
				);
			}
			else if (this.state.selected_images.length > 1) {
				return (
					<div id="getinfo">
						<div className="float-left">
							{this.renderImages()}
						</div>

						<div className="float-right">
							<h2>IMAGE NAME :</h2>
							<TextInput
								disabled={true}
								id='getinfo_name'
								value={'multi-images selected'}
							/>
							<br />
							<h2>UPLOADED DATE :</h2>
							<TextInput
								disabled={true}
								id='getinfo_date'
								value={'multi-images selected'}
							/>
							<br />
							<h2>UPLOADED BY :</h2>
							<TextInput
								disabled={true}
								id='getinfo_user'
								value={'multi-images selected'}
							/>
							<br />
							<h2>CLASSIFICATION :</h2>
							<Select
								multi
								disabled={true}
								values={['multi-images selected']}
								labelField="TagName"
								valueField="TagName"
								options={this.state.classifications}
							/>
							<h2>PROJECT :</h2>
							<TextInput
								disabled={true}
								id='getinfo_proj'
								value={'multi-images selected'}
							/>
						</div>
					</div>
				);
			} else {
				let image = this.state.selected_images[0];
				let projects = Array.from(image.meta.ProjectLink).map(function (pl) {
					return pl.ProjectName;
				})
				return (
					<div id="getinfo">
						<div className="float-left">
							{this.renderImages()}
						</div>

						<div className="float-right">
							<h2>IMAGE NAME :</h2>
							<TextInput
								disabled={true}
								id='getinfo_name'
								value={image.meta.ImageName}
							/>
							<br />
							<h2>UPLOADED DATE :</h2>
							<TextInput
								disabled={true}
								id='getinfo_date'
								value={image.meta.UploadedDate}
							/>
							<br />
							<h2>UPLOADED BY :</h2>
							<TextInput
								disabled={true}
								id='getinfo_user'
								value={image.meta.U.UserName}
							/>
							<br />
							<h2>CLASSIFICATION :</h2>
							<Select
								multi
								disabled={true}
								values={image.meta.TagLink}
								labelField="TagName"
								valueField="TagName"
								options={this.state.classifications}
							/>
							<h2>PROJECT :</h2>
							<TextInput
								disabled={true}
								id='getinfo_proj'
								value={projects}
							/>
						</div>
					</div>
				);
			}
		} else {
			// palette case      
			if (this.state.selected_images.length > 1) {
				return (
					<div id="getinfo">
						<div className="float-left">
							{this.renderImages()}
						</div>

						<div className="float-right">
							<h2>IMAGE NAME :</h2>
							<TextInput
								disabled={true}
								id='getinfo_name'
								value={'multi-images selected'}
							/>
							<br />
							<h2>UPLOADED DATE :</h2>
							<TextInput
								disabled={true}
								id='getinfo_date'
								value={'multi-images selected'}
							/>
							<br />
							<h2>UPLOADED BY :</h2>
							<TextInput
								disabled={true}
								id='getinfo_user'
								value={'multi-images selected'}
							/>
							<br />
							<h2>CLASSIFICATION :</h2>
							<Select
								multi
								values={[]}
								labelField="TagName"
								valueField="TagName"
								options={this.state.classifications}
							/>
							<h2>PROJECT :</h2>
							<TextInput
								disabled={true}
								id='getinfo_proj'
								value={'multi-images selected'}
							/>
						</div>
					</div>
				);
			} else {
				let image = this.state.selected_images[0];
				let projects = Array.from(image.meta.ProjectLink).map(function (pl) {
					return pl.ProjectName;
				})
				return (
					<div id="getinfo">
						<div className="float-left">
							{this.renderImages()}
						</div>

						<div className="float-right">
							<h2>IMAGE NAME :</h2>
							<TextInput
								//                              disabled={selected.length > 1}
								id='getinfo_name'
								defaultValue={''}
								placeholder={image.meta.ImageName}
							/>
							<br />
							<h2>UPLOADED DATE :</h2>
							<TextInput
								disabled={true}
								id='getinfo_date'
								value={image.meta.UploadedDate}
							/>
							<br />
							<h2>UPLOADED BY :</h2>
							<TextInput
								disabled={true}
								id='getinfo_user'
								value={image.meta.U.UserName}
							/>
							<br />
							<h2>CLASSIFICATION :</h2>
							<Select
								multi
								values={image.meta.TagLink}
								labelField="TagName"
								valueField="TagName"
								options={this.state.classifications}
							/>
							<h2>PROJECT :</h2>
							<TextInput
								disabled={true}
								id='getinfo_proj'
								value={projects}
							/>
						</div>
					</div>
				);
			}
		}
	}

	onSave = () => {
		adalGetToken(authContext, adalConfig.endpoints.api).then(async (token) => {

			if (this.state.selected_images.length === 1) {
				let image = this.state.selected_images[0];

				await this.handleChangeImageName(image, token);
				await this.handleCleanTags(image, token);
				await this.handlePostTags(image, token);
			} else {
				let images = this.state.selected_images;

				for (var image of images) {
					await this.handleCleanTags(image, token);
					await this.handlePostTags(image, token);
				}
			}

			this.setState({
				redirect: true
			});

		})
	}

	handleChangeImageName = async (image, token) => {
		let imagename = document.getElementById("getinfo_name").value;

		if (imagename != '') {
			await axios.put("/api/image/" + image.meta.IId,
				{
					ImageName: imagename,
					UId: null,
					Trashed: null,
					Submitted: null,
				},
				{
					headers: {
						'Authorization': "bearer " + token
					}
				})
				.then(() => {
					image.meta.ImageName = imagename;
				}).catch((err) => { console.log(err); });
		}
	}

	handleCleanTags = async (image, token) => {
		await axios.delete("/api/tag/taglink/" + image.meta.IId,
			{ headers: { 'Authorization': "bearer " + token } })
			.then((res) => {
				console.log("tags on the " + image.meta.ImageName + "are cleaned")
			}).catch((err) => { console.log(err); })
	};

	handlePostTags = async (image, token) => {
		let selected_tags = Array.from(document.getElementsByClassName("react-dropdown-select-option-label")).map(function (cn) {
			return cn.innerText;
		});

		var newtags = [];
		for (var tag of selected_tags) {
			if (!image.meta.TagLink.includes(tag)) {
				newtags.push(tag);
			}
		}
		if (newtags.length !== 0) {
			await axios.post("/api/tag/taglinks",
				{
					TagNames: newtags,
					IId: image.meta.IId,
				},
				{ headers: { 'Authorization': "bearer " + token } }
			).then(() => {
				console.log("tags are added on " + image.meta.ImageName);
				image.meta.TagLink.concat(newtags);
			}).catch((err) => { console.log(err); });
		}
	}

	onCancel = () => {
		this.setState({
			//redirectOption: false,
			redirect: true
		});
	};

	renderImages = () => {
		let render = [];
		for (let i = 0; i < this.state.selected_images.length; i++) {
			var image = this.state.selected_images[i];
			render.push(
				<div key={i}>
					<img key={i} id={image.meta.IId} src={image.src} />
					<p style={{ textAlign: 'center' }}>{image.meta.ImageName}</p>
				</div>
			);
		}
		return render;
	}

}