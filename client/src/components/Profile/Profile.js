import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../UserContext';
import Cookies from 'js-cookie';

import axios from 'axios';
const Career = () => {
    const [user, setUsera] = useState(null); 
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        
        const checkUser = async () => {
            try {
                const response = await axios.get('http://localhost:5001/auth/current_user', {
                    withCredentials: true, // Include credentials for authentication
                });
                if (response.status === 200) {
                    setUsera(response.data); // Update state with user data
                    setUser(response.data);
                    Cookies.set('userId', response.data._id, { expires: 7 });
                }
            } catch (error) {
                console.error('Failed to retrieve user:', error);
                // Redirect to the home page if the request fails (user is not authenticated)
                window.location.href = '/';
            }
        };

        checkUser();
    }, []);

    const checktopmajors = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/topmajors/${user._id}`, {
                withCredentials: true, // Include credentials for authentication
            });

        } catch (error) {
            console.error('Failed to retrieve user:', error);
            // window.location.href = '/';
        }
    };

    const gotoselectmajor = async () => {
            navigate('/selectMajor');
        
    };

    const handleLogout = async () => {
        try {
            Cookies.remove('userId');
            const response = await axios.post('http://localhost:5001/auth/logout', {
                withCredentials: true, // Include credentials for authentication
            });
            if (response.status == 200) {
                window.location.href = 'http://localhost:3000/';
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    
    const checkUser = async () => {
        try {
            const response = await axios.get('http://localhost:5001/auth/current_user', {
                withCredentials: true, // Include credentials for authentication
            });

        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };


    return (
        <div>
        {user ? <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Logout with Google
            </button>
            <button onClick={checkUser} style={{ padding: '10px 20px', fontSize: '16px' }}>
                Chcekuser
            </button>  
            <button onClick={checktopmajors} style={{ padding: '10px 20px', fontSize: '16px' }}>
                cehcktopmajor
            </button>  
            <button onClick={gotoselectmajor} style={{ padding: '10px 20px', fontSize: '16px' }}>
                gotoselect majors
            </button>  
        </div> : null}
        </div>
    );
    
};

export default Career;
