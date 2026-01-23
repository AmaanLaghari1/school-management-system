import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/fee/category/'});

export const getFeeCategory = () => API.get('get', {
    headers: {
        "Content-Type": "application/json"
    }
});

export const getFeeCategoryById = (id: any) => API.get('get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const createFeeCategory = (formdata: {}) => API.post('post', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateFeeCategory = (formdata: {}) => API.post('put', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteFeeCategory = (formdata: {}) => API.post('delete', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})
