import axios from 'axios'
import { API_URL } from '../../Constants'

class UserDataService {

    getUserDetail(name) {
        return axios.get(`${API_URL}/kyk/users/detail/${name}`);
    }
    getFullUsername(name) {
        return axios.get(`${API_URL}/kyk/users/fullusername/${name}`);
    }
    getAllUsers() {
        return axios.get(`${API_URL}/kyk/users/getallusers`);
    }
    getUserById(id) {
        return axios.get(`${API_URL}/kyk/users/getuserbyid/${id}`);
    }
    deleteUser(id) {
        return axios.delete(`${API_URL}/kyk/users/deleteuser/${id}`);
    }
    updateUser(user) {
        return axios.put(`${API_URL}/kyk/users/updateuser`, user);
    }
    createUser(user) {
        return axios.post(`${API_URL}/kyk/users/createuser`, user);
    }
}

export default new UserDataService()