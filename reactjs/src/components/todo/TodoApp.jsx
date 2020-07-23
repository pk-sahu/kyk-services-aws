import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AuthenticatedRoute from './AuthenticatedRoute.jsx'
import SigninComponent from './SigninComponent.jsx'
import UsersComponent from './UsersComponent.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import HeaderComponent from './HeaderComponent.jsx'
import FooterComponent from './FooterComponent.jsx'
import SignoutComponent from './SignoutComponent.jsx'
import HomeComponent from './HomeComponent.jsx'
import UserComponent from './UserComponent.jsx'
import SessionsComponent from './SessionsComponent.jsx'
import SessionComponent from './SessionComponent.jsx'
import GalleryComponent from './GalleryComponent.jsx'

class TodoApp extends Component {
    render() {
        return (
            <div >
                <Router>
                    <>
                        <HeaderComponent/>
                        <Switch>
                            <Route path="/" exact component={SigninComponent}/>
                            <Route path="/signin" component={SigninComponent}/>
                            <Route path="/logout" component={SignoutComponent}/>
                            <AuthenticatedRoute path="/sessions/:id" component={SessionComponent}/>
                            <AuthenticatedRoute path="/sessions" component={SessionsComponent}/>
                            <AuthenticatedRoute path="/home" component={HomeComponent}/>
                            <AuthenticatedRoute path="/users/:id" component={UserComponent}/>
                            <AuthenticatedRoute path="/users" component={UsersComponent}/>
                            <AuthenticatedRoute path="/gallery" component={GalleryComponent}/>
                            
                            <Route component={ErrorComponent}/>
                        </Switch>
                        <div className="clear"></div>
                        <FooterComponent/>
                    </>
                </Router>
            </div>
        )
    }
}

export default TodoApp