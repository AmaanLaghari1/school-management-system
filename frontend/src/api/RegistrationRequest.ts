import axios from "axios"

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/registration'})

export const getRegistrations = (formdata: any) => {
    return API.post('/get_by', formdata, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const registerStudent = (formdata: any) => {
    return API.post('/register_student', formdata, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const updateRegistration = (formdata: any, id: string) => {
    return API.post(`/update_registration/${id}`, formdata, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

export const downloadRegistrationPdf = (id: string | number) => {
    return API.get(`/pdf/${id}`, {
        responseType: "blob",
    })
}
