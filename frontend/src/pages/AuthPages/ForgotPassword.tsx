import React from 'react'
import AuthLayout from './AuthPageLayout'
import SubHeading from '../../components/custom/SubHeading'
import Input from '../../components/form/input/InputField'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import Button from '../../components/ui/button/Button'
import { forgotPassword } from '../../api/AuthRequest'
import Alert from '../../components/custom/Alert'

const ForgotPassword = () => {
    const [loading, setLoading] = React.useState(false);

    return (
        <AuthLayout>
            <div className="flex flex-wrap flex-col flex-1">
                <div className="flex flex-wrap flex-col justify-center flex-1 w-full max-w-md mx-auto">
                    <SubHeading>
                        Forgot Password
                    </SubHeading>
                    <small className='dark:text-white'>
                        (Please enter your email address to receive a password reset link)
                    </small>

                    <Formik
                        initialValues={{
                            email: ''
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string().email('Invalid email!').required('Required!')
                        })}
                        onSubmit={
                            async (values, { setSubmitting }) => {
                                try {
                                    setLoading(true);
                                    const response = await forgotPassword(values);
                                    console.log(response)
                                    Alert({status: true, text: "Password reset link sent to your email!"});
                                } catch (err: any) {
                                    console.error(err);
                                    Alert({status: false, text: err?.data?.message || "Failed to send reset link. Please try again."})  
                                } finally {
                                    setSubmitting(false);
                                    setLoading(false);
                                }
                        }
                    }
                    >
                        {() => (
                            <Form>
                                <div>
                                    <Input
                                        label='Email'
                                        type='email'
                                        name='email'
                                    />
                                </div>
                                <Button disabled={loading} className='mt-5' type="submit">
                                    {loading ? 'Submitting...' : 'Submit'}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </AuthLayout>
    )
}

export default React.memo(ForgotPassword)