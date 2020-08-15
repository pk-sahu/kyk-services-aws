import React, { Component } from 'react'
import MaterialTable from 'material-table';
import WorksheetDataService from '../../api/todo/WorksheetDataService';

class WorksheetGridComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            worksheets: [],
            message: null
        }
        this.deleteClicked = this.deleteClicked.bind(this)
        this.updateClicked = this.updateClicked.bind(this)
        this.addClicked = this.addClicked.bind(this)
        this.refreshWorksheets = this.refreshWorksheets.bind(this)
        this.showOnlyFileName = this.showOnlyFileName.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    componentDidMount() {
        this.refreshWorksheets();
    }
    refreshWorksheets() {
        WorksheetDataService.retrieveAllWorksheet()
            .then(
                response => {
                    this.setState({ worksheets: response.data })
                }
            )
    }
    deleteClicked(id) {
        WorksheetDataService.deleteWorksheet(id)
            .then(
                response => {
                    this.setState({ message: `Delete of worksheet ${id} Successful` })
                    this.refreshWorksheets()
                }
            )
    }
    addClicked() {
        this.props.history.push(`/worksheets/-1`)
    }
    updateClicked(id) {
        this.props.history.push(`/worksheets/${id}`)
    }
    showOnlyFileName(fileUrl){
        return fileUrl.substring((fileUrl.lastIndexOf('/')+1))        
    }

    render() {
        return (
            <div >
                <div className="container" style={{width: '75%'}}>
                    <h5 className="card-title mt-3 text-center">List Of Worksheet</h5>
                    {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                    <MaterialTable
                    columns={[
                        { title: 'Worksheet Name', field: 'worksheetname' },
                        { title: 'Class Name', field: 'classname' },
                        { title: 'Date of Worksheet', field: 'worksheetdate' },
                        { title: 'File Name', field: 'fileName', render: rowData => this.showOnlyFileName(rowData.fileName) }
                    ]}
                    data={this.state.worksheets}
                    title="Worksheet's List" 
                    actions={[
                        {
                        icon: 'edit',
                        tooltip: 'Edit Worksheet',
                        onClick: (event, rowData) => this.updateClicked(rowData.id)
                        },
                        {
                        icon: 'delete',
                        tooltip: 'Delete Worksheet',
                        onClick: (event, rowData) => this.deleteClicked(rowData.id)
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    />
                </div>
            </div>
        )
    }
}

export default WorksheetGridComponent