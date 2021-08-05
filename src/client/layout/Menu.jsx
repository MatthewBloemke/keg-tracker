import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
    return (
        <nav className="navbar navbar-dark align-items-start p-0">
            <div className="container-fluid d-flex flex-column p-0">
                <li>
                    <Link to="/">
                        <button className="btn btn-primary">Home</button>
                    </Link>
                </li>
                <li>
                    <Link to="/kegs">
                        Kegs
                    </Link>            
                </li>
                <li>
                    <Link to="/distributors">
                        Distributors
                    </Link>
                </li>
                <li>
                    <Link to="employees">
                        Employees
                    </Link>
                </li>                
            </div>

        </nav>
    )

}

export default Menu;