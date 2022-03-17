import React, { useEffect, useState } from 'react'
import Routes from './Routes';
import Menu from './Menu';
import "./Layout.css"
import { useHistory } from 'react-router';
import { loginCheck } from '../utils/api';

const Layout = () => {
    const history = useHistory();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    const [pathName, setPathName] = useState(window.location.pathname);

    history.listen((location) => {
        setPathName(location.pathname)
    })

    useEffect(() => {
        const abortController = new AbortController()
        loginCheck(API_BASE_URL)
        .then(response => {
            if (!response) {
                return () => {
                    abortController.abort()
                    history.push("/login")  
                } 
            }
        })
        return () => abortController.abort()
    }, [pathName])
    const height = {height: "100vh"}
    return (
        <div style={height} className="container-fluid">
            <div className="row h-100">
                <div className="col-md-2 side-bar">
                    <Menu/>
                </div>
                <div className="col">
                    <Routes/>
                </div>
            </div>
        </div>
    )
}

export default Layout;