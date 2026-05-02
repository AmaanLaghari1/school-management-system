import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import React, { FC, useEffect, useMemo, useState } from "react";
import DatePicker from "../../../components/form/date-picker";
import * as API from '../../../api/FeeVoucher'
import { useSelector } from "react-redux";
import Select from "../../../components/form/Select";
import { getStudent, getStudentBySchoolId } from "../../../api/StudentRequest";
import { isAllSchoolsUser } from "../../../helpers/helper";

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

const FeeLedgerForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {

    const [vouchers, setVouchers] = useState<any[]>([])
    const [students, setStudents] = useState<[]>([])

    const auth = useSelector((state: any) => state.auth.authData)
    const canViewAllSchools = isAllSchoolsUser(auth.user)
    // console.log(auth.user.SCHOOL_ID)

    const fetchVouchers = async () => {
        // Implement API call to fetch vouchers
        try {
            const response = canViewAllSchools
                ? await API.getFeeVoucher()
                : await API.getFeeVoucherBySchoolId(auth.user.SCHOOL_ID)
            // console.log(response.data)
            setVouchers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchStudents = async () => {
        // Implement API call to fetch students
        try {
            const response = canViewAllSchools
                ? await getStudent()
                : await getStudentBySchoolId(auth.user.SCHOOL_ID)
            // console.log(response.data)
            setStudents(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const voucherOptions = useMemo(() => {
        return vouchers.map(item => ({
            value: item['VOUCHER_ID'],
            label: item['TOTAL_AMOUNT'],
            // label: item['enrolment']['student']['NAME'],
        }))
    }, [vouchers])
    
    const studentOptions = useMemo(() => {
        return students.map(item => ({
            value: item['STUDENT_ID'],
            label: item['NAME']
        }))
    }, [students])

    // console.log(studentOptions)

    useEffect(() => {
        fetchVouchers()
        fetchStudents()
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

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">
                            <Select
                                label="Voucher"
                                name="voucher_id"
                                options={voucherOptions}
                                onChange={(e) => {
                                    setFieldValue('voucher_id', e)
                                }}
                                // required={true}
                                // disabled={values.voucher_id ? true : false}
                            />
                            <Select
                                label="Student"
                                name="student_id"
                                options={studentOptions}
                                onChange={(e) => {
                                    setFieldValue('student_id', e)
                                }}
                                required={true}
                            />
                            <Input
                                name="detail"
                                type="text"
                                placeholder="Enter detail"
                                label="Detail"
                                required={true}
                            />
                            <DatePicker
                                id="date"
                                name="date"
                                label="Date"
                                placeholder="Pick a date"
                                required={true}
                            />
                            <Input
                                name="voucher_amount"
                                type="text"
                                placeholder="Enter voucher amount"
                                label="Voucher Amount"
                                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
                                }
                                required={true}
                            />
                            <Input
                                name="paid_amount"
                                type="text"
                                placeholder="Enter paid amount"
                                label="Paid Amount"
                                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                                    (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value.replace(/\D/g, '')
                                }
                                required={true}
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

export default React.memo(FeeLedgerForm);
