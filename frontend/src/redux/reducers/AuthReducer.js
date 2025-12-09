const initialData = {
    authData: null,
    loading: false,
    error: false,
    updLoading: true,
    token: null
};

const AuthReducer = (state = initialData, action) => {
    switch(action.type) {
        case 'AUTH_START':
            return { ...state, loading: true, error: false };

        case 'AUTH_SUCCESS':
            return { 
                ...state, 
                authData: typeof action.payload === 'string' ? JSON.parse(action.payload) : action.payload, 
                token: action.payload.token, 
                loading: false, 
                error: false 
            };

        case 'AUTH_FAILED':
            return { ...state, authData: null, loading: false, error: true };

        case 'LOGOUT':
            // localStorage.removeItem('persist:auth');
            return { ...state, authData: null, token: null, loading: false, error: false };

        default:
            return state;
    }
};

export default AuthReducer;
