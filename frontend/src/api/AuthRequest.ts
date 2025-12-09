import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/auth'})

export const register = (formdata: {}) => {
    return API.post('/register', formdata, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const login = (formdata: {}) => {
    return API.post('/login', formdata, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}

export const logOut = (token: string) => {
    return API.post('/logout', {}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}