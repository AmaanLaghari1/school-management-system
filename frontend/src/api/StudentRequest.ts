import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/student'})

export const getStudent = () => {
    return API.get('/get', {
        headers: {
            "Access-Control-Allow-Origin" : "*"
        }
    })
}

export const getStudentBySchoolId = (schoolId: '') => {
    return API.get('/get_by_school/'+schoolId, {
        headers: {
            "Access-Control-Allow-Origin" : "*"
        }
    })
}

export const createStudent = (formdata: {}) => {
    return API.post('/add', formdata, {
        headers: {
            "Content-Type" : "application/json"
        }
    })
}

export const updateStudent = (formdata: {}, id: string) => {
    return API.put('/edit/'+id, formdata, {
        headers: {
            "Content-Type" : "application/json"
        }
    })
}

export const getGuardianRelation = () => {
    return axios.get('http://127.0.0.1:8000/api/guardian/get', {
        headers: {
            "Access-Control-Allow-Origin" : "*"
        }
    })
}
