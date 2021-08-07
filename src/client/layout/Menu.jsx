import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
    const onClick = ({target}) => {
        setPath(target.innerText.toLowerCase())
    }
    const buttonStyle = {
        border: "none",
        background: "none"
    }
    const [path, setPath] = useState(window.location.pathname.slice(1))
    console.log(path)
    return (
        <nav className="navbar navbar-dark align-items-start p-0">
            <div className="container-fluid d-flex flex-column p-0">
                <li>
                    <Link to="/">
                        <button style={buttonStyle}>Home</button>
                    </Link>
                </li>
                <li>
                    <Link to="/kegs">
                        <button style={buttonStyle} onClick={onClick}>Kegs</button>
                    </Link>
                    {path ==="kegs" ? <p>Sub menu</p> : null}
                </li>
                <li>
                    <Link to="/distributors">
                        <button style={buttonStyle} onClick={onClick}>Distributors</button>
                    </Link>
                    {path ==="distributors" ? <p>Sub menu</p> : null}
                </li>
                <li>
                    <Link to="employees">
                        <button style={buttonStyle} onClick={onClick}>Employees</button>
                    </Link>
                    {path ==="employees" ? <p>Sub menu</p> : null}
                </li>                
            </div>

        </nav>
    )

}

export default Menu;