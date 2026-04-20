import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/fee/fee_ledger/'});

export const getFeeLedger = () => API.get('get', {
    headers: {
        "Content-Type": "application/json"
    }
});

export const getFeeLedgerById = (id: any) => API.get('get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const createFeeLedger = (formdata: {}) => API.post('post', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateFeeLedger = (formdata: {}) => API.post('put', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteFeeLedger = (formdata: {}) => API.post('delete', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})
