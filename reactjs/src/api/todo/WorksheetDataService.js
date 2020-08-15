import axios from 'axios'
import { API_URL } from '../../Constants'

class WorksheetDataService {

    retrieveAllWorksheet() {
        return axios.get(`${API_URL}/kyk/worksheets`);
    }
    retrieveWorksheet(id) {
        return axios.get(`${API_URL}/kyk/worksheets/${id}`);
    }
    deleteWorksheet(id) {
        return axios.delete(`${API_URL}/kyk/worksheets/${id}`);
    }
    updateWorksheet(id, worksheet) {
        return axios.put(`${API_URL}/kyk/worksheets/${id}`, worksheet);
    }
    createWorksheet(worksheet) {
        return axios.post(`${API_URL}/kyk/worksheets/`, worksheet);
    }
    uploadWorksheet(worksheet) {
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        return axios.post(`${API_URL}/kyk/uploadWorksheet/`, worksheet, {headers: headers});
    }
    getWorksheetForuser(username) {
        return axios.get(`${API_URL}/kyk/worksheets/foruser/${username}`);
    }
}

export default new WorksheetDataService()