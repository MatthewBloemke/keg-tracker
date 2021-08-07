import React from 'react';
import { Link } from 'react-router-dom';

const KegSubMenu = () => {
    return (
        <ul>
            <li>
                <Link to="/kegs">View Kegs</Link>
            </li>
            <li>
                <Link to="/kegs/track">Track Kegs</Link>
            </li>
            <li>
                <Link to="/kegs/new">New Keg</Link>
            </li>
            <li>
                <Link to="/kegs/edit">Edit Keg</Link>
            </li>
        </ul>
    )
}

export default KegSubMenu;