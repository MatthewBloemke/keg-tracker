import React from 'react'
import Routes from './Routes';
import Menu from './Menu';
import "./Layout.css"

const Layout = () => {
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