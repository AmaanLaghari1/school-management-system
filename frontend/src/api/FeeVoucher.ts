import axios from "axios";

const API = axios.create({baseURL: import.meta.env.VITE_API_URL+'/fee/fee_voucher/'});

export const getFeeVoucher = () => API.get('get', {
    headers: {
        "Content-Type": "application/json"
    }
});

export const getFeeVoucherById = (id: any) => API.get('get/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const getFeeVoucherBySchoolId = (id: any) => API.get('get_by_school/'+id, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const createFeeVoucher = (formdata: {}) => API.post('post', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const updateFeeVoucher = (formdata: {}) => API.post('put', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const deleteFeeVoucher = (formdata: {}) => API.post('delete', formdata, {
    headers: {
        "Content-Type": "application/json"
    }
})

export const downloadVoucher = (formdata: {}) => API.post('test-pdf', formdata, {
    responseType: 'blob',
    headers: {
        "Content-Type": "application/json"
    }
})

export const downloadFeeVouchers = (formdata: {}) => API.post('test-pdf', formdata, {
    responseType: 'blob',
    headers: {
        "Content-Type": "application/json"
    }
})
