import React, { Component } from 'react'
import SessionDataService from '../../api/todo/SessionDataService.js'
import { USER_NAME_SESSION_ATTRIBUTE_NAME } from '../../Constants.js'

class HomeComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            filterSessions: []
        }
        this.refreshSessions = this.refreshSessions.bind(this)
        this.hello = this.hello.bind(this)
    }

    componentDidMount() {
        this.refreshSessions();
    }
    refreshSessions() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        SessionDataService.getSessionForUser(user)
        .then(response => {
            this.setState({sessions: response.data})                    
        })
    }
    hello(filteredDate){
        this.setState({ filterSessions: this.state.sessions.filter(session => session.visibleDate === filteredDate) })
        this.props.history.push(`/home`)
    }
    
    render() {
        
        return (
            <div className="container" style={{width: '85%'}}>
                <h5 className="card-title mt-3 text-center">Watch Home Assignment</h5>
                <div className="row">
                <div className="col-sm-2">
                    Home Assignment Dates:<br />
                    {   
                        [...new Set(this.state.sessions.map(x => x.visibleDate ))]
                            .map(filteredDate => (
                            <a key={filteredDate} href="#" onClick={()=>this.hello(filteredDate)}>
                                <i className="fas fa-calendar" style={{ color: 'blue' }}></i>
                                &nbsp;&nbsp;{filteredDate}<br />
                            </a>
                        ))
                    }
                </div>
                <div className="col-sm-5">
                {
                    this.state.filterSessions.map((session, index) => {
                        if(index % 2 == 0)                        
                        return <div key={session.id} className="card mt-4" style={{width: '20rem'}}>
                            <div className="card-body">
                                <h6 className="card-title">
                                    <strong>{session.subject}</strong>: {session.description}<br/>
                                    <strong>Class</strong>: {session.classname}
                                </h6>
                                <video width='300px' height='120px' controls>
                                    <source src={session.fileName} />    
                                </video> 
                            </div><br />
                        </div>
                    }
                    )
                }
                </div>
                <div className="col-sm-5">
                {
                    this.state.filterSessions.map((session, index) => {
                        if(index % 2 != 0)                        
                        return <div key={session.id} className="card mt-4" style={{width: '20rem'}}>
                            <div className="card-body">
                                <h6 className="card-title">
                                    <strong>{session.subject}</strong>: {session.description}<br />
                                    <strong>Class</strong>: {session.classname}
                                </h6>
                                <video width='300px' height='120px' controls>
                                    <source src={session.fileName} />    
                                </video> 
                            </div><br />
                        </div>
                    }
                    )
                }
                </div>
                </div>
            </div>
        )
    }
}

export default HomeComponent