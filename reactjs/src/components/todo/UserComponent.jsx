import React, { Component } from 'react'
import moment from 'moment'
import UserDataService from '../../api/todo/UserDataService.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { USER_NAME_SESSION_ATTRIBUTE_NAME, SCHOOL_ADMIN } from '../../Constants.js'

class UserComponent extends Component {
    constructor(props) {
        super(props)
        toast.configure()
        this.state = {
            id: this.props.match.params.id,
            username: '',
            plainpassword: '',
            phone: '',
            studentname: '',
            classname: '',
            email: '',
            userstatus: 'true',
            dateofbirth: moment(new Date()).format('YYYY-MM-DD'),
            errors:{
                username: "",
                plainpassword: "",
                phone: "",
                studentname: "",
                email: ""
            }
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.setUserStatus = this.setUserStatus.bind(this)
    }

    componentDidMount() {

        if (this.state.id === '-1') {
            return
        }

        UserDataService.getUserById(this.state.id)
            .then(response => this.setState({
                username: response.data.username,
                plainpassword: response.data.plainpassword,
                studentname: response.data.studentname,
                classname: response.data.classname,
                phone: response.data.phone,
                email: response.data.email,
                userstatus: response.data.userstatus,
                dateofbirth: moment(response.data.dateofbirth).format('YYYY-MM-DD')
            }))
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        let errors = this.state.errors;

        switch (name){
            case "username":
                errors.username = !value ? "Please enter user name." : "";
                break;
            case "plainpassword":
                errors.plainpassword = !value ? "Please enter password." : "";
                break;
            case "phone":
                errors.phone = !value ? "Please enter phone number." : "";
                break;
            case "studentname":
                errors.studentname = !value ? "Please enter student name." : "";
                break;
            case "email":
                errors.email = !value ? "Please enter email." : "";
                break;
            case "classname":
                errors.classname = !value ? "Please select class..." : "";
                break;
            default:
                break;
        }
        
        this.setState({
            [event.target.name]: event.target.value
        })                
    }
    setUserStatus(event) {
        this.setState({ userstatus: event.target.value })
    }
    onSubmit() {
        
        let user = {
            id: this.state.id,
            username : this.state.username,
            plainpassword : this.state.plainpassword,
            phone: this.state.phone,
            studentname: this.state.studentname,
            email: this.state.email,
            classname: this.state.classname,
            dateofbirth: this.state.dateofbirth,
            userstatus: this.state.userstatus,
        }
        
        if (!this.state.username){
            toast.error('Please enter user name.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }else if (!this.state.plainpassword){
            toast.error('Please enter password.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }else if (!this.state.phone){
            toast.error('Please enter phone number.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }else if (!this.state.studentname){
            toast.error('Please enter student name.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }else if (!this.state.email){
            toast.error('Please enter email.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }else if (!this.state.classname){
            toast.error('Please select class.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }

        if (this.state.id === "-1") {
            UserDataService.createUser(user)
                .then(() => this.props.history.push('/users'))
        } else {
            UserDataService.updateUser(user)
                .then(() => this.props.history.push('/users'))
        }
    }

    render() {
        const Statuscomponent = () => ( 
            <div className="form-group input-group" onChange={this.setUserStatus}>
              <div className="input-group-prepend"> 
                <input type="radio" value='true' name="userstatus" 
                        defaultChecked={'true' === this.state.userstatus} /> Active&nbsp;&nbsp;
                <input type="radio" value='false' name="userstatus" 
                        defaultChecked={'true' !== this.state.userstatus} /> Inactive
              </div>
            </div>
        );
        const currentUser = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        
        return (
            <div className="container" style={{width: '75%'}}>
                <h5 className="card-title mt-3 text-center">Create User's Account</h5>
                User Name:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                        <input className="form-control" type="text" name="username" 
                        placeholder="Enter username!"
                        value={this.state.username} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.username && <div className="alert-warning">{this.state.errors.username}</div>}
                Password:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                        <input className="form-control" type="text" name="plainpassword" 
                        value={this.state.plainpassword} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.plainpassword && <div className="alert alert-warning">{this.state.errors.plainpassword}</div>}
                Student Name:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-child"></i> </span>
                        <input className="form-control" type="text" name="studentname" 
                        value={this.state.studentname} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.studentname && <div className="alert alert-warning">{this.state.errors.studentname}</div>}
                Class:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-address-book"></i> </span>
                        <select className="browser-default custom-select"
                                value={this.state.classname} 
                                name="classname" onChange={this.handleChange} >
                                <option value="" selected="selected">Please select class...</option>
{currentUser === 'cpsclass1' && <option value="Class 1">Class 1</option>}
{currentUser === 'cpsclass2' && <option value="Class 2">Class 2</option>}
{currentUser === 'cpsclass3' && <option value="Class 3">Class 3</option>}
{currentUser === 'cpsclass4' && <option value="Class 4">Class 4</option>}
{currentUser === 'cpsclass5' && <option value="Class 5">Class 5</option>}
{currentUser === 'cpsclass6' && <option value="Class 6">Class 6</option>}
{currentUser === 'cpsclass7' && <option value="Class 7">Class 7</option>}
{currentUser === 'cpsclass8' && <option value="Class 8">Class 8</option>}    
{currentUser === SCHOOL_ADMIN && <option value="Nursery">Nursery</option>}
{currentUser === SCHOOL_ADMIN && <option value="Junior KG">Junior KG</option>}
{currentUser === SCHOOL_ADMIN && <option value="Senior KG">Senior KG</option>}            
{currentUser === SCHOOL_ADMIN && <option value="Class 1">Class 1</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 2">Class 2</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 3">Class 3</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 4">Class 4</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 5">Class 5</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 6">Class 6</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 7">Class 7</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 8">Class 8</option>}

                        </select>
                    </div>
                </div>
                {this.state.errors.classname && <div className="alert alert-warning">{this.state.errors.classname}</div>}
                Phone:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-phone"></i> </span>
                        <input className="form-control" type="text" name="phone" 
                        value={this.state.phone} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.phone && <div className="alert alert-warning">{this.state.errors.phone}</div>}
                Email:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-envelope"></i> </span>
                        <input className="form-control" type="text" name="email" 
                        value={this.state.email} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.email && <div className="alert alert-warning">{this.state.errors.email}</div>}
                Date Of Birth:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> 
                            <i className="fa fa-calendar"></i> 
                        </span>
                        <input className="form-control" type="date" name="dateofbirth" 
                        value={this.state.dateofbirth} onChange={this.handleChange}/>
                    </div>
                </div>
                User Status:
                <Statuscomponent />
                <button className="btn btn-success" 
                        type="button" 
                        onClick={this.onSubmit}>Save</button>
            </div>
        )
    }
}

export default UserComponent