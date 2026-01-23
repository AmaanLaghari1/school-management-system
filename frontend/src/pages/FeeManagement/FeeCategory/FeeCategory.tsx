import { useEffect, useState } from "react"
import * as API from '../../../api/FeeCategory'
import DataTable, { Column } from "../../../components/custom/DataTable";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/custom/Alert";
import AlertConfirm from "../../../components/custom/AlertConfirm";
import FeeCategoryAdd from "./FeeCategoryAdd";
import FeeCategoryEdit from "./FeeCategoryEdit";
import { useModal } from "../../../hooks/useModal";

interface FeeCategory {
    FEE_CAT_ID: string;
    CAT_TITLE: string;
    REMARKS: string;
    ACTIVE: boolean;
}

const FeeCategory = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<FeeCategory[]>([])
    const [prevValues, setPrevValues] = useState({})
    const addModal = useModal(false);
    const editModal = useModal(false);

    const fetchCategory = async () => {
        setLoading(true)
        try {
            const response = await API.getFeeCategory()
            // console.log(response)
            setCategories(response.data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const handleDelete = async (id: '') => {
        setLoading(true)
        try {
            const response = await API.deleteFeeCategory({ fee_cat_id: id })
            Alert({ status: true, text: response.data?.message || 'Category deleted...' })
            setCategories(categories.filter(item => item.FEE_CAT_ID != id))
        } catch (error: any) {
            console.log(error)
            Alert({ status: false, text: error.data?.error_message || 'Unable to delete the session' })
        }
        setLoading(false)
    }

    const columns: Column<FeeCategory>[] = [
        {
            key: 'FEE_CAT_ID',
            header: 'ID',
            sortable: true
        },
        {
            key: 'CAT_TITLE',
            header: 'Session Name',
            sortable: true
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
                                    handleDelete(row.FEE_CAT_ID)
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

    useEffect(() => {
        fetchCategory()
    }, [])
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">All Fee Categories</h2>
                <Button size="sm" variant="primary"
                onClick={() => addModal.openModal()}
                >
                    Add New +
                </Button>
            </div>

            <DataTable data={categories} columns={columns} itemsPerPage={10} />

            {
                addModal.isOpen &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-[800px]">
                        <FeeCategoryAdd fetchData={fetchCategory} closeModal={addModal.closeModal} />
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
                        <FeeCategoryEdit fetchData={fetchCategory} closeModal={editModal.closeModal} prevValues={prevValues} />
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

export default FeeCategory