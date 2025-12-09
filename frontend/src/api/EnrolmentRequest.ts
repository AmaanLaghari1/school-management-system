import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/enrolment'})

export const createEnrolment = (formdata: {}) =>  API.post('/add', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateEnrolment = (formdata: {}, id: '') =>  API.put('/edit/'+id, formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getEnrolment = (formdata: {}) =>  API.post('/get', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getEnrolmentById = (id: '') =>  API.get('/get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteEnrolment = (id: '') =>  API.delete('/delete/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})