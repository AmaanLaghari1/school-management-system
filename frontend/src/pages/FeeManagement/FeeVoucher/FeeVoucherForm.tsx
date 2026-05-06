import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import Select from "../../../components/form/Select";
import Input from "../../../components/form/input/InputField";
import DatePicker from "../../../components/form/date-picker";
import Button from "../../../components/ui/button/Button";
import FeeTable from "./FeeTable";
import StudentListTable from "./StudentListTable";

import {
  getSession,
  getSessionBySchoolId,
} from "../../../api/SessionRequest";
import {
  getStandard,
  getStandardBySchoolId,
} from "../../../api/StandardRequest";
import { getEnrolmentByFilters } from "../../../api/EnrolmentRequest";
import { getFeeCategory } from "../../../api/FeeCategory";
import { getFilteredFeelist } from "../../../api/FeeList";
import {
  getFeeVoucher,
  getFeeVoucherBySchoolId,
} from "../../../api/FeeVoucher";
import { getSchool } from "../../../api/SchoolRequest"; // ADD THIS

import { useSelector } from "react-redux";
import { isAllSchoolsUser } from "../../../helpers/helper";
import { useLocation } from "react-router";

// 🔹 Debounce Hook
const useDebounce = (value: any, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

// 🔹 Validation
const validationSchema = Yup.object({
  school_id: Yup.string().required("Required"),
  session_id: Yup.string().required("Required"),
  standard_id: Yup.string().required("Required"),
  fee_month: Yup.string().required("Required"),
  date: Yup.string().required("Required"),
  fee_cat_id: Yup.string().required("Required"),
});

const FeeVoucherForm = ({ initialValues, onSubmit, loading }: any) => {
  const user = useSelector((state: any) => state.auth.authData.user);
  const canViewAllSchools = isAllSchoolsUser(user);
  const lastStudentSetRef = useRef("");
  const location = useLocation()
  const {prevValues} = location.state || {}

  return (
    <Formik
      initialValues={{
        selected_fees: [],
        selected_students: [],
        school_id: user.SCHOOL_ID !== 0 ? user.SCHOOL_ID : "",
        ...initialValues,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue }) => {
        // 🔹 Effective School ID (single source of truth)
        const effectiveSchoolId =
          values.school_id || user.SCHOOL_ID;

        // 🔹 Debounced filters
        const debouncedFilters = useDebounce({
          session_id: values.session_id,
          standard_id: values.standard_id,
          fee_cat_id: values.fee_cat_id,
          school_id: effectiveSchoolId,
        });

        // 🔹 Queries
        const { data: schools = [] } = useQuery({
          queryKey: ["schools"],
          queryFn: getSchool,
          enabled: canViewAllSchools,
          select: (res) => res.data || [],
        });

        const { data: sessions = [] } = useQuery({
          queryKey: ["sessions", effectiveSchoolId],
          queryFn: () =>
            canViewAllSchools
              ? getSession()
              : getSessionBySchoolId(effectiveSchoolId),
          select: (res) => res.data || [],
        });

        const { data: standards = [] } = useQuery({
          queryKey: ["standards", effectiveSchoolId],
          queryFn: () =>
            canViewAllSchools
              ? getStandard()
              : getStandardBySchoolId(effectiveSchoolId),
          select: (res) => res.data || [],
        });

        const {
          data: enrolments = [],
          isLoading: enrolmentsLoading,
        } = useQuery({
          queryKey: [
            "enrolments",
            values.session_id,
            values.standard_id,
            effectiveSchoolId,
          ],
          queryFn: () =>
            getEnrolmentByFilters(
              values.session_id,
              values.standard_id,
            ),
          enabled:
            !!values.session_id &&
            !!values.standard_id &&
            !!effectiveSchoolId,
          select: (res) => res.data || [],
        });

        const { data: feeCategories = [] } = useQuery({
          queryKey: ["feeCategories"],
          queryFn: getFeeCategory,
          select: (res) => res.data || [],
        });

        const { data: vouchers = [] } = useQuery({
          queryKey: ["feeVouchers", effectiveSchoolId],
          queryFn: () =>
            canViewAllSchools
              ? getFeeVoucher()
              : getFeeVoucherBySchoolId(effectiveSchoolId),
          select: (res) => res.data || [],
        });

        const {
          data: feeList = [],
          isFetching: feeLoading,
        } = useQuery({
          queryKey: ["feeList", debouncedFilters],
          queryFn: () => getFilteredFeelist(debouncedFilters),
          enabled:
            !!values.session_id &&
            !!values.standard_id &&
            !!values.fee_cat_id,
          select: (res) => res.data || [],
        });

        // 🔹 Options
        const schoolOptions = useMemo(
          () =>
            schools.map((s: any) => ({
              label: s.SCHOOL_NAME,
              value: s.SCHOOL_ID,
            })),
          [schools]
        );

        const sessionOptions = useMemo(
          () =>
            sessions.map((s: any) => ({
              label: s.SESSION_NAME,
              value: s.SESSION_ID,
            })),
          [sessions]
        );

        const standardOptions = useMemo(
          () =>
            standards.map((s: any) => ({
              label: s.STANDARD_NAME,
              value: s.STANDARD_ID,
            })),
          [standards]
        );

        const feeCategoryOptions = useMemo(
          () =>
            feeCategories.map((c: any) => ({
              label: c.CAT_TITLE,
              value: c.FEE_CAT_ID,
            })),
          [feeCategories]
        );

        // 🔹 Due Map
        const dueAmountMap = useMemo(() => {
          const map = new Map();
          vouchers.forEach((v: any) => {
            if (v?.ENROLMENT_ID) {
              map.set(v.ENROLMENT_ID, v.DUES_AMOUNT ?? "");
            }
          });
          return map;
        }, [vouchers]);

        const studentsWithDues = useMemo(
          () =>
            enrolments.map((s: any) => ({
              ...s,
              DUES_AMOUNT:
                dueAmountMap.get(s.ENROLMENT_ID) ?? "",
            })),
          [enrolments, dueAmountMap]
        );

        // 🔹 Total
        const total = useMemo(() => {
          return values.selected_fees.reduce(
            (sum: number, f: any) =>
              sum + Number(f.AMOUNT || 0),
            0
          );
        }, [values.selected_fees]);

        useEffect(() => {
          if (values.current_amount !== total) {
            setFieldValue("current_amount", total);
          }
        }, [total]);

        // 🔹 Handlers
        const handleFeeChange = useCallback(
          (fees: any[]) =>
            setFieldValue("selected_fees", fees),
          []
        );

        const handleStudentChange = useCallback(
          (students: any[]) =>
            setFieldValue("selected_students", students),
          []
        );

        // 🔹 Auto-select students
        useEffect(() => {
          const allStudents = studentsWithDues.map(
            (s: any) => ({
              ENROLMENT_ID: s.ENROLMENT_ID,
              NAME: s?.student?.NAME || "N/A",
              DUES_AMOUNT: s.DUES_AMOUNT,
            })
          );

          const key = allStudents
            .map((s: any) => s.ENROLMENT_ID)
            .join("|");

          if (lastStudentSetRef.current !== key) {
            lastStudentSetRef.current = key;
            setFieldValue("selected_students", allStudents);
          }
        }, [studentsWithDues]);

        return (
          <Form>
            <div className="grid sm:grid-cols-2 gap-2">

              {/* School Field */}
              {user.SCHOOL_ID === 0 ? (
                <Select
                  name="school_id"
                  label="School"
                  options={schoolOptions}
                  disabled={prevValues?.SCHOOL_ID} // Disable if editing existing voucher
                  required
                />
              ) : (
                <div style={{display: 'none'}}>
                  <Input
                    name="school_id"
                    label="School"
                    value={user.SCHOOL_ID}
                    disabled
                  />
                </div>
              )}

              <Select
                name="session_id"
                label="Session"
                options={sessionOptions}
                required
              />

              <Select
                name="standard_id"
                label="Standard"
                options={standardOptions}
                required
              />

              <StudentListTable
                students={studentsWithDues}
                selectedStudents={values.selected_students}
                onChange={handleStudentChange}
                loading={enrolmentsLoading}
              />

              <Input
                name="fee_month"
                type="month"
                label="Month"
                required
              />

              <Select
                name="fee_cat_id"
                label="Fee Category"
                options={feeCategoryOptions}
                required
              />

              <DatePicker
                id="date"
                name="date"
                label="Issue Date"
                required
              />

              <FeeTable
                feeList={feeList}
                selectedFees={values.selected_fees}
                onChange={handleFeeChange}
                loading={feeLoading}
              />

              <Input
                name="current_amount"
                label="Current Amount"
                value={total}
                readonly={true}
              />

              <Input name="remarks" label="Remarks" />
            </div>

            <Button
              className="mt-5"
              disabled={loading}
              type="submit"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default FeeVoucherForm;