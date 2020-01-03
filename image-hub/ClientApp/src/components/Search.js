import React, { Component } from 'react';
import { Title } from './Title';
import { Dropdown } from './sub-components/form-dropdown';
import { TextInput } from './sub-components/form-text-input';
import { adalConfig, authContext, getUser } from '../adalConfig';
import { adalGetToken } from "react-adal";
import axios from 'axios';
import Gallery from './custom-photo-gallery';
import SelectedImage from './SelectedImage';
import { Redirect } from 'react-router-dom';

/*
* Icon made by Egor Rumyantsev
* From www.flaticon.com
* Licensed by Creative Commons 3.0 BY
*/
import cancelIcon from './sub-components/cancel.svg';

import '../index.css';
import './Search.css';

export class Search extends Component {

	constructor(props) {

		super(props);

		this.state = {
			option: '',
			input_1: '',
			input_2: '',

			search_option: '',
			search_input_1: '',
			search_input_2: '',

			showDateInput: false,
			showInfo: false,
			showResults: false,

			photos: [],
			classifications: [],
			projects: [],

			filters: [],
			filteredPhotos: [],
			selectAll: false,

			redirect: false
		};

		this.dropdown_options = {
			'': ['Select Option', null],
			'Name': ['Name', null],
			'Classification': ['Classification', null],
			'Project': ['Project', null],
			//'Metadata': ['Select Option', selected: null],
			'User': ['User', null],
			'Date': ['Date', null],
		}

		this.text_options = {
			'': 'Search..',
			'Name': 'eg. img_sample_name',
			'Classification': 'eg. Bridge',
			'Project': 'eg. Project A',
			//'Metadata': 'eg. Bridge',
			'User': 'eg. John Smith',
			'Date': 'eg. yyyymmdd'
		}

		this.getClassification();
		this.getProject();

	}

	componentDidMount() {
		if (this.props.location.hash.includes("#project")) {
			this.state.input_1 = '"' + this.props.location.state.projectName + '"';
			this.state.option = "Project";
			this.getSearch();
		}
	}

	//
	// axios request
	//
	getClassification = () => {
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then((token) => {
				axios.get("/api/tag", { headers: { 'Authorization': "bearer " + token } })
					.then((res) => {
						let array = [];

						res.data.forEach((item) => {
							if (item.Active) {
								array.push(item.TagName);
							}
						});

						this.setState({ classifications: array });
					})
					.catch(function (err) { console.log(err.message); });
			})
			.catch(function () { console.log("Error: Could not get token"); });
	}

	getProject = () => {
		adalGetToken(authContext, adalConfig.endpoints.api)
			.then((token) => {
				axios.get("/api/project", { headers: { 'Authorization': "bearer " + token } })
					.then(res => {
						let array = [];

						res.data.forEach((item) => {
							if (item.Active) {
								array.push(item.ProjectName);
							}
						})

						this.setState({ projects: array });
					})
					.catch(function (err) { console.log(err.message); });
			})
			.catch(function () { console.log("Error: Could not get token"); });
	};

	getSearch = () => {
		let request_query = '';
		let photos = [];

		switch (this.state.option) {
			case 'Name':
				request_query = "/api/search/image/" + this.state.input_1;
				break;
			case 'Classification':
				request_query = "/api/search/tag/" + this.state.input_1;
				break;
			case 'Project':
				request_query = "/api/search/project/" + this.state.input_1;
				break;
			case 'User':
				request_query = "/api/search/user/" + this.state.input_1;
				break;
			case 'Date':
				request_query = "/api/search/date/" + this.state.input_1.toString() + this.state.input_2.toString();
				break;
			default:
				break;
		}

		adalGetToken(authContext, adalConfig.endpoints.api)
			.then((token) => {
				const request_param = { headers: { 'Authorization': "bearer " + token } };

				axios.get(request_query, request_param)
					.then((res) => {
						photos = res.data.map((image, index) => {
							image.UploadedDate = image.UploadedDate.substring(0, 10);

							return { src: "/api/image/" + image.IId, width: 5, height: 4, alt: image.IId, meta: image };
						});

						this.setState({
							filteredPhotos: photos,
							photos: photos,
							showResults: true
						});
					}).catch(function (err) { alert('Please search with valid input.'); });
			})
			.catch(function () { console.log("Error: Could not get token"); });
	}

