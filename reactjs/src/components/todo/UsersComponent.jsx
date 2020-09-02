import React, { Component } from 'react'
import UserDataService from '../../api/todo/UserDataService.js'
import MaterialTable from 'material-table';
import { USER_NAME_SESSION_ATTRIBUTE_NAME } from '../../Constants.js';

class UsersComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            message: null
        }
        this.deleteUserClicked = this.deleteUserClicked.bind(this)
        this.updateUserClicked = this.updateUserClicked.bind(this)
        this.addUserClicked = this.addUserClicked.bind(this)
        this.refreshUsers = this.refreshUsers.bind(this)
    }

    componentWillUnmount() {   }

    shouldComponentUpdate(nextProps, nextState) {return true}

    componentDidMount() {
        this.refreshUsers();
    }

    refreshUsers() {
        UserDataService.getAllUsers()
            .then(
                response => {
                    this.setState({ users: response.data })
                }
            )
    }

    deleteUserClicked(id, username) {
        UserDataService.deleteUser(id)
            .then(
                response => {
                    this.setState({ message: `User ${username} has been deleted Successfully.` })
                    this.refreshUsers()
                }
            )

    }

    addUserClicked() {
        this.props.history.push(`/users/-1`)
    }

    updateUserClicked(id) {
        this.props.history.push(`/users/${id}`)
    }

    render() {
        let currentUser = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        if(currentUser === 'cpsclass1')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 1')
        if(currentUser === 'cpsclass2')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 2')
        if(currentUser === 'cpsclass3')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 3')
        if(currentUser === 'cpsclass4')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 4')
        if(currentUser === 'cpsclass5')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 5')
        if(currentUser === 'cpsclass6')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 6')
        if(currentUser === 'cpsclass7')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 7')
        if(currentUser === 'cpsclass8')
            this.state.users =  this.state.users.filter(user => user.classname === 'Class 8')
        
        return (
            <div >
                <div className="container" style={{width: '75%'}}>
                    <h5 className="card-title mt-3 text-center">List Of Users</h5>
                    {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                    <MaterialTable
                    columns={[
                        { title: 'Username', field: 'username' },
                        { title: 'Student Name', field: 'studentname' },
                        { title: 'Class Name', field: 'classname' },
                        { title: 'Phone', field: 'phone' },
                        { title: 'Date Of Birth', field: 'dateofbirth' },
                        { title: 'Email', field: 'email' },
                        { title: 'User Active', field: 'userstatus' },
                    ]}
                    data={this.state.users}
                    title="User's List" 
                    actions={[
                        {
                        icon: 'edit',
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => this.updateUserClicked(rowData.id)
                        },
                        {
                        icon: 'delete',
                        tooltip: 'Delete User',
                        onClick: (event, rowData) => this.deleteUserClicked(rowData.id, rowData.username)
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    />
                    {/* <div className="row" >
                        <button className="btn btn-success" onClick={this.addUserClicked}>Add</button>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default UsersComponent