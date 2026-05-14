import React from 'react'
import Navbar from '../../components/custom/Navbar'
import SubHeading from '../../components/custom/SubHeading'
import RegisterationForm from './RegisterationForm'
import { useState } from "react"
import * as Yup from 'yup'
import Alert from "../../components/custom/Alert"
import { FormikHelpers } from "formik"
import { updateRegistration } from '../../api/RegistrationRequest'
import { useLocation, useNavigate } from 'react-router'
import { formatDate } from '../../helpers/helper'


const RegistrationEdit = () => {
    const [loading, setLoading] = useState(false)
    const location = useLocation()
    const { prevValues } = location.state || {}
    // console.log(prevValues)
    const navigate = useNavigate()

    const initialValues = {
        // Admission Information
        school_id: prevValues?.SCHOOL_ID || '',
        session_id: prevValues?.SESSION_ID || '',
        standard_id: prevValues?.STANDARD_ID || '',
        last_school: prevValues?.LAST_SCHOOL_ATTENDED || '',

        // Student Information
        name: prevValues?.NAME || '',
        surname: prevValues?.SURNAME || '',
        fname: prevValues?.FATHER_NAME || '',
        mobile_no: prevValues?.MOBILE_NO || '',
        email: prevValues?.EMAIL || '',
        gender: prevValues?.GENDER || '',
        date_of_birth: formatDate(prevValues?.DOB) || '',
        permanent_address: prevValues?.HOME_ADDRESS || '',

        // Parent Information
        father_cnic_no: prevValues?.FATHER_CNIC_NO || '',
        father_occupation: prevValues?.FATHER_OCCUPATION || '',
        is_uni_employee: prevValues?.IS_UNI_EMPLOYEE || '',
        employee_designation: prevValues?.DESIGNATION || '',
        employee_dept: prevValues?.DEPARTMENT || '',

        // Guardian Information
        guardian_relation_id: prevValues?.GUARDIAN_RELATION || '',
        guardian_name: prevValues?.GUARDIAN_NAME || '',
        guardian_cnic_no: prevValues?.GUARDIAN_CNIC_NO || '',
        guardian_mobile_no: prevValues?.GUARDIAN_MOBILE_NO || '',
        guardian_email: prevValues?.GUARDIAN_EMAIL || '',
        guardian_address: prevValues?.GUARDIAN_ADDRESS || '',
        student_photo: prevValues?.STUDENT_PHOTO || null,

        // Sibling Temporary Fields
        sibling_name: '',
        class_and_section: '',
        gr_no: '',

        // Siblings Array
        siblings_enrolled: prevValues?.siblings
            ? prevValues.siblings.map((sibling: any) => ({
                sibling_id: sibling?.id || '',
                sibling_name: sibling?.NAME || '',
                class_and_section: sibling?.CLASS_AND_SECTION || '',
                gr_no: sibling?.GR_NO || '',
            }))
            : [],
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
                // gr_no: Yup.string().required(),
            })
        ),
    });

    const handleSubmit = async (values: any, { resetForm }: FormikHelpers<any>) => {
        setLoading(true)
        try {
            const response = await updateRegistration(values, prevValues?.REG_ID)
            Alert({ status: true, text: response.data?.message || 'Student registered successfully...' })
            navigate('/')
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

export default React.memo(RegistrationEdit)
