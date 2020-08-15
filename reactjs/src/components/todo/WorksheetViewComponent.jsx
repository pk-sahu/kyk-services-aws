import React, { Component } from 'react'
import WorksheetDataService from '../../api/todo/WorksheetDataService';
import { USER_NAME_SESSION_ATTRIBUTE_NAME } from '../../Constants';

class WorksheetViewComponent extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            worksheets: [],
            filterWorksheets: []
        }
        this.refreshWorksheets = this.refreshWorksheets.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        this.refreshWorksheets();
    }
    refreshWorksheets() {
        let user = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME)
        WorksheetDataService.getWorksheetForuser(user)
        .then(response => {
            this.setState({worksheets: response.data})                    
        })
    }
    handleChange(event) {
        let filename = event.target.selectedOptions[0].className;
        window.open (filename, "", 'target=_blank');
    }
    render() {
        return (
            <div className="container" style={{width: '95%'}}>
                <h5 className="card-title mt-3 text-center">Worksheet View</h5>
                <div className="row">
                    <div className="col-sm-3">
                    <div className="text-center bg-info text-white" >Please select below worksheet to open.</div>
                    <select className="browser-default custom-select"
                            onChange={this.handleChange}>
                        <option disabled selected hidden>Please select !</option>
                    {   
                        this.state.worksheets.map((worksheet, index) => (                            
                            <option key={index} className={worksheet.fileName}>
                                {worksheet.worksheetname}
                            </option>                                    
                        ))
                    }
                    </select>
                    </div>
                </div>
            </div>
        )
    }
}

export default WorksheetViewComponent