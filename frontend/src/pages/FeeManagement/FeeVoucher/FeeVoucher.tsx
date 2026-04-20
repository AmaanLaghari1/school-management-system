import React, { useEffect, useState } from 'react'
import { useModal } from '../../../hooks/useModal';
import * as API from '../../../api/FeeVoucher.ts'
import Alert from '../../../components/custom/Alert';
import DataTable, { Column } from '../../../components/custom/DataTable.tsx';
import AlertConfirm from '../../../components/custom/AlertConfirm';
import Button from '../../../components/ui/button/Button.tsx';
import FeeVoucherAdd from './FeeVoucherAdd.tsx';
import Switch from '../../../components/form/switch/Switch.tsx';
import FeeVoucherEdit from './FeeVoucherEdit.tsx';

interface FeeVoucherItem {
    VOUCHER_ID: string;
    SCHOOL_ID: string;
    ENROLMENT_ID: string;
    DATE: string;
    DETAIL: string;
    FEE_MONTH: string;
    TOTAL_AMOUNT: string;
    ACTIVE: string;
    REMARKS: string;
}

const FeeVoucher = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [feeVoucher, setFeeVoucher] = useState<FeeVoucherItem[]>([])
    const [prevValues, setPrevValues] = useState({})
    const addModal = useModal(false);
    const editModal = useModal(false);

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await API.getFeeVoucher()
            console.log(response)
            setFeeVoucher(response.data)
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
            formData.append('voucher_id', id)
            const response = await API.deleteFeeVoucher(formData)
            Alert({
                status: true,
                text: 'Fee ledger deleted successfully...',
            })
            setFeeVoucher(feeVoucher.filter(item => item.VOUCHER_ID !== id))
        }
        catch (error: any) {
            console.log(error)
            Alert({
                status: false,
                text: 'Something went wrong! Please try again.',
            })
        }
    }

    const toggleActive = async (values: {}) => {
        try {
            const response = await API.updateFeeVoucher(values)
        }
        catch (error: any) {
            console.log(error)
        }
    }

    const columns: Column<FeeVoucherItem>[] = [
        {
            key: 'school.SCHOOL_NAME',
            header: 'School Name',
            sortable: true
        },
        {
            key: 'enrolment.student.NAME',
            header: 'Student Name',
            sortable: true
        },
        {
            key: 'FEE_MONTH',
            header: 'Fee Month',
            sortable: true
        },
        {
            key: 'TOTAL_AMOUNT',
            header: 'Total Amount',
            sortable: true
        },
        {
            key: 'DATE',
            header: 'Date',
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
                                voucher_id: row.VOUCHER_ID,
                                school_id: row.SCHOOL_ID,
                                enrolment_id: row.enrolment.ENROLMENT_ID,
                                fee_month: row.FEE_MONTH,
                                date: row.DATE,
                                total_amount: row.TOTAL_AMOUNT,
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
                                    text: 'Do you really want to delete this voucher? This process cannot be undone.',
                                })

                                if (confirm) {
                                    handleDelete(row.VOUCHER_ID)
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
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Fee Vouchers</h2>
                <Button size="sm" variant="primary"
                    onClick={() => addModal.openModal()}
                >
                    Add New +
                </Button>
            </div>

            <DataTable data={feeVoucher} columns={columns} itemsPerPage={10} />

            {
                addModal.isOpen &&
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-99999">
                    <div className="bg-white p-6 rounded w-[800px]">
                        <FeeVoucherAdd closeModal={addModal.closeModal} fetchData={fetchData} />
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
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-99999">
                    <div className="bg-white p-6 rounded w-[800px]">
                        <FeeVoucherEdit fetchData={fetchData} closeModal={editModal.closeModal} prevValues={prevValues} />
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

export default React.memo(FeeVoucher)