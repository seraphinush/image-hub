import React, { Component } from 'react';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { isAdmin } from '../adalConfig';
import './Main.css';

export class NavMenu extends Component {

	displayName = NavMenu.name

	render() {

		let status = isAdmin();

		if (!status) {
			return (
				<Navbar fluid>
					<Nav>
						<LinkContainer to={'/search'}>
							<NavItem>search</NavItem>
						</LinkContainer>
						<LinkContainer to={'/upload'}>
							<NavItem>upload</NavItem>
						</LinkContainer>
						<LinkContainer to={'/palette'}>
							<NavItem>user palette</NavItem>
						</LinkContainer>
						<LinkContainer to={'/log'}>
							<NavItem>log</NavItem>
						</LinkContainer>
						<LinkContainer to={'/trash'}>
							<NavItem>trash</NavItem>
						</LinkContainer>
					</Nav>
				</Navbar>
			);
		} else {
			return (
				<Navbar fluid>
					<Nav>
						<LinkContainer to={'/search'}>
							<NavItem>search</NavItem>
						</LinkContainer>
						<LinkContainer to={'/upload'}>
							<NavItem>upload</NavItem>
						</LinkContainer>
						<LinkContainer to={'/palette'}>
							<NavItem>user palette</NavItem>
						</LinkContainer>
						<LinkContainer to={'/log'}>
							<NavItem>log</NavItem>
						</LinkContainer>
						<LinkContainer to={'/trash'}>
							<NavItem>trash</NavItem>
						</LinkContainer>
						<LinkContainer to={'/project'}>
							<NavItem>project</NavItem>
						</LinkContainer>
						<LinkContainer to={'/metadata'}>
							<NavItem>metadata</NavItem>
						</LinkContainer>
						<LinkContainer to={'/user'}>
							<NavItem>user</NavItem>
						</LinkContainer>
					</Nav>
				</Navbar>
			);
		}
	}

}
