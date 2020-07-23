import React, { Component } from 'react'
import { SCHOOL_NAME } from '../../Constants'

class FooterComponent extends Component {
    render() {
        return (
            <footer className="footer">
                <div className="text-center">
                    <span >All Rights Reserved 2020 @ Copyright ({SCHOOL_NAME})</span>
                </div>
            </footer>
        )
    }
}

export default FooterComponent