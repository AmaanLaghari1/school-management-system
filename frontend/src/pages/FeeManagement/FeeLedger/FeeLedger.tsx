import React, { useEffect, useState } from 'react'
import { useModal } from '../../../hooks/useModal';
import * as API from '../../../api/FeeLedger.ts'
import Alert from '../../../components/custom/Alert';
import DataTable, { Column } from '../../../components/custom/DataTable.tsx';
import AlertConfirm from '../../../components/custom/AlertConfirm';
import Button from '../../../components/ui/button/Button.tsx';
import FeeLedgerAdd from './FeeLedgerAdd.tsx';

interface FeeLedgerItem {
    FEE_LEDGER_ID: string;
    STUDENT_ID: string;
    VOUCHER_ID: string;
    DATE: string;
    DETAIL: string;
    VOUCHER_AMOUNT: string;
    PAID_AMOUNT: string;
    REMARKS: string;
}


const FeeLedger = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [feeLedger, setFeeLedger] = useState<FeeLedgerItem[]>([])
    const [prevValues, setPrevValues] = useState({})
    const addModal = useModal(false);
    const editModal = useModal(false);

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await API.getFeeLedger()
            // console.log(response)
            setFeeLedger(response.data)
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDelete = async (id: string) => {
        try {
            const formData = new FormData()
            formData.append('fee_ledger_id', id)
            const response = await API.deleteFeeLedger(formData)
            Alert({
                status: true,
                text: 'Fee ledger deleted successfully...',
            })
            setFeeLedger(feeLedger.filter(item => item.FEE_LEDGER_ID !== id)) // Update the list after deletion
        }
        catch (error: any) {
            console.log(error)
            Alert({
                status: false,
                text: 'Something went wrong! Please try again.',
            })
        }
    }

    const columns: Column<FeeLedgerItem>[] = [
        {
            key: 'student.STUDENT_NAME',
            header: 'Student Name',
            sortable: true
        },
        {
            key: 'DATE',
            header: 'Date',
            sortable: true
        },
        {
            key: 'DETAIL',
            header: 'Detail',
            sortable: true
        },
        {
            key: 'VOUCHER_AMOUNT',
            header: 'Voucher Amount',
            sortable: true
        },
        {
            key: 'PAID_AMOUNT',
            header: 'Paid Amount',
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
                                    handleDelete(row.FEE_LEDGER_ID)
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
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Fee Ledgers</h2>
                <Button size="sm" variant="primary"
                    onClick={() => addModal.openModal()}
                >
                    Add New +
                </Button>
            </div>

            <DataTable data={feeLedger} columns={columns} itemsPerPage={10} />
        
            {
                addModal.isOpen &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-[800px]">
                        <FeeLedgerAdd closeModal={addModal.closeModal} fetchData={fetchData} />
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
                        {/* <FeeListEdit fetchData={fetchFeelist} closeModal={editModal.closeModal} prevValues={prevValues} /> */}
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

export default React.memo(FeeLedger)