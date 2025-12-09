import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/session'})

export const createSession = (formdata: {}) =>  API.post('/add', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateSession = (formdata: {}, id: '') =>  API.put('/edit/'+id, formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getSession = () =>  API.get('/get', {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getSessionById = (id: '') =>  API.get('/get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteSession = (id: '') =>  API.delete('/delete/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})