import axios from 'axios'
import { API_URL } from '../../Constants'

class SessionDataService {

    retrieveAllSessions() {
        return axios.get(`${API_URL}/kyk/sessions`);
    }
    retrieveSession(id) {
        return axios.get(`${API_URL}/kyk/sessions/${id}`);
    }
    deleteSession(id) {
        return axios.delete(`${API_URL}/kyk/sessions/${id}`);
    }
    updateSession(id, session) {
        return axios.put(`${API_URL}/kyk/sessions/${id}`, session);
    }
    createSession(session) {
        return axios.post(`${API_URL}/kyk/sessions/`, session);
    }
    uploadSession(session) {
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        return axios.post(`${API_URL}/kyk/uploadSession/`, session, {headers: headers});
    }
    getSessionForUser(username) {
        return axios.get(`${API_URL}/kyk/sessions/foruser/${username}`);
    }
}

export default new SessionDataService()