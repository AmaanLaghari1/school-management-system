import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import Input from "../../components/form/input/InputField";
import * as Yup from "yup";
import { FC, useEffect, useMemo, useState } from "react";
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
  handleSubmit: (
    values: any,
    helpers: FormikHelpers<any>
  ) => void | Promise<void>;
  loading: boolean;
}

const StudentForm: FC<FormProps> = ({
  initialValues,
  validationSchema,
  handleSubmit,
  loading,
}) => {
  const [schools, setSchools] = useState<any>([]);
  const [guardianRelations, setGuardianRelations] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolRes = await getSchool();
        const relationRes = await getGuardianRelation();
        setSchools(schoolRes.data);
        setGuardianRelations(relationRes.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const schoolOptions = useMemo(() => {
    return mapOptions(schools, "SCHOOL_NAME", "SCHOOL_ID");
  }, [schools]);

  const guardianRelationOptions = useMemo(() => {
    return mapOptions(guardianRelations, "TITLE", "RELATION_ID");
  }, [guardianRelations]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => handleSubmit(values, helpers)}
    >
      {() => (
        <Form className="space-y-6">
          {/* Basic Info */}
          <div>
            <h6 className="mb-2 text-gray-800 dark:text-white/90">
              Basic Information
            </h6>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="name" label="Name" placeholder="Enter student name" required
                onInput={(e: any) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase()}
              />
              <Input name="surname" label="Surname" placeholder="Enter surname" required
                onInput={(e: any) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase()}
              />

              <Input name="fname" label="Father's Name" placeholder="Enter father's name" required
                onInput={(e: any) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase()}
              />
              <Input name="mobile_no" label="Mobile No." placeholder="Enter mobile no." required
                onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11)}
              />

              <Input name="cnic_no" label="CNIC No." placeholder="Enter CNIC No." required
                onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 13)}
              />
              <Input name="email" label="Email" placeholder="Enter email address" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <DatePicker
                id="date_of_birth"
                name="date_of_birth"
                label="Date of Birth"
              />

              <div className="mt-4">
                <Label className="font-medium">
                  Gender<span className="text-error-500">*</span>
                </Label>
                <div className="flex gap-4 mt-2">
                  <Radio id="male" name="gender" value="1" label="Male" />
                  <Radio id="female" name="gender" value="2" label="Female" />
                </div>
                <div className="mt-1.5 text-xs text-error-500">
                  <ErrorMessage name="gender" />
                </div>
              </div>

              <Input name="postal_address" label="Postal Address" required
                onInput={(e: any) => e.target.value = e.target.value.toUpperCase()}
              />
              <Input name="permanent_address" label="Permanent Address" required
                onInput={(e: any) => e.target.value = e.target.value.toUpperCase()}
              />
            </div>
          </div>

          {/* Guardian Info */}
          <div>
            <h6 className="mb-2 text-gray-800 dark:text-white/90">
              Guardian Information
            </h6>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select name="guardian_relation_id" label="Guardian Relation" options={guardianRelationOptions} required />
              <Input name="guardian_name" label="Name" required
                onInput={(e: any) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase()}
              />

              <Input name="guardian_email" label="Email" />
              <Input name="guardian_cnic_no" label="CNIC No." required
                onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 13)}
              />

              <Input name="guardian_mobile_no" label="Mobile No." required
                onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11)}
              />
              <Input name="guardian_address" label="Address" required
                onInput={(e: any) => e.target.value = e.target.value.toUpperCase()}
              />
            </div>
          </div>

          {/* Academic Info */}
          <div>
            <h6 className="mb-2 text-gray-800 dark:text-white/90">
              Academic Information
            </h6>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input name="previous_school" label="Previous School" />
              <Select name="school_id" label="Current School" options={schoolOptions} required />

              <Input name="tuition_fee" label="Tuition Fee"
                onInput={(e: any) => e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11)}
              />
              <Input name="previous_gr_no" label="Previous GR No." />
              <Input name="current_gr_no" label="Current GR No." />

              <Select
                name="is_free"
                label="Is Free?"
                options={[
                  { label: "Yes", value: "1" },
                  { label: "No", value: "2" },
                ]}
              />

              <Select
                name="active"
                label="Is Active?"
                options={[
                  { label: "Yes", value: "1" },
                  { label: "No", value: "2" },
                ]}
              />

              <Input name="remarks" label="Remarks"
                onInput={(e: any) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase()}
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            size="sm"
            variant="success"
            className="mt-2"
            endIcon={<BoxIcon className="size-5" />}
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default StudentForm;