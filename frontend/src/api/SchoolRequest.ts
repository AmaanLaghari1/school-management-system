import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/school'})

export const getSchool = () => {
    return API.get('/get', {
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    })
}

export const createSchool = (formdata: {}) => {
    return API.post('/add', formdata, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const updateSchool = (formdata: {}, id: '') => {
    return API.put('/edit/'+id, formdata, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const deleteSchool = (id: '') => {
    return API.delete('/delete/'+id, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}