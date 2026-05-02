import React, { useEffect, useState } from 'react'
import PageBreadcrumb from '../../components/common/PageBreadCrumb'
import * as API from '../../api/UserRequest'
import DataTable from '../../components/custom/DataTable';
import Button from '../../components/ui/button/Button';
import { useUser } from '../../hooks/useUser';
import { isAllSchoolsUser } from '../../helpers/helper';

interface User {
    USER_ID: string;
    NAME: string;
    EMAIL: string;
    ACTIONS: string;
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([])
    const { user } = useUser()
    const canViewAllSchools = isAllSchoolsUser(user)

    const fetchData = async () => {
        try {
            const response = canViewAllSchools
                ? await API.getUsers()
                : await API.getUsersBySchoolId(user.SCHOOL_ID);
            setUsers(response.data);
        }
        catch (error) {
            console.error("Failed to fetch users", error);
        }
    }

    useEffect(() => {
       fetchData() 
    }, [])

    const columns = [
        { key: "NAME", header: "Name", sortable: true },
        { key: "EMAIL", header: "Email", sortable: true },
        {key: "ACTIONS", header: "Actions", render: () => (
            <div className="flex flex-wrap space-x-2">
                <button className="text-blue-600 hover:underline text-sm">Edit</button>
                <button className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
        )}
    ]

  return (
    <div>
        <PageBreadcrumb pageTitle="Users" />

        <Button className='ml-2' size="sm" variant="primary">
            Add New +
        </Button>

        <DataTable
            columns={columns}
            data={users}
        />
    </div>
  )
}

export default React.memo(Users)
