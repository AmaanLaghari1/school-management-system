import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/fee/fee_list/'});

export const getFeeList = () => API.get('get', {
    headers: {
        "Content-Type": "application/json"
    }
});

export const getFeeListById = (id: any) => API.get('get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const createFeeList = (formdata: {}) => API.post('post', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateFeeList = (formdata: {}) => API.post('put', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteFeeList = (formdata: {}) => API.post('delete', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})


export const getFilteredFeelist = (formdata: {}) => API.post('get_filtered', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})