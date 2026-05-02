import { useEffect, useMemo, useState } from "react";
import { deleteSchool, getSchool } from "../../api/SchoolRequest";
import DataTable, { Column } from "../../components/custom/DataTable";
import Button from "../../components/ui/button/Button";
import { Link, useNavigate } from "react-router";
import Alert from "../../components/custom/Alert";
import { getStudent, getStudentBySchoolId } from "../../api/StudentRequest";
import { filterSchoolsForUser, isAllSchoolsUser, mapOptions } from "../../helpers/helper";
import { Formik, Form } from "formik";
import Select from "../../components/form/Select";
import AlertConfirm from "../../components/custom/AlertConfirm";
import { useUser } from "../../hooks/useUser";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

interface Student {
  STUDENT_ID: string;
  NAME: string;
  FNAME: string;
  SURNAME: string;
  EMAIL: string;
  CNIC_NO: string;
  'school[SCHOOL_NAME]': string;
  ACTIONS: string;
}

const Student = () => {
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([]);
  const [schools, setSchools] = useState<[]>([])
  const navigate = useNavigate()
  const { user } = useUser();
  const canViewAllSchools = isAllSchoolsUser(user);

  const fetchSchools = async () => {
    try {
      const response = await getSchool()
      setSchools(filterSchoolsForUser(response.data || [], user) as [])
    } catch (error: any) {
      console.log(error)
    }
  }

  const schoolOptions = useMemo(() => {
    const options = mapOptions(schools, 'SCHOOL_NAME', 'SCHOOL_ID')
    return canViewAllSchools ? [{ label: 'All Schools', value: '' }, ...options] : options
  }, [schools, canViewAllSchools])

  const fetchData = async (id: any) => {
    setLoading(true)
    try {
      const response = canViewAllSchools && !id
        ? await getStudent()
        : await getStudentBySchoolId(id);
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
    setLoading(false)
  };

  const handleDelete = async (id: any) => {
    try {
      const response = await deleteSchool(id)
      // console.log(response)
      setStudents(students.filter(item => item.STUDENT_ID != id))
      Alert({ status: true, text: "School deleted successfully..." })
    } catch (error) {
      Alert({ status: false, text: "Unable to delete the school!" })
      console.log(error)
    }
  }

  useEffect(() => {
    fetchSchools();
    fetchData(canViewAllSchools ? '' : user?.SCHOOL_ID);
  }, [user?.SCHOOL_ID]);

  const columns: Column<Student>[] = [
    // { key: "STUDENT_ID", header: "ID", sortable: true },
    { key: "NAME", header: "Name", sortable: true },
    { key: "FNAME", header: "Father's Name", sortable: true },
    { key: "SURNAME", header: "Surname", sortable: true },
    { key: "CNIC_NO", header: "CNIC No.", sortable: true },
    { key: "EMAIL", header: "Email", sortable: true },
    { key: "school[SCHOOL_NAME]", header: "School Name", sortable: true },
    { key: "guardian[TITLE]", header: "Guardian Relation", sortable: true },
    {
      key: "ACTIONS",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap space-x-2">
          <button className="text-blue-600 hover:underline text-sm"
            onClick={() => {
              navigate('/student/edit', {
                state: {
                  prevValues: row
                }
              })
            }}
          >Edit</button>
          {/* Optional: Add delete or other actions here */}
          <button onClick={
            async () => {
              const confirm = await AlertConfirm({
                title: 'Are you sure?',
                text: 'Do you really want to delete this student? This process cannot be undone.',
              })
              if (confirm) {
                handleDelete(row.STUDENT_ID)
              }
            }
          } className="text-red-600 hover:underline text-sm">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap justify-between items-center">
        <PageBreadcrumb pageTitle="Students" />
        <Link to="/student/add">
          <Button size="sm" variant="primary">
            Add New +
          </Button>
        </Link>
      </div>
      <Formik
        initialValues={{
          'school_id': canViewAllSchools ? '' : user.SCHOOL_ID || ''
        }}
        onSubmit={(values: any) => {
          fetchData(values.school_id)
        }}
      >
        {
          ({ submitForm, setFieldValue, validateForm, values }) => {
            useEffect(() => {
              if (values.school_id) {
                submitForm();
              }
            }, []);

            return <Form>
              <div className="flex flex-wrap items-end">
                <div className="w-md mx-2">
                  <Select
                    name="school_id"
                    label="Select School"
                    options={schoolOptions}
                    required={true}
                    onChange={async (e) => {
                      await setFieldValue("school_id", e);

                      const errors = await validateForm();
                      if (Object.keys(errors).length === 0) {
                        submitForm();
                      }
                    }}
                  />
                </div>

              </div>
            </Form>
          }
        }

      </Formik>
      {
        students.length > 0 &&
        <>
          <div style={{ width: '100%', overflow: "hidden" }}>
            <DataTable data={students} columns={columns} itemsPerPage={10} />
          </div>
        </>
      }
    </div>
  );
};

export default Student;
