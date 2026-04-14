import { useEffect, useState } from "react"
import * as API from '../../../api/FeeList'
import DataTable, { Column } from "../../../components/custom/DataTable";
import Button from "../../../components/ui/button/Button";
import AlertConfirm from "../../../components/custom/AlertConfirm";
import { useModal } from "../../../hooks/useModal";
import Switch from "../../../components/form/switch/Switch";
import FeeListAdd from "./FeeListAdd";
import FeeListEdit from "./FeeListEdit";
import Alert from "../../../components/custom/Alert";

interface FeeListItem {
    FEE_ID: string;
    FEE_CAT_ID: string;
    SESSION_ID: string;
    STANDARD_ID: string;
    TITLE: string;
    AMOUNT: string;
    REMARKS: string;
    ACTIVE: boolean;
}
const FeeList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [feelist, setFeelist] = useState<FeeListItem[]>([])
    const [prevValues, setPrevValues] = useState({})
    const addModal = useModal(false);
    const editModal = useModal(false);

    const fetchFeelist = async () => {
        setLoading(true)
        try {
            const response = await API.getFeeList()
            // console.log(response)
            setFeelist(response.data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchFeelist()
    }, [])

    const toggleActive = async (values: {}) => {
        try {
            const response = await API.updateFeeList(values)
        }
        catch (error: any) {
            console.log(error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const formData = new FormData()
            formData.append('fee_id', id)
            const response = await API.deleteFeeList(formData)
            Alert({
                status: true,
                text: 'Fee list deleted successfully...',
            })
            setFeelist(feelist.filter(item => item.FEE_ID !== id)) // Update the list after deletion
        }
        catch (error: any) {
            console.log(error)
            Alert({
                status: false,
                text: 'Something went wrong! Please try again.',
            })
        }
    }

    const columns: Column<FeeListItem>[] = [
        // {
        //     key: 'FEE_ID',
        //     header: 'ID',
        //     sortable: true
        // },
        {
            key: 'session.SESSION_NAME',
            header: 'Session',
            sortable: true
        },
        {
            key: 'standard.STANDARD_NAME',
            header: 'Standard',
            sortable: true
        },
        {
            key: 'fee_category.CAT_TITLE',
            header: 'Category',
            sortable: true
        },
        {
            key: 'TITLE',
            header: 'Title',
            sortable: true
        },
        {
            key: 'AMOUNT',
            header: 'Amount',
            sortable: true
        },
        {
            key: 'ACTIVE',
            header: 'Active',
            sortable: true,
            render: (row: any) => {
                return (
                    <div>
                        <Switch label="" defaultChecked={row.ACTIVE == 1}
                            onChange={() => toggleActive({
                                fee_id: row.FEE_ID,
                                session_id: row.SESSION_ID,
                                standard_id: row.STANDARD_ID,
                                fee_cat_id: row.FEE_CAT_ID,
                                title: row.TITLE,
                                amount: row.AMOUNT,
                                remarks: row.REMARKS,
                                active: row.ACTIVE == 1 ? 0 : 1
                            })}
                        />
                    </div>
                )
            }
        },
        {
            key: 'REMARKS',
            header: 'Remarks',
            sortable: true,
            render: (row: any) => row.REMARKS || '-'
        },
        {
            key: 'ACTIONS',
            header: 'Actions',
            render: (row: any) => {
                return (
                    <div className="flex space-x-2">
                        <button className="text-blue-600 hover:underline text-sm"
                            onClick={() => {
                                setPrevValues(row)
                                editModal.openModal()
                            }}
                        >Edit</button>
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault()

                                const confirm = await AlertConfirm({
                                    title: 'Are you sure?',
                                    text: 'Do you really want to delete this session? This process cannot be undone.',
                                })

                                if (confirm) {
                                    handleDelete(row.FEE_ID)
                                }
                            }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Delete
                            </button>
                        </form>

                    </div>
                )
            }
        },
    ]


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Feelist</h2>
                <Button size="sm" variant="primary"
                    onClick={() => addModal.openModal()}
                >
                    Add New +
                </Button>
            </div>

            <DataTable data={feelist} columns={columns} itemsPerPage={10} />

            {
                addModal.isOpen &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-[800px]">
                        {/* <FeeCategoryAdd fetchData={fetchCategory} closeModal={addModal.closeModal} /> */}
                        <FeeListAdd closeModal={addModal.closeModal} fetchData={fetchFeelist} />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => addModal.closeModal()}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            }

            {
                editModal.isOpen &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-[800px]">
                        <FeeListEdit fetchData={fetchFeelist} closeModal={editModal.closeModal} prevValues={prevValues} />
                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="secondary" onClick={() => editModal.closeModal()}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default FeeList