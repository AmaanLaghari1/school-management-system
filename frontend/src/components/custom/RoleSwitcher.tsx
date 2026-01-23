import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const RoleSwitcher = () => {
    const roles = useSelector((state:any) => state.roles?.allRoles)
    const selectedRole = useSelector((state:any) => state.roles?.selectedRole)
    // console.log(roles)
    const dispatch = useDispatch()
    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRole = e.target.value
        dispatch({type: 'SWITCH_ROLE', payload: selectedRole})
    }

    
    if(!roles || roles.length <= 1){
        return null
    }

  return (
    <div>
        <select 
        className='select select-bordered select-sm w-full max-w-xs mb-2'
        value={selectedRole}
        onChange={handleRoleChange}
        >
        {   
            roles && roles.map((role: {role: {ROLE_NAME: string}}, index: number) => (
                <option 
                className='btn btn-xs' 
                key={index}
                // selected={role.role?.ROLE_NAME === selectedRole}
                >{role.role?.ROLE_NAME}</option>
            ))
        }
        </select>
    </div>
  )
}

export default React.memo(RoleSwitcher)