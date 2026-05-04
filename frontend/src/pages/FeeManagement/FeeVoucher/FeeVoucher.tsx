import React, { useEffect, useMemo, useState } from 'react'
import { useModal } from '../../../hooks/useModal'
import * as API from '../../../api/FeeVoucher.ts'
import Alert from '../../../components/custom/Alert'
import DataTable, { Column } from '../../../components/custom/DataTable.tsx'
import AlertConfirm from '../../../components/custom/AlertConfirm'
import Button from '../../../components/ui/button/Button.tsx'
import Switch from '../../../components/form/switch/Switch.tsx'
import PageBreadcrumb from '../../../components/common/PageBreadCrumb.tsx'
import { Modal } from '../../../components/ui/modal'
import { useNavigate } from 'react-router'
import { Formik, Form } from 'formik'
import Select from '../../../components/form/Select.tsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSchool } from '../../../api/SchoolRequest.ts'
import { getStandard, getStandardBySchoolId } from '../../../api/StandardRequest.ts'
import useDebounce from '../../../hooks/useDebounce.ts'
import { useSelector } from 'react-redux'
import Checkbox from '../../../components/form/input/Checkbox.tsx'
import { filterSchoolsForUser, isAllSchoolsUser } from '../../../helpers/helper'

interface FeeVoucherItem {
    VOUCHER_ID: string
    SCHOOL_ID: string
    ENROLMENT_ID: string
    DATE: string
    DETAIL: string
    FEE_MONTH: string
    TOTAL_AMOUNT: string
    ACTIVE: string
    REMARKS: string
    DUES_AMOUNT?: string
    CURRENT_AMOUNT?: string
    PAYABLE_AMOUNT?: string
    school?: { SCHOOL_ID?: string; SCHOOL_NAME?: string }
    enrolment?: {
        STANDARD_ID?: string
        student?: { NAME?: string }
    }
    details?: any[]
}

const ALL_OPTION = 'all'

