import React, { Component } from 'react'
import SessionDataService from '../../api/todo/SessionDataService.js'
import MaterialTable from 'material-table';

class SessionsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sessions: [],
            message: null
        }
        this.deleteSessionClicked = this.deleteSessionClicked.bind(this)
        this.updateSessionClicked = this.updateSessionClicked.bind(this)
        this.addSessionClicked = this.addSessionClicked.bind(this)
        this.refreshSessions = this.refreshSessions.bind(this)
        this.showOnlyFileName = this.showOnlyFileName.bind(this)
    }

    componentWillUnmount() {
        
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    componentDidMount() {
        this.refreshSessions();
    }
    refreshSessions() {
        SessionDataService.retrieveAllSessions()
            .then(
                response => {
                    this.setState({ sessions: response.data })
                }
            )
    }
    
    deleteSessionClicked(id) {
        SessionDataService.deleteSession(id)
            .then(
                response => {
                    this.setState({ message: `Delete of session ${id} Successful` })
                    this.refreshSessions()
                }
            )

    }

    addSessionClicked() {
        this.props.history.push(`/sessions/-1`)
    }

    updateSessionClicked(id) {
        this.props.history.push(`/sessions/${id}`)
    }

    showOnlyFileName(fileUrl){
        return fileUrl.substring((fileUrl.lastIndexOf('/')+1))        
    }
    render() {
        return (
            <div >
                <div className="container" style={{width: '75%'}}>
                    <h5 className="card-title mt-3 text-center">List Of Session</h5>
                    {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                    <MaterialTable
                    columns={[
                        { title: 'Subject', field: 'subject' },
                        { title: 'Class', field: 'classname' },
                        { title: 'Date of Lession', field: 'visibleDate' },
                        { title: 'Description', field: 'description' },
                        { title: 'File Name', field: 'fileName', render: rowData => this.showOnlyFileName(rowData.fileName) }
                    ]}
                    data={this.state.sessions}
                    title="Lession's List" 
                    actions={[
                        {
                        icon: 'edit',
                        tooltip: 'Edit Lession',
                        onClick: (event, rowData) => this.updateSessionClicked(rowData.id)
                        },
                        {
                        icon: 'delete',
                        tooltip: 'Delete Lession',
                        onClick: (event, rowData) => this.deleteSessionClicked(rowData.id)
                        }
                    ]}
                    options={{
                        actionsColumnIndex: -1
                    }}
                    detailPanel={rowData => {
                        return (
                        <div style={{ padding: '10px 50px 10px 50px' }}>
                            <video width='800px' height='200px' controls>
                                <source src={rowData.fileName} />    
                            </video> 
                        </div>
                        );
                    }}
                    onRowClick={(event, rowData, togglePanel) => togglePanel()}
                    />
                    <div className="row" >
                        <button className="btn" style={{ backgroundColor: 'darkred', color: 'white' }}onClick={this.addSessionClicked}>
                            <i className="fa fa-plus" ></i>
                            &nbsp; Add
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SessionsComponent