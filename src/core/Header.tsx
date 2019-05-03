import React, { Component } from 'react';

import { Link } from "react-router-dom";

import {AuthButton} from './Auth'

import './Header.scss';

function Header() {
    return (
        <header className="App-header">
            <Link to="/"><strong className="App-title">Reminders</strong></Link>
            <AuthButton />
            {/* <Link to="/login">login</Link> */}
        </header>
   );
}

export default Header;
