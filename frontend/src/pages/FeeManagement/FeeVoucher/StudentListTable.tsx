import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useLocation } from "react-router";

const StudentTable = ({
  students = [],
  selectedStudents = [],
  onChange,
  loading,
}: any) => {

  const location = useLocation()
  const {prevValues} = location.state || {}

  const safeList = Array.isArray(students) ? students : [];

  const selectedMap = useMemo(() => {
    const map = new Map();
    selectedStudents.forEach((s: any) =>
      map.set(s.ENROLMENT_ID, s)
    );
    return map;
  }, [selectedStudents]);

  const toggle = (student: any) => {
    const exists = selectedMap.has(student.ENROLMENT_ID);

    const updated = exists
      ? selectedStudents.filter(
          (s: any) => s.ENROLMENT_ID !== student.ENROLMENT_ID
        )
      : [
          ...selectedStudents,
          {
            ENROLMENT_ID: student.ENROLMENT_ID,
            NAME: student?.student?.NAME || "N/A",
            DUES_AMOUNT: student?.DUES_AMOUNT ?? "",
          },
        ];

    onChange(updated);
  };

  const toggleAll = () => {
    if (selectedStudents.length === safeList.length) {
      onChange([]);
    } else {
      const all = safeList.map((s: any) => ({
        ENROLMENT_ID: s.ENROLMENT_ID,
        NAME: s?.student?.NAME || "N/A",
        DUES_AMOUNT: s?.DUES_AMOUNT ?? "",
      }));
      onChange(all);
    }
  };

  // const handleDueAmountChange = (studentId: any, value: string) => {
  //   const updated = selectedStudents.map((student: any) =>
  //     student.ENROLMENT_ID === studentId
  //       ? { ...student, DUES_AMOUNT: value }
  //       : student
  //   );

  //   onChange(updated);
  // };

  if (loading) return <p>Loading students...</p>;
  if (!safeList.length) return null;

  return (
    <div className="col-span-2">
      <Table className="border">

        <TableHeader>
          <TableRow>
            <TableCell colSpan="4" className="dark:text-white border p-2">
              <b>Students List</b>
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>

          <TableRow>
            <TableCell className="border p-2 w-10">
              <input
                type="checkbox"
                checked={
                  safeList.length > 0 &&
                  selectedStudents.length === safeList.length
                }
                onChange={toggleAll}
              />
            </TableCell>
            <TableCell className="dark:text-white border p-2"><b>#</b></TableCell>
            <TableCell className="dark:text-white border p-2"><b>Student Name</b></TableCell>
            <TableCell className="dark:text-white border p-2"><b>Due Amount</b></TableCell>
          </TableRow>

          {safeList.map((s: any, i: number) => {
            const selected = selectedMap.has(s.ENROLMENT_ID);

            return (
              <TableRow key={s.ENROLMENT_ID}>
                <TableCell className="dark:text-white border p-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle(s)}
                  />
                </TableCell>

                <TableCell className="dark:text-white border p-2">{i + 1}</TableCell>

                <TableCell className="dark:text-white border p-2">
                  {s?.student?.NAME || "N/A"}
                </TableCell>
                <TableCell className="dark:text-white border p-2">
                  {/* <input
                    type="text"
                    value={prevValues?.DUES_AMOUNT ? prevValues.DUES_AMOUNT : (selectedMap.get(s.ENROLMENT_ID)?.DUES_AMOUNT ?? s?.DUES_AMOUNT ?? "")}
                    onChange={(e) =>
                      handleDueAmountChange(s.ENROLMENT_ID, e.target.value)
                    }
                    disabled={!selected}
                    placeholder="Enter due amount"
                    name="due_amount"
                    className="w-full rounded border px-2 py-1"
                  /> */}
                  {prevValues?.DUES_AMOUNT ? prevValues.DUES_AMOUNT : (selectedMap.get(s.ENROLMENT_ID)?.DUES_AMOUNT ?? s?.DUES_AMOUNT ?? "")}
                </TableCell>
              </TableRow>
            );
          })}

        </TableBody>
      </Table>
    </div>
  );
};

export default React.memo(StudentTable);
