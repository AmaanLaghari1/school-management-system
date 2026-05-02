import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import React, { FC, useEffect, useMemo, useState } from "react";
import DatePicker from "../../../components/form/date-picker";
import { getEnrolmentBySchoolId } from "../../../api/EnrolmentRequest";
import { useSelector } from "react-redux";
import Select from "../../../components/form/Select";
import { getSession, getSessionBySchoolId } from "../../../api/SessionRequest";
import { getStandard, getStandardBySchoolId } from "../../../api/StandardRequest";
import { getFeeCategory } from "../../../api/FeeCategory";
import { isAllSchoolsUser, mapOptions } from "../../../helpers/helper";
import { getFilteredFeelist } from "../../../api/FeeList";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/ui/table";

// Define props interface
interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (
        values: any,
        helpers: FormikHelpers<any>
    ) => void | Promise<void>;
    loading: boolean;
    disableFields?: { [key: string]: boolean };
}

const FeeVoucherForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {

    const [enrolments, setEnrolments] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])
    const [feeCategories, setFeeCategories] = useState<[]>([])
    const [feeList, setFeeList] = useState<[]>([])
    const user = useSelector((state: { auth: { authData: { user: any } } }) => state.auth.authData.user)
    const canViewAllSchools = isAllSchoolsUser(user)

    const fetchEnrolments = async (standardId: any) => {
        try {
            const response = await getEnrolmentBySchoolId(standardId)
            // console.log(response)
            setEnrolments(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFeeCategories = async () => {
        try {
            const response = await getFeeCategory()
            // console.log(response)
            setFeeCategories(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFeeList = async (values: {}) => {
        try {
            const response = await getFilteredFeelist(values)
            // console.log(response.data)
            setFeeList(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const enrolOptions = useMemo(() => {
        return enrolments.map(item => ({ label: item['student']['NAME'], value: item['ENROLMENT_ID'] }))
    }, [enrolments])

    const feeCatOptions = useMemo(() => {
        return mapOptions(feeCategories, 'CAT_TITLE', 'FEE_CAT_ID')
    }, [feeCategories])

    const fetchSessions = async () => {
        try {
            const response = canViewAllSchools
                ? await getSession()
                : await getSessionBySchoolId(user.SCHOOL_ID)
            // console.log(response)
            setSessions(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStandards = async () => {
        try {
            const response = canViewAllSchools
                ? await getStandard()
                : await getStandardBySchoolId(user.SCHOOL_ID)
            // console.log(response)
            setStandards(response.data || [])
        } catch (error) {
            console.log(error)
        }
    }

    const standardOptions = useMemo(() => {
        return standards.map(item => ({ label: item['STANDARD_NAME'] + " (" + item['SECTION'] + ")", value: item['STANDARD_ID'] }))
    }, [standards])

    const handleStandardChange = (e: any, setFieldValue: any) => {
        setFieldValue('standard_id', e)
        fetchEnrolments(e)
    }

    const handleCategoryChange = (e: any, setFieldValue: any, values: any) => {
        setFieldValue('fee_cat_id', e)
        const formData = new FormData()
        formData.append('session_id', values.session_id)
        formData.append('standard_id', values.standard_id)
        formData.append('fee_cat_id', e)

        fetchFeeList(formData)
    }

    useEffect(() => {
        // fetchEnrolments()
        fetchSessions()
        fetchStandards()
        fetchFeeCategories()
    }, [])

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
                enableReinitialize={true}
            >
                {({ setFieldValue, values }) => {

                    useEffect(() => {
                        if (values.standard_id) {
                            fetchEnrolments(values.standard_id);
                        }
                    }, [values.standard_id]);

                    useEffect(() => {
                        const total = feeList
                            .filter((item: any) => values.selected_fees.includes(item.FEE_ID))
                            .reduce((sum: number, item: any) => {
                                return sum + Number(item.AMOUNT || 0);
                            }, 0);

                        setFieldValue("total_amount", total);
                    }, [values.selected_fees, feeList]);

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">
                            <Select
                                label="Session"
                                name="session_id"
                                options={sessions.map(item => ({ label: item['SESSION_NAME'], value: item['SESSION_ID'] }))}
                                required={true}
                            />
                            <Select
                                label="Standard"
                                name="standard_id"
                                options={standardOptions}
                                onChange={(e: any) => handleStandardChange(e, setFieldValue)}
                                required={true}
                            />
                            <Select
                                label="Student"
                                name="enrolment_id"
                                options={enrolOptions}
                                required={true}
                            />
                            <Input
                                name="fee_month"
                                type="month"
                                label="Fee Month"
                                required={true}
                            />
                            <Select
                                label="Fee Category"
                                name="fee_cat_id"
                                options={feeCatOptions}
                                onChange={(e: any) => handleCategoryChange(e, setFieldValue, values)}
                                required={true}
                            />
                            <DatePicker
                                id="date"
                                name="date"
                                label="Issue Date"
                                placeholder="Pick a date"
                                required={true}
                            />
                            {
                                feeList.length > 0 && (
                                    <div className="mt-4 border rounded-xl overflow-hidden col-span-1 sm:col-span-2">
                                        <Table className="w-full text-sm">

                                            <TableHeader className="bg-gray-100">
                                                <TableRow>
                                                    <TableCell className="w-12 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                feeList.length > 0 &&
                                                                feeList.every((item: any) =>
                                                                    values.selected_fees.includes(item.FEE_ID)
                                                                )
                                                            }
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    const allIds = feeList.map((item: any) => item.FEE_ID);
                                                                    setFieldValue("selected_fees", allIds);
                                                                } else {
                                                                    setFieldValue("selected_fees", []);
                                                                }
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        Fee Title
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        Fee Amount
                                                    </TableCell>
                                                    <TableCell className="font-semibold">
                                                        Remarks
                                                    </TableCell>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {feeList.map((item: any, index: number) => {
                                                    const isChecked = values.selected_fees.includes(item.FEE_ID);

                                                    return (
                                                        <TableRow
                                                            key={index}
                                                            className="hover:bg-gray-50 transition"
                                                        >
                                                            <TableCell className="text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked}
                                                                    className="cursor-pointer"
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setFieldValue("selected_fees", [
                                                                                ...values.selected_fees,
                                                                                item.FEE_ID
                                                                            ]);
                                                                        } else {
                                                                            setFieldValue(
                                                                                "selected_fees",
                                                                                values.selected_fees.filter(
                                                                                    (id: any) => id !== item.FEE_ID
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            </TableCell>

                                                            <TableCell className="font-medium">
                                                                {item.TITLE}
                                                            </TableCell>

                                                            <TableCell className="font-semibold">
                                                                {Number(item.AMOUNT).toLocaleString()}
                                                            </TableCell>

                                                            <TableCell className="text-gray-500">
                                                                <Input
                                                                    type="text"
                                                                    name={`fee_remarks.${item.FEE_ID}`}
                                                                    value={values.fee_remarks?.[item.FEE_ID] || ""}
                                                                    className="h-8 text-xs px-2 py-1 mt-2"
                                                                    onChange={(e: any) => {
                                                                        setFieldValue("fee_remarks", {
                                                                            ...values.fee_remarks,
                                                                            [item.FEE_ID]: e.target.value
                                                                        });
                                                                    }}
                                                                    // disabled={!values.selected_fees.includes(item.FEE_ID)}
                                                                    placeholder="Remarks"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )
                            }
                            <Input
                                name="total_amount"
                                type="text"
                                placeholder="Enter total amount"
                                label="Total Amount"
                                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
                                }
                                required={true}
                                disabled={true}
                            />
                            <Input
                                name="remarks"
                                type="text"
                                placeholder="Enter remarks"
                                label="Remarks"
                            />
                        </div>

                        <Button
                            size="sm"
                            variant="success"
                            className="mt-5"
                            endIcon={<BoxIcon className="size-5" />}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </Form>
                }
                }
            </Formik>
        </div>
    );
};

export default React.memo(FeeVoucherForm);
