import React, { Component } from 'react'
import GalleryDataService from '../../api/todo/GalleryDataService'
import MaterialTable from 'material-table';

class GalleryGridComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            galleries: [],
            message: null
        }
        this.deleteClicked = this.deleteClicked.bind(this)
        this.updateClicked = this.updateClicked.bind(this)
        this.addClicked = this.addClicked.bind(this)
        this.refreshGalleries = this.refreshGalleries.bind(this)
        this.showOnlyFileName = this.showOnlyFileName.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    componentDidMount() {
        this.refreshGalleries();
    }
    refreshGalleries() {
        GalleryDataService.retrieveAllGallery()
            .then(
                response => {
                    this.setState({ galleries: response.data })
                }
            )
    }
    deleteClicked(id) {
        GalleryDataService.deleteGallery(id)
            .then(
                response => {
                    this.setState({ message: `Delete of photo ${id} Successful` })
                    this.refreshGalleries()
                }
            )
    }
    addClicked() {
        this.props.history.push(`/galleries/-1`)
    }
    updateClicked(id) {
        this.props.history.push(`/galleries/${id}`)
    }
    showOnlyFileName(fileUrl){
        return fileUrl.substring((fileUrl.lastIndexOf('/')+1))        
    }

    render() {
        return (
            <div >
                <div className="container" style={{width: '75%'}}>
                    <h5 className="card-title mt-3 text-center">List Of Photo</h5>
                    {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                    <MaterialTable
                    columns={[
                        { title: 'Activity', field: 'activity' },
                        { title: 'Date of Album', field: 'albumdate' },
                        { title: 'File Name', field: 'fileName', render: rowData => this.showOnlyFileName(rowData.fileName) }
                    ]}
                    data={this.state.galleries}
                    title="Photo's List" 
                    actions={[
                        {
                        icon: 'edit',
                        tooltip: 'Edit Photo',
                        onClick: (event, rowData) => this.updateClicked(rowData.id)
                        },
                        {
                        icon: 'delete',
                        tooltip: 'Delete Photo',
                        onClick: (event, rowData) => this.deleteClicked(rowData.id)
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    />
                    {/* <div className="row" >
                        <button className="btn" style={{ backgroundColor: 'darkred', color: 'white' }}onClick={this.addClicked}>
                            <i className="fa fa-plus" ></i>
                            &nbsp; Add
                        </button>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default GalleryGridComponent