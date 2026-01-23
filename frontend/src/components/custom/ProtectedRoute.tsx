import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const activeRole = useSelector((state:any) => state.roles?.selectedRole)
    const navigate = useNavigate()

    useEffect(() => {
        if(activeRole != 'ADMIN' || activeRole != 'SUPER ADMIN' || activeRole != 'OPERATOR'){
            // Redirect to not authorized page or show a message
            console.log('Not authorized')
            navigate
        }
    }, [activeRole])
  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute