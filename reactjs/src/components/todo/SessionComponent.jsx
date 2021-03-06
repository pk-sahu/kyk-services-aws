import React, { Component } from 'react'
import moment from 'moment'
import SessionDataService from '../../api/todo/SessionDataService.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { USER_NAME_SESSION_ATTRIBUTE_NAME, SCHOOL_ADMIN } from '../../Constants.js'

class SessionComponent extends Component {
    constructor(props) {
        super(props)
        toast.configure()
        this.state = {
            id: this.props.match.params.id,
            subject: '',
            classname: '',
            description: '',
            visibleDate: moment(new Date()).format('YYYY-MM-DD'),
            fileName: '',
            selectedFile: '',
            isUpload: false,
            loading: false,
            errors:{
                subject: "",
                classname: "",
                description: "",
                fileName: ""
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
            case "subject":
                errors.subject = !value ? "Please enter subject." : "";
                break;
            case "description":
                errors.description = !value ? "Please enter description." : "";
                break;
            case "fileName":
                errors.fileName = !value ? "Please upload session." : "";
                break;
            case "classname":
                errors.classname = !value ? "Please select class..." : "";
                break;
            default:
                break;
        }
        
        this.setState(
            {
                [event.target.name]
                    : event.target.value
            }
        )                
    }
    componentDidMount = async (data) => {

        if (this.state.id === "-1") {
            return
        }
        await SessionDataService.retrieveSession(this.state.id)
        .then(response => {
            this.setState({
                subject: response.data.subject,
                classname: response.data.classname,
                description: response.data.description,
                visibleDate: moment(response.data.visibleDate).format('YYYY-MM-DD'),
                fileName: response.data.fileName
            }, () => {data = response.data;})                    
        }).catch(error => {
            
        });
        this.setState({
            subject: data.subject,
            classname: data.classname,
            description: data.description,
            visibleDate: moment(data.visibleDate).format('YYYY-MM-DD'),
            fileName: data.fileName
        });
    }

    onSubmit() {
        
        let session = {
            id: this.state.id,
            subject : this.state.subject,
            classname : this.state.classname,
            description: this.state.description,
            visibleDate: this.state.visibleDate,
            fileName: this.state.fileName          
        }
        
        if (!this.state.subject){
            toast.error('Please enter subject.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
        if (!this.state.classname){
            toast.error('Please select class.', { position: toast.POSITION.TOP_RIGHT })
            return;
        }        
        if (!this.state.description){
            toast.error('Please enter description.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
        if (!this.state.fileName && this.state.id === '-1'){
            toast.error('Please upload session and click on upload button.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
           
        if (this.state.id === "-1") {
            SessionDataService.createSession(session)
                .then(() => this.props.history.push('/sessions'))
        } else {
            SessionDataService.updateSession(this.state.id, session)
                .then(() => this.props.history.push('/sessions'))
        }
    }

    onFileChange = event => { 
        let errors = this.state.errors;
        let fileSize = event.target.files[0].size / 1000 / 1000; 
        if (fileSize > 50){
            this.setState({isUpload: false });
            errors.fileName = "Please upload file with maximum size of 50 MB.";
            return;
        }else{
            errors.fileName = "";
        }
        this.setState({selectedFile:event.target.files[0], isUpload: true });
    }; 

    onFileUpload(){ 
        this.setState({ loading: true });
        var formData = new FormData();
        formData.append("file", this.state.selectedFile);
        SessionDataService.uploadSession(formData)
            .then(response => this.setState({
                fileName: response.data   
            }));
        setTimeout(() => {
            this.setState({ loading: false });
            toast.info('Session is uploaded. Please click on save.', { position: toast.POSITION.TOP_RIGHT })
        }, 500);
        this.setState({ isUpload: false });
    }; 

    render() {
        const currentUser = sessionStorage.getItem(USER_NAME_SESSION_ATTRIBUTE_NAME);
        return (
            <div className="container" style={{width: '75%'}}>
                <h5 className="card-title mt-3 text-center">Add Session</h5>
                Subject:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-book"></i> </span>
                        <input className="form-control" type="text" name="subject" 
                        value={this.state.subject} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.subject && <div className="alert alert-warning">{this.state.errors.subject}</div>}
                Class:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-address-book"></i> </span>
                        <select className="browser-default custom-select"
                                value={this.state.classname} 
                                name="classname" onChange={this.handleChange} >
                                <option value="" selected="selected">Please select class...</option>
{currentUser === 'cpsclass1' && <option value="Class 1">Class 1</option>}
{currentUser === 'cpsclass2' && <option value="Class 2">Class 2</option>}
{currentUser === 'cpsclass3' && <option value="Class 3">Class 3</option>}
{currentUser === 'cpsclass4' && <option value="Class 4">Class 4</option>}
{currentUser === 'cpsclass5' && <option value="Class 5">Class 5</option>}
{currentUser === 'cpsclass6' && <option value="Class 6">Class 6</option>}
{currentUser === 'cpsclass7' && <option value="Class 7">Class 7</option>}
{currentUser === 'cpsclass8' && <option value="Class 8">Class 8</option>}    
{currentUser === SCHOOL_ADMIN && <option value="Nursery">Nursery</option>}
{currentUser === SCHOOL_ADMIN && <option value="Junior KG">Junior KG</option>}
{currentUser === SCHOOL_ADMIN && <option value="Senior KG">Senior KG</option>}            
{currentUser === SCHOOL_ADMIN && <option value="Class 1">Class 1</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 2">Class 2</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 3">Class 3</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 4">Class 4</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 5">Class 5</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 6">Class 6</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 7">Class 7</option>}
{currentUser === SCHOOL_ADMIN && <option value="Class 8">Class 8</option>}
                        </select>
                    </div>
                </div>
                {this.state.errors.classname && <div className="alert alert-warning">{this.state.errors.classname}</div>}
                Description:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> 
                            <i className="fa fa-comment"></i> 
                        </span>
                        <input className="form-control" type="text" name="description" 
                        value={this.state.description} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.description && <div className="alert alert-warning">{this.state.errors.description}</div>}
                Visible Date:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> 
                            <i className="fa fa-calendar"></i> 
                        </span>
                        <input className="form-control" type="date" name="visibleDate" 
                        value={this.state.visibleDate} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <strong>FileName: </strong>&nbsp;&nbsp; 
                            {this.state.fileName === '' ? 'N.A.' : this.state.fileName} 
                    </div>
                </div>
                {this.state.errors.fileName && <div className="alert alert-warning">{this.state.errors.fileName}</div>}
                Upload Session:
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

export default SessionComponent