import React, { Component } from 'react'
import moment from 'moment'
import WorksheetDataService from '../../api/todo/WorksheetDataService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class WorksheetEditComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            worksheetname: '',
            worksheetdate: moment(new Date()).format('YYYY-MM-DD'),
            classname: 'Nursery',
            fileName: '',
            selectedFile: '',
            isUpload: false,
            loading: false,
            errors:{
                worksheetname: '',
                classname: "",
                fileName: ''
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.onFileUpload = this.onFileUpload.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleChange(event) {
        let name = event.target.name;
        let value = event.target.value;
        let errors = this.state.errors;

        switch (name){
            case "worksheetname":
                errors.worksheetname = !value ? "Please enter worksheet name." : "";
                break;
            case "fileName":
                errors.fileName = !value ? "Please upload Worksheet." : "";
                break;
            default:
                break;
        }
        
        this.setState({
            [event.target.name] : event.target.value
        })                
    }

    componentDidMount = async (data) => {

        if (this.state.id === "-1") {
            return
        }
        await WorksheetDataService.retrieveWorksheet(this.state.id)
        .then(response => {
            this.setState({
                worksheetname: response.data.worksheetname,
                worksheetdate: moment(response.data.worksheetdate).format('YYYY-MM-DD'),
                classname: response.data.classname,
                fileName: response.data.fileName
            }, () => {data = response.data;})                    
        }).catch(error => {
            
        });

        this.setState({
            worksheetname: data.worksheetname,
            worksheetdate: moment(data.worksheetdate).format('YYYY-MM-DD'),
            classname: data.classname,
            fileName: data.fileName
        });
    }

    onSubmit() {        
        let worksheet = {
            id: this.state.id,
            worksheetname : this.state.worksheetname,
            worksheetdate: this.state.worksheetdate,
            classname : this.state.classname,
            fileName: this.state.fileName          
        }
        
        if (!this.state.worksheetname){
            toast.error('Please enter worksheet name.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
        
        if (!this.state.fileName && this.state.id === '-1'){
            toast.error('Please upload Worksheet and click on upload button.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
           
        if (this.state.id === "-1") {
            WorksheetDataService.createWorksheet(worksheet)
                .then(() => this.props.history.push('/worksheets'))
        } else {
            WorksheetDataService.updateWorksheet(this.state.id, worksheet)
                .then(() => this.props.history.push('/worksheets'))
        }
    }

    onFileChange = event => { 
        this.setState({selectedFile:event.target.files[0], isUpload: true });
    }; 

    onFileUpload(){ 
        this.setState({ loading: true });
        var formData = new FormData();
        formData.append("file", this.state.selectedFile);
        WorksheetDataService.uploadWorksheet(formData)
            .then(response => this.setState({
                fileName: response.data   
            }));
        setTimeout(() => {
            this.setState({ loading: false });
            toast.info('Worksheet is uploaded. Please click on save.', { position: toast.POSITION.TOP_RIGHT })
        }, 500);
        this.setState({ isUpload: false });
    }; 

    render() {

        return (
            <div className="container" style={{width: '75%'}}>
                <h5 className="card-title mt-3 text-center">Add/Edit Worksheet</h5>
                Worksheet Name:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-book"></i> </span>
                        <input className="form-control" type="text" name="worksheetname" 
                        value={this.state.worksheetname} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.worksheetname && <div className="alert alert-warning">{this.state.errors.worksheetname}</div>}
                Class:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-address-book"></i> </span>
                        <select className="browser-default custom-select"
                                value={this.state.classname} 
                                name="classname" onChange={this.handleChange} >
                            <option value="Nursery">Nursery</option>
                            <option value="Junior KG">Junior KG</option>
                            <option value="Senior KG">Senior KG</option>
                        </select>
                    </div>
                </div>
                Album Date:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> 
                            <i className="fa fa-calendar"></i> 
                        </span>
                        <input className="form-control" type="date" name="worksheetdate" 
                        value={this.state.worksheetdate} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <strong>FileName: </strong>&nbsp;&nbsp; 
                            {this.state.fileName === '' ? 'N.A.' : this.state.fileName} 
                    </div>
                </div>
                {this.state.errors.fileName && <div className="alert alert-warning">{this.state.errors.fileName}</div>}
                Upload Worksheet:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> 
                            <i className="fa fa-calendar"></i> 
                        </span>
                        <input className="form-control" type="file" 
                                name="fileName" onChange={this.onFileChange}  />
                        <button className="btn btn-primary" onClick={this.onFileUpload}
                            disabled={!this.state.isUpload}>Upload</button>
                        &nbsp;&nbsp;&nbsp;<br/>
                        {this.state.loading && <i className="fa fa-spinner fa-pulse fa-4x"></i>} 
                    </div>
                </div>
                <button className="btn btn-success" type="button"
                    onClick={this.onSubmit}>Save</button>
            </div>
        )
    }
}

export default WorksheetEditComponent