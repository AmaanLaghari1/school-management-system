import React from 'react'
import Navbar from '../../components/custom/Navbar'
import { Form, Formik } from 'formik'
import Input from '../../components/form/input/InputField'
import Button from '../../components/ui/button/Button'
import * as Yup from 'yup'
import DataTable from '../../components/custom/DataTable'
import SubHeading from '../../components/custom/SubHeading'
import { Link, useNavigate } from 'react-router'
import { downloadRegistrationPdf, getRegistrations } from '../../api/RegistrationRequest'

const STORAGE_KEY = 'registration_filters'

const Registration = () => {

    const navigate = useNavigate()

    const cachedFilters = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '{}'
    )

    const [registrations, setRegistrations] = React.useState<any>([])

    const initialValues = {
        cnic_no: cachedFilters?.cnic_no || '',
        mobile_no: cachedFilters?.mobile_no || ''
    }

    const fetchRegistrations = async (formdata: any) => {
        try {

            // Cache filters
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(formdata)
            )

            const response = await getRegistrations(formdata)

            setRegistrations(response.data)

        } catch (error: any) {
            console.error('Error fetching registrations:', error)
        }
    }

    const downloadPdf = async (regId: string | number) => {
        const response = await downloadRegistrationPdf(regId)
        const file = new Blob([response.data], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        const link = document.createElement('a')

        link.href = fileURL
        link.download = `registration-form-${regId}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(fileURL)
    }

    /*
    |--------------------------------------------------------------------------
    | Auto Load Cached Data
    |--------------------------------------------------------------------------
    */

    React.useEffect(() => {

        if (
            cachedFilters?.cnic_no &&
            cachedFilters?.mobile_no
        ) {
            fetchRegistrations(cachedFilters)
        }

    }, [])

    return (
        <>
            <Navbar />

            <div className="flex flex-col items-center justify-center">

                <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mt-5">
                    School Management System
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    Welcome to the School Management System. Please sign in to continue.
                </p>

                <div className="w-full max-w-lg mt-2 p-2 bg-white rounded-lg shadow-md dark:bg-gray-800">

                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={Yup.object().shape({
                            cnic_no: Yup.string()
                                .matches(/^[0-9]{13}$/, 'Invalid CNIC format')
                                .required('CNIC is required'),

                            mobile_no: Yup.string()
                                .matches(/^[0-9]{11}$/, 'Invalid mobile number format')
                                .required('Mobile number is required')
                        })}
                        onSubmit={async (values) => {
                            await fetchRegistrations(values)
                        }}
                    >

                        {({ values, handleChange, handleSubmit }) => (

                            <Form>

                                <div className="grid grid-cols-2 gap-2 mb-2">

                                    <Input
                                        label="CNIC"
                                        name="cnic_no"
                                        value={values.cnic_no}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        label="Mobile Number"
                                        name="mobile_no"
                                        value={values.mobile_no}
                                        onChange={handleChange}
                                    />

                                </div>

                                <Button
                                    type="submit"
                                    onClick={() => handleSubmit()}
                                    className="w-full mt-2"
                                >
                                    Search
                                </Button>

                            </Form>
                        )}

                    </Formik>

                </div>

                <div className="w-full max-w-4xl mt-5 p-2 bg-white rounded-lg shadow-md dark:bg-gray-800">

                    <div className="flex">

                        <SubHeading>
                            Registrations
                        </SubHeading>

                        <Link to="/register" className='ml-auto'>

                            <Button className="ml-auto" size='sm'>
                                Add New
                            </Button>

                        </Link>

                    </div>

                    <DataTable
                        data={registrations}
                        columns={[
                            {
                                key: 'NAME',
                                header: 'Student Name',
                                sortable: true
                            },
                            {
                                key: 'school.SCHOOL_NAME',
                                header: 'School Name',
                                sortable: true
                            },
                            {
                                key: 'standard.STANDARD_NAME',
                                header: 'Class',
                                sortable: true
                            },
                            {
                                key: 'ACTIONS',
                                header: 'Action',
                                render: (row: any) => {
                                    return (
                                        <div className="flex gap-3">
                                            <button
                                                className="text-blue-600 hover:underline text-sm"
                                                onClick={() => {
                                                    navigate('/registration/edit', {
                                                        state: {
                                                            prevValues: row
                                                        }
                                                    })
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="text-green-700 hover:underline text-sm"
                                                onClick={() => downloadPdf(row.REG_ID)}
                                            >
                                                PDF
                                            </button>
                                        </div>
                                    )
                                }
                            }
                        ]}
                        itemsPerPage={10}
                    />

                </div>

            </div>
        </>
    )
}

export default React.memo(Registration)
