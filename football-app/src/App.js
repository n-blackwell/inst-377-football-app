import React from 'react';
// import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/Home/HomePage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainNavBar from './components/MainNavBar';
import TeamsPage from './pages/Teams/TeamsPage';
import PlayersPage from './pages/Players/PlayersPage';
import AboutPage from './pages/About/AboutPage';

function App() {
    return (
        <>
            <Router>
                <MainNavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/Teams" element={<TeamsPage />} />
                    <Route path="/Players" element={<PlayersPage />} />
                    <Route path="/About" element={<AboutPage />} />
                </Routes>
            </Router>
        </>
    )
}

export default App;
