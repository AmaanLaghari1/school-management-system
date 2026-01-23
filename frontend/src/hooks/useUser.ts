import { useSelector } from "react-redux";

export const useUser = () => {
    const user = useSelector((state: { auth: { authData: { user: any } } }) => state.auth.authData.user)
    return {user}
}

export const useAuthToken = () => {
    const token = useSelector((state: { auth: { authData: { token: string } } }) => state.auth.authData.token)
    return {token}
}

export const useAuth = () => {
    const authData = useSelector((state: { auth: { authData: any } }) => state.auth.authData)
    return {authData}
}

export const useRoles = () => {
    const roles = useSelector((state: { roles: { allRoles: any } }) => state.roles.allRoles)
    const selectedRole = useSelector((state: { roles: { selectedRole: any } }) => state.roles.selectedRole)
    return {roles, selectedRole}
}