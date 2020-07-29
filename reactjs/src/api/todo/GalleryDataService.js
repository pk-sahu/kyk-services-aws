import axios from 'axios'
import { API_URL } from '../../Constants'

class GalleryDataService {

    retrieveAllGallery() {
        return axios.get(`${API_URL}/kyk/photos`);
    }
    retrieveGallery(id) {
        return axios.get(`${API_URL}/kyk/photos/${id}`);
    }
    deleteGallery(id) {
        return axios.delete(`${API_URL}/kyk/photos/${id}`);
    }
    updateGallery(id, gallery) {
        return axios.put(`${API_URL}/kyk/photos/${id}`, gallery);
    }
    createGallery(gallery) {
        return axios.post(`${API_URL}/kyk/photos/`, gallery);
    }
    uploadGallery(gallery) {
        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        return axios.post(`${API_URL}/kyk/uploadPhoto/`, gallery, {headers: headers});
    }
}

export default new GalleryDataService()