const initialState = {
    allRoles: [],
    selectedRole: null
}

const RolesReducer = (state=initialState, action) => {
    switch(action.type){
        case 'SET_ROLES':
            return {
                ...state,
                allRoles: action.payload
            }
        case 'SWITCH_ROLE':
            return {
                ...state,
                selectedRole: action.payload
            }
        default: 
            return state
    }
}

export default RolesReducer