	handleSubmit = () => {
		let selected = this.state.photos.filter((value) => { return value.selected; });
		let notSelected = this.state.photos.filter((value) => { return !value.selected; });
		let promise = [];

		adalGetToken(authContext, adalConfig.endpoints.api)
			.then(function (token) {
				const request_param = { headers: { 'Authorization': "bearer " + token } };

				for (let i = 0; i < selected.length; i++) {
					let image = selected[i].meta;
					promise.push(
						axios.put("/api/image/" + image.IId, {
							UId: getUser().profile.oid,
							ImageName: null,
							Trashed: null,
							Submitted: 'False'
						}, request_param)
					)
				}

			})
			.catch(function () {
				console.log("Error: Couldn't get token");
			});

		axios.all(promise)
			.then(() => { this.setState({ filteredPhotos: notSelected, redirect: false }); })
			.catch((e) => {
				console.log(e);
			});
	};

	//
	// handle
	//
	handleListChange = (e) => {
		if (e.target.value === 'Date') {
			this.setState({
				option: e.target.value,
				input_1: '',
				input_2: '',
				showDateInput: true
			});
		}
		else {
			this.setState({
				option: e.target.value,
				input_1: '',
				input_2: '',
				showDateInput: false
			});
		}
	}

	handleTextChange = (e) => {
		this.setState({ [e.target.id]: e.target.value });
	}

	buildQuery = () => {
		let input_1 = this.state.input_1 !== '' ? this.state.input_1 : '';
		let input_2 = this.state.input_1 !== '' ? this.state.input_2 : '';

		if (this.state.option === 'Date') {
			input_1 = parseInt(input_1, 10);
			input_2 = parseInt(input_2, 10);
		}

		let res = {
			option: this.state.option,
			input_1: input_1,
			input_2: input_2
		}

		return res;
	}

	onPressEnter(e) {
		if (e.key === 'Enter') {
			//
		}
	}

	onSearch = async (e) => {
		e.preventDefault();

		if (this.state.option === '') {
			alert('Please select an option.');
			return;
		}

		let curQuery = this.buildQuery();

		if (curQuery.option === 'Date' && (isNaN(curQuery.input_1) || isNaN(curQuery.input_2))) {
			alert('Please search with the correct date format: yyyymmdd');
			return;
		}

		if (!curQuery.input_1) {
			return;
		}

		this.getSearch();

		this.setState({
			search_option: curQuery.option,
			search_input_1: curQuery.input_1,
			search_input_2: curQuery.input_2
		});
	}

	resetSearch = () => {
		this.setState({
			input_1: '',
			input_2: '',

			search_option: '',
			search_input_1: '',
			search_input_2: '',

			showInfo: false,
			showResults: false,

			photos: [],

			filters: [],
			filteredPhotos: [],
			selectAll: false,

			redirect: false
		});
	}

	onAddFilter = async (e) => {
		e.preventDefault();

		let curQuery = this.buildQuery();

		if (curQuery.option === '') {
			alert('Please select an option.');
			return;
		}

		if (!curQuery.input_1) {
			return;
		}

		if (curQuery.option === 'Date' && (!curQuery.input_1 || !curQuery.input_2)) {
			alert('Please search with the correct date format: yyyymmdd');
			return;
		}

		if (curQuery.option === 'Date') {
			let filter_pre = curQuery.input_1.toString();
			let filter_post = curQuery.input_2.toString();

			if (filter_pre.length !== 8 || filter_post.length !== 8) {
				alert('Please search with the correct date format: yyyymmdd');
				return;
			}

			let date_pre = new Date(filter_pre.substring(0, 4) + '-' + filter_pre.substring(4, 6) + '-' + filter_pre.substring(6, 8));
			let date_post = new Date(filter_post.substring(0, 4) + '-' + filter_post.substring(4, 6) + '-' + filter_post.substring(6, 8));

			if (date_pre == 'Invalid Date' || date_post == 'Invalid Date') {
				alert('Please search with valid date(s).');
				return;
			}
		}

		let filteredPhotos = await this.performFilter(this.state.filteredPhotos, curQuery);

		// add query
		let allFilters = this.state.filters;
		allFilters.push(curQuery);

		this.setState({
			filters: allFilters,

			filteredPhotos: filteredPhotos
		});
	}

