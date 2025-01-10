import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { UserContext } from '../../UserContext'; // Adjust the path according to your structure
import axios from 'axios'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; 

import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';


const NavigationBar = () => {
    const { user, signInWithGoogle, signOut } = useContext(UserContext);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        
        const checkUser = async () => {
            try {
                const response = await axios.get('http://localhost:5001/auth/current_user', {
                    withCredentials: true, // Include credentials for authentication
                });
                if (response.status === 200) {
                    setUserId(response.data._id)
                }
            } catch (error) {
                console.error('Failed to retrieve user:', error);
                window.location.href = '/';
            }
        };

        checkUser();
    }, []);

    const handleLogin = () => {
        window.location.href = 'http://localhost:5001/auth/google';
    };

    const handleLogout = async () => {
        try {
            Cookies.remove('userId');
            const response = await axios.post('http://localhost:5001/auth/logout', {
                withCredentials: true,
            });
            if (response.status == 200) {
                setUserId(null)
                navigate('/');
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    return (
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg" style={{ width: '100%', height:'10%', padding: '0'}}>
            <Navbar.Brand href="#home" style={{marginLeft: '2%', height:'100%', display: 'flex',
    alignItems: 'center'}}>Major Decisions</Navbar.Brand>
                <Nav className="ml-auto" style={{height: '100%'}}>
                    {userId ? (
                        <>
                            <Nav.Link href="/career" className="nav-item">Home</Nav.Link>
                            <Nav.Link href="/timeline/research" className="nav-item">Timeline</Nav.Link>
                            <Nav.Link onClick={handleLogout} className="nav-item">Sign Out</Nav.Link>
                            
                        </>
                    ) : (
                        <Nav.Link onClick={handleLogin} className="nav-item">Sign in with Google</Nav.Link>
                    )}
                </Nav>
        </Navbar>
    );
};

export default NavigationBar;
