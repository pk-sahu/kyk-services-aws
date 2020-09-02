import React, { Component } from 'react'
import { USER_NAME_SESSION_ATTRIBUTE_NAME, SCHOOL_NAME } from '../../Constants';
import UserDataService from '../../api/todo/UserDataService';

class HomeComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            fullusername: ''
        }
    }
    
    componentDidMount = async (data) => {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        await UserDataService.getFullUsername(user)
        .then(response => {
            this.setState({
                fullusername: response.data
            }, () => {data = response.data;})                    
        }).catch(error => {            
        });
        this.setState({
            fullusername: data
        });
    }
    render() {
        return (
            <div className="card-body text-center">
                <div className="card-body text-center">
                    <div className="card text-white bg-success mb-4">
                        <div className="card-body">
                            <h5 className="card-title"> Welcome {this.state.fullusername} </h5>
                            <p className="text-left">{SCHOOL_NAME} is a place where children can grow and 
                            develop while reading, writing, listening and playing to achieve the best education 
                            standards, we build a balance plateform between the Eastern culture and western competitive 
                            standards which will prepare a winning generation for the 21st century. Our children will 
                            grow up to be accommodative, caring, sharing and bright individuals. </p>
                            <p className="text-left">We have introduced eLearning for {SCHOOL_NAME} where parents can get their child Engaged, Interact, Learn online/offline all from 
                            the comfort & safety at the home.</p>
                            <p className="text-left">We are providing content based learning, Now parents/kids 
                            can see the recorded content for home assignment.</p>
                            <p className="text-left">We are also providing  Worksheets for kids, Parents can download 
                            and take printouts for kids activities.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default HomeComponent