	performFilter(photos, filter) {
		return new Promise(resolve => {
			let filtered = photos.filter((item) => {
				let res = false;

				switch (filter.option) {
					case 'Name':
						res = item.meta.ImageName.includes(filter.input_1);
						break;
					case 'Classification':
						for (let i = 0; i < item.meta.TagLink.length; i++) {
							if (item.meta.TagLink[i].TagName.toLowerCase().includes(filter.input_1.toLowerCase())) {
								res = true;
								break;
							}
						}
						break;
					case 'Project':
						for (let i = 0; i < item.meta.ProjectLink.length; i++) {
							if (item.meta.ProjectLink[i].ProjectName.toLowerCase().includes(filter.input_1.toLowerCase())) {
								res = true;
								break;
							}
						}
						break;
					case 'User':
						res = item.meta.U.UserName.toLowerCase().includes(filter.input_1.toLowerCase());
					case 'Date':
						//let filter_now = item.meta.UploadedDate.split('-')
						let filter_pre = filter.input_1.toString();
						let filter_post = filter.input_2.toString();

						//let date_now = new Date(filter_now[0] + '-' + filter_now[1] + '-' + filter_now[2]);
						let date_now = new Date(item.meta.UploadedDate);
						let date_pre = new Date(filter_pre.substring(0, 4) + '-' + filter_pre.substring(4, 6) + '-' + filter_pre.substring(6, 8));
						let date_post = new Date(filter_post.substring(0, 4) + '-' + filter_post.substring(4, 6) + '-' + filter_post.substring(6, 8));

						if (date_pre <= date_now && date_now <= date_post) {
							res = true;
						}
						break;
					default:
						break;
				}

				return res;
			});

			resolve(filtered);
		});
	}

	onRemoveFilter = async (index) => {
		if (this.state.filters.length === 1) {
			this.setState({
				filters: [],
				filteredPhotos: this.state.photos
			});

			return;
		}

		let filters = this.state.filters;
		filters.splice(index, 1);
		let filteredPhotos = this.state.photos;

		for (let i = 0; i < filters.length; i++) {
			let filter = filters[i];

			filteredPhotos = await this.performFilter(filteredPhotos, filter);
		}

		this.setState({
			filters: filters,
			filteredPhotos: filteredPhotos
		});
	}

	selectPhoto = (e, obj) => {
		let photos = this.state.filteredPhotos;
		photos[obj.index].selected = !photos[obj.index].selected;

		this.setState({ filteredPhotos: photos });
	}

	toggleSelect = () => {
		let photos = this.state.filteredPhotos.map((photo, index) => {
			return { ...photo, selected: !this.state.selectAll };
		});

		this.setState({
			filteredPhotos: photos,
			selectAll: !this.state.selectAll
		});
	}

	//
	// get info
	//
	onGetInfo = (e) => {
		const selected = this.state.photos.filter((value) => { return value.selected; });
		console.log(selected);

		if (selected.length > 0 && !this.state.showInfo) {
			this.setState({
				redirectLink: '',
				redirectOption: 1,
				redirect: true
			});
			return;
		}

		alert("Please select image(s).");
	}

