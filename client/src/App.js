import React, { useState, useEffect } from 'react';
import Home from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Career from './components/Profile/Profile';
import Chat from './components/Chat/Chat';
import CareerAdvice from './components/Career/Career';
import Timelines from './components/Timeline/Timelines';
import Admin from './components/Admin/admin';
import SelectMajor from './components/SelectMajor/SelectMajor';
import Setup from './components/SetupProfile/Setup';
import NavigationBar from './components/Navbar/Navbar';
import { UserProvider } from './UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
    return (
        <UserProvider>
        <div style={{
            height: '100vh', // 100% of the viewport height
            width: '99vw',
                overflowX: 'hidden',
            // position: 'absolute', // Ensures it covers the entire page
            alignItems: 'center',
            justifyContent: 'center',
            top: 0,
            left: 0,
            backgroundColor: '#b9bec4' // Example background color
        }}>
            <Router>
                <NavigationBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/test" element={<Career />} />
                    <Route path="/career" element={<CareerAdvice />} />
                    <Route path="/setup" element={<Setup />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/selectMajor" element={<SelectMajor />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/timeline/research" element={<Timelines type="research" />} />
                    <Route path="/timeline/industry" element={<Timelines type="industry" />} />
                </Routes>
            </Router>
        </div>
        </UserProvider>
    );

}

export default App;