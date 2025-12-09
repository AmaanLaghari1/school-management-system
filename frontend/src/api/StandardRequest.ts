import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/standard'})

export const createStandard = (formdata: {}) =>  API.post('/add', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateStandard = (formdata: {}, id: '') =>  API.put('/edit/'+id, formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getStandard = () =>  API.get('/get', {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getStandardById = (id: '') =>  API.get('/get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getStandardBySchoolId = (schoolId: '') =>  API.get('/get_by_school_id/'+schoolId, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteStandard = (id: '') =>  API.delete('/delete/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})