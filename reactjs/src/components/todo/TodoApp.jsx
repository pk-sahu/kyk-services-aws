import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AuthenticatedRoute from './AuthenticatedRoute.jsx'
import SigninComponent from './SigninComponent.jsx'
import UsersComponent from './UsersComponent.jsx'
import ErrorComponent from './ErrorComponent.jsx'
import HeaderComponent from './HeaderComponent.jsx'
import FooterComponent from './FooterComponent.jsx'
import SignoutComponent from './SignoutComponent.jsx'
import AssignmentComponent from './AssignmentComponent.jsx'
import UserComponent from './UserComponent.jsx'
import SessionsComponent from './SessionsComponent.jsx'
import SessionComponent from './SessionComponent.jsx'
import GalleryViewComponent from './GalleryViewComponent.jsx'
import GalleryEditComponent from './GalleryEditComponent.jsx'
import GalleryGridComponent from './GalleryGridComponent.jsx'
import WorksheetViewComponent from './WorksheetViewComponent.jsx'
import WorksheetEditComponent from './WorksheetEditComponent.jsx'
import WorksheetGridComponent from './WorksheetGridComponent.jsx'
import HomeComponent from './HomeComponent.jsx'
import ContactusComponent from './ContactusComponent.jsx'

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
                            <Route path="/gallery" component={GalleryViewComponent}/>
                            <Route path="/worksheet" component={WorksheetViewComponent}/>
                            <Route path="/home" component={HomeComponent}/>
                            <Route path="/contactus" component={ContactusComponent}/>
                            <AuthenticatedRoute path="/sessions/:id" component={SessionComponent}/>
                            <AuthenticatedRoute path="/sessions" component={SessionsComponent}/>
                            <AuthenticatedRoute path="/assignment" component={AssignmentComponent}/>
                            <AuthenticatedRoute path="/users/:id" component={UserComponent}/>
                            <AuthenticatedRoute path="/users" component={UsersComponent}/>
                            <AuthenticatedRoute path="/galleries/:id" component={GalleryEditComponent}/>
                            <AuthenticatedRoute path="/galleries" component={GalleryGridComponent}/>
                            <AuthenticatedRoute path="/worksheets/:id" component={WorksheetEditComponent}/>
                            <AuthenticatedRoute path="/worksheets" component={WorksheetGridComponent}/>
                                                       
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