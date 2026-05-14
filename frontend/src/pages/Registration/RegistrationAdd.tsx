import React from 'react'
import Navbar from '../../components/custom/Navbar'
import SubHeading from '../../components/custom/SubHeading'
import RegisterationForm from './RegisterationForm'
import { useState } from "react"
import * as Yup from 'yup'
import Alert from "../../components/custom/Alert"
import { FormikHelpers } from "formik"
import { registerStudent } from '../../api/RegistrationRequest'

const RegistrationAdd = () => {
    const [loading, setLoading] = useState(false)

    const initialValues = {
        // Admission Information
        school_id: '',
        session_id: '',
        standard_id: '',
        last_school: '',

        // Student Information
        name: '',
        surname: '',
        fname: '',
        mobile_no: '',
        email: '',
        gender: '',
        date_of_birth: '',
        permanent_address: '',

        // Parent Information
        father_cnic_no: '',
        father_occupation: '',
        is_uni_employee: '',
        employee_designation: '',
        employee_dept: '',

        // Guardian Information
        guardian_relation_id: '',
        guardian_name: '',
        guardian_cnic_no: '',
        guardian_mobile_no: '',
        guardian_email: '',
        guardian_address: '',

        // Sibling Temporary Fields
        sibling_name: '',
        class_and_section: '',
        gr_no: '',

        // Siblings Array
        siblings_enrolled: [],

        student_photo: null,
    };
    
    const validationSchema = Yup.object().shape({
        school_id: Yup.string().required('School is required!'),

        session_id: Yup.string().required('Session is required!'),

        standard_id: Yup.string().required('Class is required!'),

        last_school: Yup.string().nullable(),
        name: Yup.string()
            .required('Student name is required!'),

        surname: Yup.string()
            .required('Surname is required!'),

        fname: Yup.string()
            .required("Father's name is required!"),

        mobile_no: Yup.string()
            .matches(/^[0-9]{11}$/, 'Mobile number must be 11 digits!')
            .required('Mobile number is required!'),

        email: Yup.string()
            .email('Invalid email address!')
            .nullable(),

        gender: Yup.string()
            .required('Gender is required!'),

        date_of_birth: Yup.string()
            .required('Date of birth is required!'),

        permanent_address: Yup.string()
            .required('Home address is required!'),
        father_cnic_no: Yup.string()
            .matches(/^[0-9]{13}$/, 'CNIC must be 13 digits!')
            .required('Father CNIC is required!'),

        father_occupation: Yup.string()
            .required('Occupation is required!'),

        is_uni_employee: Yup.string()
            .nullable(),

        employee_designation: Yup.string().when(
            'is_uni_employee',
            {
                is: '1',
                then: (schema) =>
                    schema.required('Designation is required!'),
                otherwise: (schema) => schema.nullable(),
            }
        ),

        employee_dept: Yup.string().when(
            'is_uni_employee',
            {
                is: '1',
                then: (schema) =>
                    schema.required('Department is required!'),
                otherwise: (schema) => schema.nullable(),
            }
        ),
        guardian_relation_id: Yup.string()
            .required('Guardian relation is required!'),

        guardian_name: Yup.string()
            .required('Guardian name is required!'),

        guardian_cnic_no: Yup.string()
            .matches(/^[0-9]{13}$/, 'CNIC must be 13 digits!')
            .required('Guardian CNIC is required!'),

        guardian_mobile_no: Yup.string()
            .matches(/^[0-9]{11}$/, 'Mobile number must be 11 digits!')
            .required('Guardian mobile number is required!'),

        guardian_email: Yup.string()
            .email('Invalid email address!')
            .nullable(),
        guardian_address: Yup.string()
            .required('Guardian address is required!'),
        siblings_enrolled: Yup.array().of(
            Yup.object().shape({
                sibling_name: Yup.string().required(),
                class_and_section: Yup.string().required(),
                gr_no: Yup.string().required(),
            })
        ),
        student_photo: Yup.mixed()
             .test('fileSize', 'File size is too large! Max size is 2MB.', (value: any) => {
                if (!value) return true; // No file selected, so pass validation
                return value.size <= 2 * 1024 * 1024; // 2MB in bytes
            }).required('Student photo is required!'),
    });

    const handleSubmit = async (values: any, { resetForm }: FormikHelpers<any>) => {
        setLoading(true)
        try {
            const response = await registerStudent(values)
            Alert({ status: true, text: response.data?.message || 'Student registered successfully...' })
            resetForm();
        } catch (error: any) {
            console.log(error)
            Alert({ status: false, text: error.response.data?.error_message || 'Some error occured!' })
        }
        setLoading(false)
    }

    return (
        <div>
            <Navbar />
            <div className="w-full max-w-4xl mt-5 p-2 bg-white rounded-lg shadow-md dark:bg-gray-800 mx-auto">
                <SubHeading>
                    Kindly fill the form to register a student for the new session. Make sure to provide accurate information to ensure a smooth registration process.
                </SubHeading>

                <RegisterationForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    handleSubmit={handleSubmit}
                    loading={loading}
                />
            </div>
        </div>
    )
}

export default React.memo(RegistrationAdd)
