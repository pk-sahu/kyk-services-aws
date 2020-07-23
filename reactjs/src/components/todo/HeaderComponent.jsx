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
                            {isUserLoggedIn && <li><Link className="nav-link" to="/home">Home</Link></li>}
                            {isUserLoggedIn && isAdmin && <li><Link className="nav-link" to="/users">Users</Link></li>}
                            {isUserLoggedIn && isAdmin && <li><Link className="nav-link" to="/sessions">Sessions</Link></li>}
                            {isUserLoggedIn && <li><Link className="nav-link" to="/gallery">Gallery</Link></li>}
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