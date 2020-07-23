import React, { Component } from 'react'
import { USER_ROLE } from '../../Constants';

class SignoutComponent extends Component {

    render() {
        sessionStorage.removeItem(USER_ROLE);
        return (
            <div className="card-body text-center">
                <div className="card-body text-center">
                    <div className="card text-white bg-success mb-4">
                        <div className="card-body">
                            <h5 className="card-title">You are logged out</h5>
                            <p className="card-text">Thank You for Using Offline Learning Application.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignoutComponent