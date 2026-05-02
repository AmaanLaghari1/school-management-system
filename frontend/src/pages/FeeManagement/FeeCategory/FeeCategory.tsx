import { useEffect, useState } from "react"
import * as API from '../../../api/FeeCategory'
import DataTable, { Column } from "../../../components/custom/DataTable";
import Button from "../../../components/ui/button/Button";
import Alert from "../../../components/custom/Alert";
import AlertConfirm from "../../../components/custom/AlertConfirm";
import FeeCategoryAdd from "./FeeCategoryAdd";
import FeeCategoryEdit from "./FeeCategoryEdit";
import { useModal } from "../../../hooks/useModal";
import Switch from "../../../components/form/switch/Switch";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { Modal } from "../../../components/ui/modal";

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

    const toggleActive = async (values: {}) => {
        try {
            const response = await API.updateFeeCategory(values)
            fetchCategory()
        } catch (error: any) {
            console.log(error)
        }
    }

    const columns: Column<FeeCategory>[] = [
        // {
        //     key: 'FEE_CAT_ID',
        //     header: 'ID',
        //     sortable: true
        // },
        {
            key: 'CAT_TITLE',
            header: 'Title',
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
                                fee_cat_id: row.FEE_CAT_ID,
                                remarks: row.REMARKS,
                                cat_title: row.CAT_TITLE,
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
                    <div className="flex flex-wrap space-x-2">
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
        <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center">
                <PageBreadcrumb pageTitle="Fee Categories" />
                <Button size="sm" variant="primary"
                    onClick={() => addModal.openModal()}
                >
                    Add New +
                </Button>
            </div>

            <DataTable data={categories} columns={columns} itemsPerPage={10} />

            {
                addModal.isOpen &&
                <Modal isOpen={addModal.isOpen} onClose={addModal.closeModal} showCloseButton={true} className="p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <FeeCategoryAdd fetchData={fetchCategory} closeModal={addModal.closeModal} />
                </Modal>
            }

            {
                editModal.isOpen &&
                <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} showCloseButton={true} className="p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <FeeCategoryEdit fetchData={fetchCategory} closeModal={editModal.closeModal} prevValues={prevValues} />
                </Modal>
            }
        </div>

    )
}

export default FeeCategory