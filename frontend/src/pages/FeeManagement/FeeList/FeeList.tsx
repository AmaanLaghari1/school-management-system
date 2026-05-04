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
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import useDebounce from "../../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { getSession, getSessionBySchoolId } from "../../../api/SessionRequest";
import { useSelector } from "react-redux";
import { getStandard, getStandardBySchoolId } from "../../../api/StandardRequest";
import { getFeeCategory } from "../../../api/FeeCategory";
import { Formik, Form } from "formik";
import Select from "../../../components/form/Select";
import { Modal } from "../../../components/ui/modal";
import { isAllSchoolsUser } from "../../../helpers/helper";

interface FeeListItem {
    FEE_ID: string;
    FEE_CAT_ID: string;
    SESSION_ID: string;
    STANDARD_ID: string;
    TITLE: string;
    AMOUNT: string;
    REMARKS: string;
    ACTIVE: number;
}

const FeeList = () => {
    const [prevValues, setPrevValues] = useState<any>({})
    const addModal = useModal(false);
    const editModal = useModal(false);

    const user = useSelector((state: any) => state.auth.authData.user)
    const canViewAllSchools = isAllSchoolsUser(user)

    // ✅ Fetch dropdown data
    const { data: sessions = [] } = useQuery({
        queryKey: ["sessions"],
        queryFn: () => canViewAllSchools ? getSession() : getSessionBySchoolId(user.SCHOOL_ID),
        select: (res) => res.data || [],
    });

    const { data: standards = [] } = useQuery({
        queryKey: ["standards"],
        queryFn: () => canViewAllSchools ? getStandard() : getStandardBySchoolId(user.SCHOOL_ID),
        select: (res) => res.data || [],
    });

    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getFeeCategory(),
        select: (res) => res.data || [],
    });

    const toggleActive = async (row: FeeListItem) => {
        try {
            await API.updateFeeList({
                fee_id: row.FEE_ID,
                session_id: row.SESSION_ID,
                standard_id: row.STANDARD_ID,
                fee_cat_id: row.FEE_CAT_ID,
                title: row.TITLE,
                amount: row.AMOUNT,
                remarks: row.REMARKS,
                active: row.ACTIVE === 1 ? 0 : 1
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const formData = new FormData()
            formData.append('fee_id', id)

            await API.deleteFeeList(formData)

            Alert({ status: true, text: 'Deleted successfully' })
        } catch (error) {
            Alert({ status: false, text: 'Delete failed' })
        }
    }

    const columns: Column<FeeListItem>[] = [
        { key: 'session.SESSION_NAME', header: 'Session' },
        { key: 'standard.STANDARD_NAME', header: 'Standard' },
        { key: 'fee_category.CAT_TITLE', header: 'Category' },
        { key: 'TITLE', header: 'Title' },
        { key: 'AMOUNT', header: 'Amount' },
        {
            key: 'ACTIVE',
            header: 'Active',
            render: (row) => (
                <Switch
                    label=""
                    defaultChecked={row.ACTIVE === 1}
                    onChange={() => toggleActive(row)}
                />
            )
        },
        {
            key: 'REMARKS',
            header: 'Remarks',
            render: (row) => row.REMARKS || '-'
        },
        {
            key: 'ACTIONS',
            header: 'Actions',
            render: (row) => (
                <div className="flex flex-wrap space-x-2">
                    <button
                        className="text-blue-600"
                        onClick={() => {
                            setPrevValues(row)
                            editModal.openModal()
                        }}
                    >
                        Edit
                    </button>

                    <button
                        className="text-red-600"
                        onClick={async () => {
                            const confirm = await AlertConfirm({
                                title: 'Are you sure?',
                                text: 'Delete this record?'
                            })

                            if (confirm) handleDelete(row.FEE_ID)
                        }}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-between">
                <PageBreadcrumb pageTitle="Fee List" />
                <Button onClick={addModal.openModal}>Add New +</Button>
            </div>

            <Formik
                initialValues={{
                    session_id: '',
                    standard_id: '',
                    fee_cat_id: ''
                }}
                onSubmit={() => { }}
            >
                {({ values, setFieldValue }) => {

                    const debouncedFilters = useDebounce(values, 500)

                    // ✅ Set default values when data arrives
                    useEffect(() => {
                        if (sessions.length && !values.session_id) {
                            setFieldValue("session_id", sessions[0].SESSION_ID)
                        }
                    }, [sessions])

                    useEffect(() => {
                        if (standards.length && !values.standard_id) {
                            setFieldValue("standard_id", standards[0].STANDARD_ID)
                        }
                    }, [standards])

                    useEffect(() => {
                        if (categories.length && !values.fee_cat_id) {
                            setFieldValue("fee_cat_id", categories[0].FEE_CAT_ID)
                        }
                    }, [categories])

                    const { data: feelist = [], isFetching, refetch } = useQuery({
                        queryKey: ["feeList", debouncedFilters],
                        queryFn: () => API.getFilteredFeelist(debouncedFilters),
                        enabled:
                            !!debouncedFilters.session_id &&
                            !!debouncedFilters.standard_id &&
                            !!debouncedFilters.fee_cat_id,
                        select: (res) => res.data || [],
                    });

                    return (
                        <>
                            <Form>
                                <div className="flex flex-wrap gap-3">

                                    <Select
                                        name="session_id"
                                        label="Session"
                                        options={sessions.map((s: any) => ({
                                            label: s.SESSION_NAME,
                                            value: s.SESSION_ID,
                                        }))}
                                    />

                                    <Select
                                        name="standard_id"
                                        label="Standard"
                                        options={standards.map((s: any) => ({
                                            label: s.STANDARD_NAME,
                                            value: s.STANDARD_ID,
                                        }))}
                                    />

                                    <Select
                                        name="fee_cat_id"
                                        label="Category"
                                        options={categories.map((c: any) => ({
                                            label: c.CAT_TITLE,
                                            value: c.FEE_CAT_ID,
                                        }))}
                                    />
                                </div>
                            </Form>

                            <DataTable
                                data={feelist}
                                columns={columns}
                                itemsPerPage={10}
                                loading={isFetching}
                            />
                            
                            {/* Add Modal */}
                            {addModal.isOpen && (
                                <Modal isOpen={addModal.isOpen} onClose={addModal.closeModal} showCloseButton={true} 
                                className="p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <FeeListAdd fetchData={refetch} closeModal={addModal.closeModal} />
                                </Modal>
                            )}

                            {/* Edit Modal */}
                            {editModal.isOpen && (
                                <Modal isOpen={editModal.isOpen} onClose={editModal.closeModal} showCloseButton={true} className="p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <FeeListEdit fetchData={refetch} prevValues={prevValues} closeModal={editModal.closeModal} />
                                </Modal>
                            )}
                        </>
                    )
                }}
            </Formik>

        </div>
    )
}

export default FeeList
