import * as API from '../../api/AuthRequest'
import Alert from '../../components/custom/Alert'

export const register = (formdata: {}) => {
    return async (dispatch: any) => {
        dispatch({type: 'AUTH_START'})

        try {
            const response = await API.register(formdata)
            // console.log(response)

            if(response.data){
                dispatch({type: 'AUTH_SUCCESS', payload: response.data})
            }
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.response.data.error_message || 'Sign up failed!!!'})
            dispatch({type: 'AUTH_FAILED'})
        }
    }
}

export const login = (formdata: {}) => {
    return async (dispatch: any) => {
        dispatch({type: "AUTH_START"})

        try {
            const response = await API.login(formdata)
            console.log(response)

            if(response.data){
                dispatch({type: "AUTH_SUCCESS", payload: response.data})
                dispatch({type: "SET_ROLES", payload: response.data.user.roles})
                dispatch({type: "SWITCH_ROLE", payload: response.data.user.role[0].ROLE_NAME})
            }
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.response.data.error || 'Invalid Credintials!!!'})
            dispatch({type: "AUTH_FAILED"})
        }
    }
}

export const logOut = (token: string) => {
    return async (dispatch: any) => {
        try {
            await API.logOut(token);
            // console.log(response)

            dispatch({ type: "LOGOUT" });
        } catch (error: any) {
            console.error('Logout error:', error.response?.data || error);
        }
    };
};