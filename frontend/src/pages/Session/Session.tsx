import { useEffect, useState } from "react"
import * as API from '../../api/SessionRequest'
import DataTable, { Column } from "../../components/custom/DataTable";
import { Link, useNavigate } from "react-router";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/custom/Alert";

interface Session {
    SESSION_ID: string;
    SESSION_NAME: string;
    YEAR: string;
    ACTIVE: string;
    REMARKS: string;
    ACTIONS: string;
}

const Session = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [sessions, setSessions] = useState<Session[]>([])
    const navigate = useNavigate()

    const fetchSessions = async () => {
        setLoading(true)
        try {
            const response = await API.getSession()
            // console.log(response)
            setSessions(response.data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const handleDelete = async (id: '') => {
        setLoading(true)
        try {
            const response = await API.deleteSession(id)
            Alert({status: true, text: response.data?.message || 'Session deleted...'})
            setSessions(sessions.filter(item => item.SESSION_ID != id))
        } catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.data?.error_message || 'Unable to delete the session'})   
        }
        setLoading(false)
    }

    const columns: Column<Session>[] = [
        {
            key: 'SESSION_ID',
            header: 'ID',
            sortable: true
        },
        {
            key: 'SESSION_NAME',
            header: 'Session Name',
            sortable: true
        },
        {
            key: 'YEAR',
            header: 'Year',
            sortable: true
        },
        {
            key: 'ACTIONS',
            header: 'Actions',
            render: (row: any) => {
                return (
                    <div className="flex space-x-2">
                        <button className="text-blue-600 hover:underline text-sm"
                            onClick={() => {
                                navigate('/session/edit', {
                                    state: {
                                        prevValues: row
                                    }
                                })
                            }}
                        >Edit</button>
                        {/* Optional: Add delete or other actions here */}
                        <button disabled={loading} onClick={() => handleDelete(row.SESSION_ID)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                )
            }
        },
    ]

    useEffect(() => {
        fetchSessions()
    }, [])
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">All Sessions</h2>
                <Link to="/session/add">
                    <Button size="sm" variant="primary">
                        Add New +
                    </Button>
                </Link>
            </div>

            <DataTable data={sessions} columns={columns} itemsPerPage={10} />
        </div>

    )
}

export default Session