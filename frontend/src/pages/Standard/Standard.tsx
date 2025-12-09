import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router";
import * as API from '../../api/StandardRequest'
import DataTable, { Column } from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/custom/Alert";

interface Standard {
    STANDARD_ID: string;
    SCHOOL_ID: string;
    STANDARD_NAME: string;
    SECTION: string;
    ACTIVE: string;
    REMARKS: string;
    ACTIONS: string;
}

const Standard = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [standards, setStandards] = useState<Standard[]>([])
    const navigate = useNavigate()

    const fetchStandards = async () => {
        setLoading(true)
        try {
            const response = await API.getStandard()
            setStandards(response.data)
            // console.log(response)
        } catch (error: any) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: '') => {
        try {
            const response = await API.deleteStandard(id)
            Alert({status: true, text: response.data?.message || 'Standard deleted...'})
            setStandards(standards.filter(item => item.STANDARD_ID != id))
        }
        catch (error: any) {
            console.log(error)
            Alert({status: false, text: error.data?.error_message || 'Unable to delete the standard'})   
        }
    }

    useEffect(() => {
        fetchStandards()
    }, [])

    const columns: Column<Standard>[] = [
        {
            key: 'STANDARD_ID',
            header: 'ID',
            sortable: true
        },
        {
            key: 'school.SCHOOL_NAME',
            header: 'School Name',
            sortable: true
        },
        {
            key: 'STANDARD_NAME',
            header: 'Standard Name',
            sortable: true
        },
        {
            key: 'SECTION',
            header: 'Section',
            sortable: true
        },
        {
            key: 'REMARKS',
            header: 'Remarks',
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
                                navigate('/standard/edit', {
                                    state: {
                                        prevValues: row
                                    }
                                })
                            }}
                        >Edit</button>
                        {/* Optional: Add delete or other actions here */}
                        <button disabled={loading} onClick={() => handleDelete(row.STANDARD_ID)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                )
            }
        },
    ]

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">All Standards</h2>
                <Link to="/standard/add">
                    <Button size="sm" variant="primary">
                        Add New +
                    </Button>
                </Link>
            </div>

            <DataTable data={standards} columns={columns} itemsPerPage={10} />
        </div>
    )
}

export default Standard