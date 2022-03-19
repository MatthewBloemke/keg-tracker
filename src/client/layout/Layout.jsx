import React, { useEffect, useState } from 'react'
import Routes from './Routes';
import Menu from './Menu';
import "./Layout.css"
import { useHistory } from 'react-router-dom';
import { loginCheck } from '../utils/api';

const Layout = () => {
    const history = useHistory();

    const [pathName, setPathName] = useState(window.location.pathname);

    history.listen((location) => {
        setPathName(location.pathname)
    })

    useEffect(() => {
        const abortController = new AbortController()
        loginCheck()
        .then(response => {
            if (!response) {
                console.log("no auth token")
                history.push("/login")  
                return () => {
                    abortController.abort()
                }
            }
        })
        return () => abortController.abort()
    }, [pathName])
    const height = {height: "100vh"}
    return (
        <main>
            <div className="header">
                <p></p>
                <p></p>
                <h1>Keg Tracker</h1>
                <p id="bottomLayoutHeader"></p>
            </div>
            <div style={height} className="container-fluid">
                <div className="row h-100">
                    <div className="col-md-2 side-bar">
                        <Menu/>
                    </div>
                    <div className="col" id="mainDisplay">
                        <Routes/>
                    </div>
                </div>
            </div>            
        </main>
    )
}

export default Layout;