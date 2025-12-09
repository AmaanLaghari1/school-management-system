import { ErrorMessage, Form, Formik } from "formik"
import Input from "../../components/form/input/InputField"
import * as Yup from 'yup'
import { FC, useEffect, useMemo, useState } from "react"
import Button from "../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import Select from "../../components/form/Select";
import Radio from "../../components/form/input/Radio";
import Label from "../../components/form/Label";
import DatePicker from "../../components/form/date-picker";
import { getSchool } from "../../api/SchoolRequest";
import { mapOptions } from "../../helpers/helper";
import { getGuardianRelation } from "../../api/StudentRequest";

interface FormProps {
    initialValues: { [key: string]: any };
    validationSchema: Yup.AnySchema;
    handleSubmit: (values: any) => void | Promise<void>;
    loading: boolean;
}

const StudentForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {

    const [schools, setSchools] = useState<any>([])
    const fetchSchools = async () => {
        try {
            const response = await getSchool()
            setSchools(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const [guardianRelations, setGuardianRelations] = useState<[]>([])
    const fetchGuardianRelations = async () => {
        try {
            const response = await getGuardianRelation()
            // console.log(response)
            setGuardianRelations(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSchools()
        fetchGuardianRelations()
    }, [])

    const schoolOptions = useMemo(() => {
        return mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
    }, [schools])

    const guardianRelationOptions = useMemo(() => {
        return mapOptions(guardianRelations, 'TITLE', 'RELATION_ID')
    }, [schools])

    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {
                    () => (
                        <Form>

                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Basic Information
                            </h6>


                            <div className="grid sm:grid-cols-2">
                                <div className="m-1">
                                    <Input
                                        name="name"
                                        type="text"
                                        placeholder="Enter student name"
                                        label="Name"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                                <div className="m-1">
                                    <Input
                                        name="surname"
                                        type="text"
                                        placeholder="Enter surname"
                                        label="Surname"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2">
                                <div className="m-1">
                                    <Input
                                        name="fname"
                                        type="text"
                                        placeholder="Enter father's name"
                                        label="Father's Name"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                                <div className="m-1">
                                    <Input
                                        name="mobile_no"
                                        type="text"
                                        placeholder="Enter mobile no."
                                        label="Mobile No."
                                        onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2">
                                <div className="m-1">
                                    <Input
                                        name="cnic_no"
                                        type="text"
                                        placeholder="Enter CNIC No."
                                        label="CNIC No."
                                        onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 13)}
                                        required
                                    />
                                </div>
                                <div className="m-1">
                                    <Input
                                        name="email"
                                        type="text"
                                        placeholder="Enter email address"
                                        label="Email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2">

                                <div className="m-2">
                                    <DatePicker
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        label="Date of Birth"
                                        placeholder="Pick a date"
                                    />
                                </div>
                                <div className="m-2">
                                    <Label className="font-medium">Gender<span className="text-error-500">*</span></Label>
                                    <div className="flex">
                                        <Radio className="mx-2" id="male" name="gender" value="1" label="Male" />
                                        <Radio className="mx-2" id="female" name="gender" value="2" label="Female" />
                                    </div>
                                    <div className="mt-1.5 text-xs text-error-500">
                                        <ErrorMessage name="gender" />
                                    </div>
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="postal_address"
                                        type="text"
                                        placeholder="Enter postal address"
                                        label="Postal Address"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="permanent_address"
                                        type="text"
                                        placeholder="Enter permanent address"
                                        label="Permanent Address"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Guardian Information
                            </h6>

                            <div className="grid sm:grid-cols-2 mb-2">
                                <div className="mb-1 mx-1">
                                    <Select
                                        label="Guardian Relation"
                                        name="guardian_relation_id"
                                        options={guardianRelationOptions}
                                        required={true}
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="guardian_name"
                                        type="text"
                                        placeholder="Enter guardian name"
                                        label="Name"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="guardian_email"
                                        type="text"
                                        placeholder="Enter guardian email address"
                                        label="Email"
                                        required
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="guardian_cnic_no"
                                        type="text"
                                        placeholder="Enter guardian cnic no."
                                        label="CNIC No."
                                        onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 13)}
                                        required
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="guardian_mobile_no"
                                        type="text"
                                        placeholder="Enter guardian mobile no."
                                        label="Mobile No."
                                        onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11)}
                                        required
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="guardian_address"
                                        type="text"
                                        placeholder="Enter guardian address"
                                        label="Address"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.toUpperCase();
                                        }}
                                        required
                                    />
                                </div>
                            </div>

                            <h6 className="mb-2 text-gray-800 dark:text-white/90">
                                Academic Information
                            </h6>

                            <div className="grid sm:grid-cols-2">
                                <div className="mb-1 mx-1">
                                    <Select
                                        label="School"
                                        name="school_id"
                                        options={schoolOptions}
                                        required={true}
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="tuition_fee"
                                        type="text"
                                        placeholder="Enter tuition fee"
                                        label="Tution Fee"
                                        onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11)}
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="previous_gr_no"
                                        type="text"
                                        placeholder="Enter previous GR No."
                                        label="Previous Gr No."
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="current_gr_no"
                                        type="text"
                                        placeholder="Enter current GR No."
                                        label="Current GR No."
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Select
                                        label="Is Free?"
                                        name="is_free"
                                        options={[
                                            {
                                                label: "Yes",
                                                value: '1'
                                            },
                                            {
                                                label: "No",
                                                value: '2'
                                            },
                                        ]}
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Select
                                        label="Is Active?"
                                        name="active"
                                        options={[
                                            {
                                                label: "Yes",
                                                value: '1'
                                            },
                                            {
                                                label: "No",
                                                value: '2'
                                            },
                                        ]}
                                    />
                                </div>
                                <div className="mb-1 mx-1">
                                    <Input
                                        name="remarks"
                                        type="text"
                                        placeholder="Enter remarks (if any)"
                                        label="Remarks"
                                        onInput={(e: any) => {
                                            e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
                                        }}
                                    />
                                </div>
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
                    )
                }
            </Formik>
        </div>
    )
}

export default StudentForm