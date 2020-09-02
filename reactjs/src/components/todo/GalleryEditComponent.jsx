import React, { Component } from 'react'
import moment from 'moment'
import GalleryDataService from '../../api/todo/GalleryDataService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class GalleryEditComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            activity: '',
            albumdate: moment(new Date()).format('YYYY-MM-DD'),
            fileName: '',
            selectedFile: '',
            isUpload: false,
            loading: false,
            errors:{
                activity: '',
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
            case "activity":
                errors.activity = !value ? "Please enter activity." : "";
                break;
            case "fileName":
                errors.fileName = !value ? "Please upload photo." : "";
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
        await GalleryDataService.retrieveGallery(this.state.id)
        .then(response => {
            this.setState({
                activity: response.data.activity,
                albumdate: moment(response.data.albumdate).format('YYYY-MM-DD'),
                fileName: response.data.fileName
            }, () => {data = response.data;})                    
        }).catch(error => {
            
        });

        this.setState({
            activity: data.activity,
            albumdate: moment(data.albumdate).format('YYYY-MM-DD'),
            fileName: data.fileName
        });
    }

    onSubmit() {        
        let gallery = {
            id: this.state.id,
            activity : this.state.activity,
            albumdate: this.state.albumdate,
            fileName: this.state.fileName          
        }
        
        if (!this.state.activity){
            toast.error('Please enter activity.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
        
        if (!this.state.fileName && this.state.id === '-1'){
            toast.error('Please upload photo and click on upload button.', { position: toast.POSITION.TOP_RIGHT })
            return
        }
           
        if (this.state.id === "-1") {
            GalleryDataService.createGallery(gallery)
                .then(() => this.props.history.push('/galleries'))
        } else {
            GalleryDataService.updateGallery(this.state.id, gallery)
                .then(() => this.props.history.push('/galleries'))
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
        GalleryDataService.uploadGallery(formData)
            .then(response => this.setState({
                fileName: response.data   
            }));
        setTimeout(() => {
            this.setState({ loading: false });
            toast.info('Photo is uploaded. Please click on save.', { position: toast.POSITION.TOP_RIGHT })
        }, 500);
        this.setState({ isUpload: false });
    }; 

    render() {

        return (
            <div className="container" style={{width: '75%'}}>
                <h5 className="card-title mt-3 text-center">Add/Edit Photo</h5>
                activity:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> <i className="fa fa-book"></i> </span>
                        <input className="form-control" type="text" name="activity" 
                        value={this.state.activity} onChange={this.handleChange}/>
                    </div>
                </div>
                {this.state.errors.activity && <div className="alert alert-warning">{this.state.errors.activity}</div>}
                Album Date:
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text"> 
                            <i className="fa fa-calendar"></i> 
                        </span>
                        <input className="form-control" type="date" name="albumdate" 
                        value={this.state.albumdate} onChange={this.handleChange}/>
                    </div>
                </div>
                <div className="form-group input-group">
                    <div className="input-group-prepend">
                        <strong>FileName: </strong>&nbsp;&nbsp; 
                            {this.state.fileName === '' ? 'N.A.' : this.state.fileName} 
                    </div>
                </div>
                {this.state.errors.fileName && <div className="alert alert-warning">{this.state.errors.fileName}</div>}
                Upload Photo:
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

export default GalleryEditComponent