const FeeVoucher = () => {
    const [loading, setLoading] = useState(false)
    const [prevValues, setPrevValues] = useState<any>({})
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [downloading, setDownloading] = useState(false)

    const viewModal = useModal(false)
    const navigate = useNavigate()
    const user = useSelector((state: any) => state.auth.authData.user)
    const canViewAllSchools = isAllSchoolsUser(user)
    const queryClient = useQueryClient()

    // Fetch schools
    const { data: schools = [] } = useQuery({
        queryKey: ['schools', user?.SCHOOL_ID],
        queryFn: getSchool,
        select: (res) => filterSchoolsForUser(res.data || [], user),
    })

    // Delete
    const handleDelete = async (id: string) => {
        setLoading(true)
        try {
            await API.deleteFeeVoucher({ voucher_id: id })
            queryClient.invalidateQueries({ queryKey: ['feeVouchers'] })
            Alert({ status: true, text: 'Deleted successfully' })
        } catch {
            Alert({ status: false, text: 'Delete failed' })
        }
        setLoading(false)
    }

    // Toggle active
    const toggleActive = async (values: {}) => {
        try {
            await API.updateFeeVoucher(values)
            queryClient.invalidateQueries({ queryKey: ['feeVouchers'] })
        } catch (error) {
            console.log(error)
        }
    }

    // Download helper
    const downloadFile = (data: any, filename: string) => {
        const url = window.URL.createObjectURL(
            new Blob([data], { type: 'application/pdf' })
        )
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap justify-between items-center">
                <PageBreadcrumb pageTitle="Fee Vouchers" />

                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant="success"
                        disabled={!selectedIds.length || downloading}
                        onClick={async () => {
                            // setDownloading(true)
                            try {
                                const res = await API.downloadVoucher({
                                    voucher_ids: selectedIds,
                                })
                                console.log(res)
                                // return
                                downloadFile(res.data, 'fee_voucher.pdf')
                            } catch (error) {
                                Alert({ status: false, text: 'Download failed' })
                                console.log(error)
                            }
                            // setDownloading(false)
                        }}
                    >
                        Download Selected
                    </Button>

                    {/* <Button
                        size="sm"
                        variant="secondary"
                        disabled={downloading}
                        onClick={async () => {
                            setDownloading(true)
                            try {
                                const res = await API.downloadFeeVouchers({
                                    school_id: canViewAllSchools ? '' : user?.SCHOOL_ID,
                                })
                                downloadFile(res.data, 'all_vouchers.pdf')
                            } catch {
                                Alert({ status: false, text: 'Download failed' })
                            }
                            setDownloading(false)
                        }}
                    >
                        Download All
                    </Button> */}

                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate('/fee/voucher/add')}
                    >
                        Add New +
                    </Button>
                </div>
            </div>

            <Formik
                initialValues={{
                    school_id: canViewAllSchools ? '' : user?.SCHOOL_ID || '',
                    standard_id: ALL_OPTION,
                    fee_month: ALL_OPTION,
                }}
                onSubmit={() => {}}
            >
                {({ values, setFieldValue }) => {
                    const debouncedFilters = useDebounce(values, 400)

                    // Default school
                    useEffect(() => {
                        if (!canViewAllSchools && !values.school_id && schools.length > 0) {
                            setFieldValue(
                                'school_id',
                                user?.SCHOOL_ID
                            )
                        }
                    }, [schools])

                    // Standards
                    const { data: standards = [] } = useQuery({
                        queryKey: ['standards', values.school_id],
                        queryFn: () =>
                            canViewAllSchools && !values.school_id
                                ? getStandard()
                                : getStandardBySchoolId(values.school_id),
                        enabled: canViewAllSchools || !!values.school_id,
                        select: (res) => res.data || [],
                    })

                    // Fee vouchers
                    const { data: feeVouchers = [] } = useQuery({
                        queryKey: ['feeVouchers', debouncedFilters.school_id],
                        queryFn: () =>
                            canViewAllSchools && !debouncedFilters.school_id
                                ? API.getFeeVoucher()
                                : API.getFeeVoucherBySchoolId(
                                      debouncedFilters.school_id
                                  ),
                        enabled:
                            canViewAllSchools ||
                            !!debouncedFilters.school_id,
                        select: (res) => res.data || [],
                    })

                    // Filtered
                    const filteredFeeVouchers = useMemo(() => {
                        return feeVouchers.filter((v: FeeVoucherItem) => {
                            const schoolMatch =
                                canViewAllSchools ||
                                String(v.SCHOOL_ID) === String(user?.SCHOOL_ID) ||
                                String(v.school?.SCHOOL_ID) === String(user?.SCHOOL_ID)

                            const standardMatch =
                                values.standard_id === ALL_OPTION ||
                                v.enrolment?.STANDARD_ID ===
                                    values.standard_id

                            const monthMatch =
                                values.fee_month === ALL_OPTION ||
                                v.FEE_MONTH === values.fee_month

                            return schoolMatch && standardMatch && monthMatch
                        })
                    }, [feeVouchers, values, canViewAllSchools, user?.SCHOOL_ID])

                    // Reset selection when data changes
                    useEffect(() => {
                        setSelectedIds([])
                    }, [])

                    // Columns
                    const columns: Column<FeeVoucherItem>[] = [
                        {
                            key: 'select',
                            header: (
                                <Checkbox
                                    checked={
                                        selectedIds.length ===
                                            filteredFeeVouchers.length &&
                                        filteredFeeVouchers.length > 0
                                    }
                                    onChange={(e: any) => {
                                        if (e.target.checked) {
                                            setSelectedIds(
                                                filteredFeeVouchers.map(
                                                    (v) => v.VOUCHER_ID
                                                )
                                            )
                                        } else {
                                            setSelectedIds([])
                                        }
                                    }}
                                />
                            ),
                            render: (row) => (
                                <Checkbox
                                    checked={selectedIds.includes(
                                        row.VOUCHER_ID
                                    )}
                                    onChange={(e: any) => {
                                        if (e.target.checked) {
                                            setSelectedIds((prev) => [
                                                ...prev,
                                                row.VOUCHER_ID,
                                            ])
                                        } else {
                                            setSelectedIds((prev) =>
                                                prev.filter(
                                                    (id) =>
                                                        id != row.VOUCHER_ID
                                                )
                                            )
                                        }
                                    }}
                                />
                            ),
                        },
                        {
                            key: 'school.SCHOOL_NAME',
                            header: 'School Name',
                        },
                        {
                            key: 'enrolment.student.NAME',
                            header: 'Student Name',
                        },
                        {
                            key: 'FEE_MONTH',
                            header: 'Fee Month',
                        },
                        {
                            key: 'CURRENT_AMOUNT',
                            header: 'Current Amount',
                        },
                        {
                            key: 'PAYABLE_AMOUNT',
                            header: 'Payable Amount',
                        },
                        {
                            key: 'DUES_AMOUNT',
                            header: 'Dues Amount',
                        },
                        {
                            key: 'DATE',
                            header: 'Issue Date',
                        },
                        {
                            key: 'ACTIVE',
                            header: 'Active',
                            render: (row) => (
                                <Switch
                                    defaultChecked={row.ACTIVE == '1'}
                                    onChange={() =>
                                        toggleActive({
                                            voucher_id: row.VOUCHER_ID,
                                            active:
                                                row.ACTIVE == '1' ? 0 : 1,
                                        })
                                    }
                                />
                            ),
                        },
                        {
                            key: 'ACTIONS',
                            header: 'Actions',
                            render: (row) => (
                                <div className="flex gap-2">
                                    <button
                                        className="text-yellow-600 hover:underline text-sm"
                                        onClick={() => {
                                            setPrevValues(row)
                                            viewModal.openModal()
                                        }}
                                    >
                                        View
                                    </button>

                                    <button
                                        className="text-green-600 hover:underline text-sm"
                                        onClick={() =>
                                            navigate(
                                                '/fee/voucher/edit',
                                                {
                                                    state: { prevValues: row },
                                                }
                                            )
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="text-red-600 hover:underline text-sm"
                                        onClick={async () => {
                                            const confirm =
                                                await AlertConfirm({
                                                    title: 'Confirm delete?',
                                                })
                                            if (confirm)
                                                handleDelete(
                                                    row.VOUCHER_ID
                                                )
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ),
                        },
                    ]

                    return (
                        <>
                            <Form className="flex flex-wrap gap-3">
                                <Select
                                    name="school_id"
                                    label="School"
                                    disabled={!canViewAllSchools}
                                    options={[
                                        ...(canViewAllSchools
                                            ? [
                                                  {
                                                      label: 'All Schools',
                                                      value: '',
                                                  },
                                              ]
                                            : []),
                                        ...schools.map((s: any) => ({
                                            label: s.SCHOOL_NAME,
                                            value: s.SCHOOL_ID,
                                        })),
                                    ]}
                                />

                                <Select
                                    name="standard_id"
                                    label="Standard"
                                    options={[
                                        { label: 'All', value: ALL_OPTION },
                                        ...standards.map((s: any) => ({
                                            label: s.STANDARD_NAME,
                                            value: s.STANDARD_ID,
                                        })),
                                    ]}
                                />

                                <Select
                                    name="fee_month"
                                    label="Fee Month"
                                    options={[
                                        { label: 'All', value: ALL_OPTION },
                                        ...Array.from(
                                            new Set(
                                                feeVouchers.map(
                                                    (v: any) => v.FEE_MONTH
                                                )
                                            )
                                        ).map((m) => ({
                                            label: m,
                                            value: m,
                                        })),
                                    ]}
                                />
                            </Form>

                            <DataTable
                                data={filteredFeeVouchers}
                                columns={columns}
                                itemsPerPage={10}
                            />

                            <Modal
                                isOpen={viewModal.isOpen}
                                onClose={viewModal.closeModal}
                                className="p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                            >
                                <h2>Fee Voucher Details</h2>
                                <DataTable
                                    data={prevValues?.details || []}
                                    itemsPerPage={10}
                                    columns={[
                                        {
                                            key: 'fee_list.TITLE',
                                            header: 'Title',
                                        },
                                        {
                                            key: 'fee_list.AMOUNT',
                                            header: 'Amount',
                                        },
                                    ]}
                                />
                            </Modal>
                        </>
                    )
                }}
            </Formik>
        </div>
    )
}

export default React.memo(FeeVoucher)
