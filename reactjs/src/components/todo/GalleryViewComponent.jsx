import React, { Component } from 'react'
import GalleryDataService from '../../api/todo/GalleryDataService';

class GalleryViewComponent extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            filterSessions: []
        }
        this.refreshSessions = this.refreshSessions.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.refreshSessions();
    }
    refreshSessions() {
        GalleryDataService.retrieveAllGallery()
        .then(response => {
            this.setState({sessions: response.data})                    
        })
    }
    
    handleChange(event) {
        let filteredDate = event.target.value;
        this.setState({ filterSessions: this.state.sessions.filter(session => session.albumdate === filteredDate) })
        this.props.history.push(`/gallery`)
    }
    
    render() {
        return (
            <div className="container" style={{width: '95%'}}>
                <h5 className="card-title mt-3 text-center">Gallery View</h5>
                <div className="row">
                <div className="col-sm-2">
                    Album's Date:<br />
                    <select className="browser-default custom-select"
                            onChange={this.handleChange}>
                        <option disabled selected hidden>Please select !</option>
                    {   
                        [...new Set(this.state.sessions.map(x => x.albumdate ))]
                            .map((filteredDate,index) => (
                            <option key={index}>{filteredDate}</option>
                        ))
                    }
                    </select>
                </div>
                <div className="col-sm-5">
                {   
                    this.state.filterSessions.map((session, index) => {
                        if(index % 2 === 0){ 
                            if(session.filetype === 'mp4')
                            return <div key={session.id} className="card mt-4 containerSlide">
                                <div className="card-body">
                                    <h6 className="card-title">
                                        <strong>Activity</strong>: {session.activity}
                                    </h6>
                                    <video width='400px' height='400px' controls>
                                        <source src={session.fileName} />    
                                    </video> 
                                </div>
                            </div>
                            else
                            return <div key={session.id} className="card mt-4 containerSlide">
                                <div className="card-body">
                                    <h6 className="card-title">
                                        <strong>Activity</strong>: {session.activity}
                                    </h6>
                                    <img src={session.fileName} 
                                        width="400" height="160"></img>
                                </div>
                            </div>
                        }
                    })
                }
                </div>
                <div className="col-sm-5">
                {   
                    this.state.filterSessions.map((session, index) => {
                        if(index % 2 !== 0) 
                            if(session.filetype === 'mp4')
                            return <div key={session.id} className="card mt-4 containerSlide">
                                <div className="card-body">
                                    <h6 className="card-title">
                                        <strong>Activity</strong>: {session.activity}
                                    </h6>
                                    <video width='400px' height='400px' controls>
                                        <source src={session.fileName} />    
                                    </video> 
                                </div>
                            </div>
                            else
                            return <div key={session.id} className="card mt-4 containerSlide">
                                <div className="card-body">
                                    <h6 className="card-title">
                                        <strong>Activity</strong>: {session.activity}
                                    </h6>
                                    <img src={session.fileName} 
                                        width="400" height="160"></img>
                                </div>
                            </div>
                    })
                }
                </div>
                </div>
            </div>
        )
    }
}

  export default GalleryViewComponent