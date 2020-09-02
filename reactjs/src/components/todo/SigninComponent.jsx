import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService.js'
import { USER_NAME_SESSION_ATTRIBUTE_NAME } from '../../Constants.js'

class SigninComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            hasLoginFailed: false,
            inactiveUser: false,
            errorMessage: '',
            rememberme: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.loginClicked = this.loginClicked.bind(this)
    }

    handleChange(event) {
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )
    }
    handleRememberme = (event) => {
        const input = event.target;
        const value = input.type === 'checkbox' ? input.checked : input.value;     
        this.setState({ [input.name]: value });
    }
    componentDidMount() {
        const rememberme = localStorage.getItem('rememberme') === 'true';
        const username = rememberme ? localStorage.getItem('username') : '';
        const password = rememberme ? localStorage.getItem('password') : '';
        this.setState({ username: username, password: password, rememberme: rememberme});
    }
    loginClicked() {
        AuthenticationService
            .executeJwtAuthenticationService(this.state.username, this.state.password)
            .then((response) => {
                AuthenticationService.registerSuccessfulLoginForJwt(this.state.username, response.data.token)
                if('false' === response.data.token){
                    sessionStorage.removeItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
                    this.setState({ inactiveUser: true});
                    this.setState({ hasLoginFailed: false });
                    this.setState({ errorMessage: 'Your access has been revoked, please contact to adminitrator.' })
                    this.props.history.push(`/signin`);
                }else{
                    this.props.history.push(`/home/${this.state.username}`)
                }
            }).catch(() => {
                this.setState({ inactiveUser: false })
                this.setState({ hasLoginFailed: true })
                this.setState({ errorMessage: 'Invalid Credentials' })
            })
        localStorage.setItem('rememberme', this.state.rememberme);
        localStorage.setItem('username', this.state.rememberme ? this.state.username : '');
        localStorage.setItem('password', this.state.rememberme ? this.state.password : '');
    }

    render() {
        return (
            <div>
                <div className="container" style={{width: '75%'}}>
                <h4 className="card-title mt-3 text-center">Sign In</h4>
                <p className="text-center">Get started with your free account</p>
                </div>
                <div className="container" style={{width: '75%'}}>
                    {this.state.hasLoginFailed && <div className="alert alert-warning">{this.state.errorMessage}</div>}
                    {this.state.inactiveUser && <div className="alert alert-warning">{this.state.errorMessage}</div>}
                    User Name: 
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-user"></i> </span>
                        </div>
                        <input type="text" 
                               name="username" 
                               className="form-control"
                               value={this.state.username} 
                               onChange={this.handleChange} />
                    </div>
                    Password: 
                    <div className="form-group input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text"> <i className="fa fa-lock"></i> </span>
                        </div>
                        <input type="password" 
                               name="password" 
                               className="form-control"
                               value={this.state.password} 
                               onChange={this.handleChange} />
                    </div>
                    <div className="form-group input-group">
                        <input name="rememberme" 
                               value="Remember me"
                               checked={this.state.rememberme} 
                               onChange={this.handleRememberme} 
                               type="checkbox"/>&nbsp;&nbsp;<label>Remember me</label>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary btn-block" 
                            onClick={this.loginClicked}>Sign In</button>
                    </div>        
                </div>
            </div>
        )
    }
}

export default SigninComponent