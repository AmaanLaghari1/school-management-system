import { Form, Formik, FormikHelpers } from "formik";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { BoxIcon } from "lucide-react";
import * as Yup from "yup";
import React, { FC, useEffect, useMemo, useState } from "react";
import Select from "../../../components/form/Select";
import { getFeeCategory } from "../../../api/FeeCategory";
import { mapOptions } from "../../../helpers/helper";
import { getSession } from "../../../api/SessionRequest";
import { getStandardBySchoolId } from "../../../api/StandardRequest";
import { useSelector } from "react-redux";

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

const FeeListForm: FC<FormProps> = ({
    initialValues,
    validationSchema,
    handleSubmit,
    loading,
}) => {

    const [categories, setCategories] = useState<[]>([])
    const [sessions, setSessions] = useState<[]>([])
    const [standards, setStandards] = useState<[]>([])
    const user = useSelector((state:any) => state.auth?.authData.user)

    const fetchCategory = async () => {
        try {
            const response = await getFeeCategory()
            setCategories(response.data || [])
        } catch (error) {
            console.error("Error fetching fee categories:", error)
        }
    }

    const fetchSessions = async () => {
        try {
            const response = await getSession()
            setSessions(response.data || [])
        } catch (error) {
            console.error("Error fetching sessions:", error)
        }
    }

    const categoryOptions = useMemo(() => {
        return mapOptions(categories, 'CAT_TITLE', 'FEE_CAT_ID') || []
    }, [categories])

    const sessionOptions = useMemo(() => {
        return mapOptions(sessions, 'SESSION_NAME', 'SESSION_ID') || []
    }, [sessions])

    const fetchStandards = async () => {
        try {
            const response = await getStandardBySchoolId(user.SCHOOL_ID)
            // console.log(response)
            setStandards(response.data || [])
        }
        catch (error) {
            console.error("Error fetching standards:", error)
        }
    }

    const standardOptions = useMemo(() => {
        return mapOptions(standards, 'STANDARD_NAME', 'STANDARD_ID') || []
    }, [standards])

    useEffect(() => {
        fetchCategory()
        fetchSessions()
        fetchStandards()
    }, [])
    return (
        <div>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => handleSubmit(values, helpers)}
                enableReinitialize={true}
            >
                {({values, setFieldValue}) => {

                    return <Form>
                        <div className="grid sm:grid-cols-2 gap-2">
                            <Select
                                label="Session"
                                name="session_id"
                                options={sessionOptions}
                                onChange={(e) => {
                                    setFieldValue('session_id', e)
                                }}
                                required={true}
                                disabled={values.session_id ? true : false}
                            />
                            <Select
                                label="Standard"
                                name="standard_id"
                                options={standardOptions}
                                onChange={(e) => {
                                    setFieldValue('standard_id', e)
                                }}
                                required={true}
                                disabled={values.standard_id ? true : false}
                            />
                            <Select
                                label="Fee Category"
                                name="fee_cat_id"
                                options={categoryOptions}
                                onChange={(e) => {
                                    setFieldValue('fee_cat_id', e)
                                }}
                                required={true}
                                disabled={values.fee_cat_id ? true : false}
                            />
                            <Input
                                name="title"
                                type="text"
                                placeholder="Enter fee list title"
                                label="Title"
                                required={true}
                            />
                            <Input
                                name="amount"
                                type="text"
                                placeholder="Enter fee amount"
                                label="Amount"
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

export default React.memo(FeeListForm);
