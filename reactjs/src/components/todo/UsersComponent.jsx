import React, { Component } from 'react'
import UserDataService from '../../api/todo/UserDataService.js'
import MaterialTable from 'material-table';

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

    deleteUserClicked(id) {
        UserDataService.deleteUser(id)
            .then(
                response => {
                    this.setState({ message: `Delete of User ${id} Successful` })
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
                        onClick: (event, rowData) => this.deleteUserClicked(rowData.id)
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