import React, { Component } from 'react'
import { CONTACT_US1, CONTACT_US2, CONTACT_US3, CONTACT_NUM, CONTACT_TIME } from '../../Constants.js';

class ContactusComponent extends Component {

    render() {
        return (
            <div className="card-body text-center">
                <div className="card-body text-center">
                    <div className="card text-white bg-success mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Contact Us</h5>
                            <p className="card-text">{CONTACT_US1}<br/> {CONTACT_US2}<br/> {CONTACT_US3}</p>
                            <p className="card-text">{CONTACT_NUM}</p>
                            <p className="card-text">{CONTACT_TIME}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default ContactusComponent