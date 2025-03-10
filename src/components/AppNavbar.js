import { useState, useContext } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";


export default function AppNavbar(){


	const { user } = useContext(UserContext);

	console.log(user);

	return (
		<Navbar className="custom-navbar" expand="lg">
		    <Container>
		        <Navbar.Brand as={NavLink} to="/">CodeChronicles</Navbar.Brand>
		        <Navbar.Toggle aria-controls="basic-navbar-nav" />
		        <Navbar.Collapse id="basic-navbar-nav">
		            <Nav className="ms-auto"> 
		                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
		               
		                
		                {user.id !== null ? (
		                    user.isAdmin ? (
		                        <>
		                            <Nav.Link as={NavLink} to="/posts">Dashboard</Nav.Link>
		                            <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
		                        </>
		                    ) : (
		                        <>   
		                        	<Nav.Link as={NavLink} to="/posts">Blogs</Nav.Link>
		                            <Nav.Link as={NavLink} to="/addPost">Add Blog Post</Nav.Link>
		                            <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
		                        </>
		                    )
		                ) : (
		                    <>
		                    	 <Nav.Link as={NavLink} to="/posts">Blogs</Nav.Link>
		                        <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
		                        <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
		                    </>
		                )}
		            </Nav>
		        </Navbar.Collapse>
		    </Container>
		</Navbar>

	)
}
