import React, { Component } from 'react'
import AuthenticationService from './AuthenticationService.js'

class SigninComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            hasLoginFailed: false,
            showSuccessMessage: false
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

    loginClicked() {
        AuthenticationService
            .executeJwtAuthenticationService(this.state.username, this.state.password)
            .then((response) => {
                AuthenticationService.registerSuccessfulLoginForJwt(this.state.username, response.data.token)
                this.props.history.push(`/home/${this.state.username}`)
            }).catch(() => {
                this.setState({ showSuccessMessage: false })
                this.setState({ hasLoginFailed: true })
            })

    }

    render() {
        return (
            <div>
                <div className="container" style={{width: '75%'}}>
                <h4 className="card-title mt-3 text-center">Sign In</h4>
                <p className="text-center">Get started with your free account</p>
                </div>
                <div className="container" style={{width: '75%'}}>
                    {this.state.hasLoginFailed && <div className="alert alert-warning">Invalid Credentials</div>}
                    {this.state.showSuccessMessage && <div>Login Sucessful</div>}
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