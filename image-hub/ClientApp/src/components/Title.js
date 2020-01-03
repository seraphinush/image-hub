import React, { Component } from 'react';

export class Title extends Component {

	render() {
		// const header = {
		//     title: this.props.title,
		//     function: this.props.function
		// }
		return (
			<h2>{this.props.title}</h2>
		);
	}

}
