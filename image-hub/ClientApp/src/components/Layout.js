import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-bootstrap';
import { Header } from './Header';
import { NavMenu } from './NavMenu';

export class Layout extends Component {

	displayName = Layout.name

	render() {
		return (
			<Grid fluid>
				<Row>
					<Col>
						<Header />
					</Col>
				</Row>
				<Row>
					<Col sm={3}>
						<NavMenu />
					</Col>
					<Col sm={9}>
						{this.props.children}
					</Col>
				</Row>
			</Grid>
		);
	}

}
