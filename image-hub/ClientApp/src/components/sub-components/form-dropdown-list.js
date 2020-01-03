import React, { Component } from 'react';

export class Dropdown extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<select multiple id={this.props.id} onChange={this.props.onChange}>
				{this.renderList()}
			</select>
		);
	}

	renderList = () => {
		let render = [];

		let keys = Object.keys(this.props.options);

		render.push(
			<option key='0' value={keys[0]} name="" style={{ display: 'none' }}>
				{this.props.options[keys[0]]}
			</option>
		);

		for (let i = 1; i < keys.length; i++) {
			let key = this.props.options[keys[i]];
			render.push(
				<option selected={key.selected} type="checkbox" key={i} value={keys[i]} name={key.name}>
					{key.name}
				</option>
			);
		}

		return render;
	}

}