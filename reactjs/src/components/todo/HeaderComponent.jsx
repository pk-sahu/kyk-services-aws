import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AuthenticationService from './AuthenticationService.js'
import UserDataService from '../../api/todo/UserDataService.js';
import { USER_NAME_SESSION_ATTRIBUTE_NAME, USER_ROLE } from '../../Constants.js';

class HeaderComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userrole: ''
        }
    }

    // reloadRoute = () => {        
    //     return true;
    // }  onClick={this.reloadRoute()}
    render() {
        const isUserLoggedIn = AuthenticationService.isUserLoggedIn();
        const userRole = sessionStorage.getItem(USER_ROLE);
        const isAdmin = 'ROLE_ADMIN' === userRole; 
        const fetchRole = () => {
            let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
            if(user !== null && userRole === null){
                UserDataService.getUserDetail(user)
                        .then((response) => {
                            sessionStorage.setItem(USER_ROLE, response.data)
                            this.setState({ userrole: response.data })
                        }).catch(() => {
                            sessionStorage.setItem(USER_ROLE, null)
                            this.setState({ userrole: '' })
                        })
            }
            return user;
        }
        fetchRole();
        return (
           <nav className="navbar navbar-expand-lg header">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" 
                        data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span ><i className="fas fa-bars fa-1x"></i></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar-nav">
                            {isUserLoggedIn && <li><Link className="nav-link" to="/home" >Home</Link></li>}
                            {isUserLoggedIn && 
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="" 
                                          data-toggle="dropdown" aria-haspopup="true" 
                                          aria-expanded="false">Worksheet</Link>
                                    <div className="dropdown-menu sub-menu" 
                                         aria-labelledby="navbarDropdownMenuLink">
                                        {isUserLoggedIn && isAdmin && 
                                            <Link className="dropdown-item sub-menu-item" 
                                              to="/worksheets">Edit/Delete</Link>}
                                        {isUserLoggedIn && isAdmin && 
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/worksheets/-1">Add</Link>}
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/worksheet">View</Link>
                                    </div>
                                </li>
                            }
                            {isUserLoggedIn && isAdmin && 
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="" 
                                          data-toggle="dropdown" aria-haspopup="true" 
                                          aria-expanded="false">Users</Link>
                                    <div className="dropdown-menu sub-menu" 
                                         aria-labelledby="navbarDropdownMenuLink">
                                        {isUserLoggedIn && isAdmin && 
                                            <Link className="dropdown-item sub-menu-item" 
                                              to="/users">Edit/Delete</Link>}
                                        {isUserLoggedIn && isAdmin && 
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/users/-1">Add</Link>}
                                    </div>
                                </li>
                            }
                            {isUserLoggedIn && 
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="" 
                                          data-toggle="dropdown" aria-haspopup="true" 
                                          aria-expanded="false">Assignments</Link>
                                    <div className="dropdown-menu sub-menu" 
                                         aria-labelledby="navbarDropdownMenuLink">
                                        {isUserLoggedIn && isAdmin && 
                                            <Link className="dropdown-item sub-menu-item" 
                                              to="/sessions">Edit/Delete</Link>}
                                        {isUserLoggedIn && isAdmin && 
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/sessions/-1">Add</Link>}
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/assignment">View</Link>
                                    </div>
                                </li>
                            }
                            {isUserLoggedIn && 
                                <li className="nav-item dropdown">
                                    <Link className="nav-link dropdown-toggle" to="" 
                                          data-toggle="dropdown" aria-haspopup="true" 
                                          aria-expanded="false">Gallery</Link>
                                    <div className="dropdown-menu sub-menu" 
                                         aria-labelledby="navbarDropdownMenuLink">
                                        {isUserLoggedIn && isAdmin && 
                                            <Link className="dropdown-item sub-menu-item" 
                                              to="/galleries">Edit/Delete</Link>}
                                        {isUserLoggedIn && isAdmin && 
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/galleries/-1">Add</Link>}
                                        <Link className="dropdown-item sub-menu-item" 
                                                to="/gallery">View</Link>
                                    </div>
                                </li>
                            }
                            {isUserLoggedIn && <li><Link className="nav-link" to="/contactus" >Contact Us</Link></li>}
                        </ul>
                        <ul className="navbar-nav navbar-collapse justify-content-end">
                            {!isUserLoggedIn && <li><Link className="nav-link" to="/signin">Sign In</Link></li>}
                            {isUserLoggedIn && <li><Link className="nav-link" to="/logout" onClick={AuthenticationService.logout}>Logout</Link></li>}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default HeaderComponent