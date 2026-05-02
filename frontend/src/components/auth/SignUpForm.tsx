import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
// import Checkbox from "../form/input/Checkbox";
import { Form, Formik } from "formik";
import * as Yup from 'yup'
import { useDispatch } from "react-redux";
import { register } from "../../redux/actions/AuthAction";
import Alert from "../custom/Alert";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch<any>()

  const handleSubmit = async (values: {}) => {
    setLoading(true)
    try {
      const response = await dispatch(register(values))
      console.log(response)
    } catch (error: any) {
      console.log(error)
      Alert({status: false, text: error.response.data?.error_message})
    }
    setLoading(false)
  }
  return (
    <div className="flex flex-wrap flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      {/* <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link
          to="/"
          className="inline-flex flex-wrap items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-wrap flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            {/* <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p> */}
          </div>
          <div>
            <Formik
            initialValues={{
              name: '',
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string().required('Required!'),
              email: Yup.string().email('Invalid email!').required('Required!'),
              password: Yup.string().min(8, 'Password too short!').required('Required!'),
            })}
            onSubmit={handleSubmit}
            >
              {
              () => (
                <Form>
                    <div className="space-y-5">
                        {/* <!-- First Name --> */}
                        <div className="">
                          <Label>
                            Name<span className="text-error-500">*</span>
                          </Label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                          />
                        </div>
                      {/* <!-- Email --> */}
                      <div>
                        <Label>
                          Email<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                        />
                      </div>
                      {/* <!-- Password --> */}
                      <div>
                        <Label>
                          Password<span className="text-error-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            name="password"
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                          />
                          <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                          >
                            {showPassword ? (
                              <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            ) : (
                              <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                            )}
                          </span>
                        </div>
                      </div>
                      {/* <!-- Button --> */}
                      <div>
                        <button type="submit" className="flex flex-wrap items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                        disabled={loading}
                        >
                          {
                            loading ? 'Signing Up...' : 'Sign Up'
                          }
                        </button>
                      </div>
                    </div>
                </Form>
              )
              }
            </Formik>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