	renderRedirect() {
		let redirectLink = 'getinfo';

		if (this.state.redirect) {
			const selected = this.state.photos.filter((value, index, array) => {
				return value.selected;
			});

			return <Redirect to={{
				pathname: redirectLink,
				state: {
					photos: selected,
					redirectLink: 'search',
					searchString: this.state.input_1,
					searchOption: "Project"
				}
			}} />;
		}
	}

	//
	// render
	//
	render() {
		return (
			<div>
				<Title title='SEARCH' />
				{this.renderRedirect()}
				{this.renderSearchBar()}
				{this.renderSearchInfo()}
				{this.renderFilters()}
				{this.renderFunction()}
				{this.renderContent()}
			</div>
		);
	}

	renderSearchBar = () => {
		return (
			<div id="search-form">
				<form>
					<Dropdown
						multiple={false}
						id="search-dropdown"
						options={this.dropdown_options}
						onChange={this.handleListChange} />
					{this.state.showDateInput ? <span>FROM</span> : null}
					<TextInput
						id="input_1"
						option={this.state.option}
						options={this.text_options}
						value={this.state.input_1}
						onChange={this.handleTextChange} />
					{this.state.showDateInput ? <span>TO</span> : null}
					{this.state.showDateInput
						? <TextInput
							id="input_2"
							option={this.state.option}
							options={this.text_options}
							value={this.state.input_2}
							onChange={this.handleTextChange} />
						: null}
					{(this.state.showResults && this.state.filteredPhotos.length > 0) || this.state.filters.length > 0
						? null
						: <button type="submit" onClick={this.onSearch} onKeyPress={this.onPressEnter}>Search</button>}
					{(this.state.showResults && this.state.filteredPhotos.length > 0) || this.state.filters.length > 0
						? <button type="submit" onClick={this.onAddFilter}>Add Filter</button>
						: null}
					{this.state.showResults
						? <button type="submit" onClick={this.resetSearch}>Reset</button>
						: null}
				</form>
			</div>
		);
	}

	renderSearchInfo = () => {
		if (this.state.showResults) {
			if (this.search_option === 'Date') {
				return (
					<div id="search-info">
						<p>
							Search for: {this.state.search_option}, {this.state.search_input_1}-{this.state.search_input_2}
						</p>
					</div>
				);
			}
			else {
				return (
					<div id="search-info">
						<p>
							Search for: {this.state.search_option}, {this.state.search_input_1}
						</p>
					</div>
				);
			}
		}
		else {
			return (null);
		}
	}

	renderFilters = () => {
		let filters = this.state.filters;
		let res = [];

		for (let i = 0; i < filters.length; i++) {
			let filter = filters[i];

			if (filter.option === 'Date') {
				res.push(
					<button key={i} onClick={() => this.onRemoveFilter(i)}>
						<img src={cancelIcon} className="cancel-icon" alt="cancel icon" />{filter.option}: {filter.input_1}-{filter.input_2}
					</button>
				);
			}
			else {
				res.push(
					<button key={i} onClick={() => this.onRemoveFilter(i)}>
						<img src={cancelIcon} className="cancel-icon" alt="cancel icon" />{filter.option}: {filter.input_1}
					</button>
				);
			}
		}

		return (
			<div id="search-filters">
				{res}
			</div>
		);
	}

	renderFunction = () => {
		if (this.state.showResults && this.state.filteredPhotos.length > 0) {
			return (
				<div className="fnbar">
					<button onClick={this.handleSubmit}>Add To Palette</button>
					<button onClick={this.onGetInfo}>Get Info</button>
					<button onClick={this.toggleSelect}>Select All</button>
				</div>
			);
		}
	}

	renderContent = () => {
		if (this.state.showResults) {
			return (
				<div id="search-content">
					<p>Found {this.state.filteredPhotos.length} results.</p>
					{this.state.filteredPhotos.length > 0
						? <Gallery
							photos={this.state.filteredPhotos}
							columns={4}
							onClick={this.selectPhoto}
							ImageComponent={SelectedImage}
							margin={4}
							direction={"row"} />
						: null}
				</div>
			);
		}
		else {
			return null;
		}
	}
}