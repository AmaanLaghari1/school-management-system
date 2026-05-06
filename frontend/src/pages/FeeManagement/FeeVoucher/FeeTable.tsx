import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

const FeeTable = ({
  feeList = [],
  selectedFees = [],
  onChange,
  loading,
}: any) => {

  const safeList = Array.isArray(feeList) ? feeList : [];

  // âœ… Fast lookup map
  const selectedMap = useMemo(() => {
    const map = new Map();
    selectedFees.forEach((f: any) => map.set(f.FEE_ID, f));
    return map;
  }, [selectedFees]);

  const toggle = (fee: any) => {
    const exists = selectedMap.has(fee.FEE_ID);

    let updated;

    if (exists) {
      updated = selectedFees.filter(
        (f: any) => f.FEE_ID !== fee.FEE_ID
      );
    } else {
      updated = [
        ...selectedFees,
        {
          FEE_ID: fee.FEE_ID,
          AMOUNT: fee.AMOUNT,
          REMARKS: "",
        },
      ];
    }

    onChange(updated);
  };

  const toggleAll = () => {
    if (selectedFees.length === safeList.length) {
      onChange([]);
    } else {
      const all = safeList.map((f: any) => ({
        FEE_ID: f.FEE_ID,
        AMOUNT: f.AMOUNT,
        REMARKS: "",
      }));
      onChange(all);
    }
  };

  const handleRemarkChange = (feeId: number, value: string) => {
    const updated = selectedFees.map((f: any) =>
      f.FEE_ID === feeId ? { ...f, REMARKS: value } : f
    );
    onChange(updated);
  };

  if (loading) return <p>Loading fees...</p>;
  if (!safeList.length) return null;

  return (
    <div className="col-span-2">
      <Table className="border p-2">
        <TableHeader>
          <TableRow>
            <TableCell colSpan="4" className="border">
              <h3 className="dark:text-white p-2">Included Fee Charges</h3>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>

          {/* Header */}
          <TableRow>
            <TableCell className="border p-2">
              <input
                type="checkbox"
                checked={
                  safeList.length > 0 &&
                  selectedFees.length === safeList.length
                }
                onChange={toggleAll}
              />
            </TableCell>
            <TableCell className="border dark:text-white p-2"><b>Title</b></TableCell>
            <TableCell className="border dark:text-white p-2"><b>Amount</b></TableCell>
            {/* <TableCell className="border dark:text-white p-2"><b>Remarks</b></TableCell> */}
          </TableRow>

          {/* Rows */}
          {safeList.map((f: any) => {
            const selectedObj = selectedMap.get(f.FEE_ID);
            const selected = !!selectedObj;

            return (
              <TableRow key={f.FEE_ID}>
                <TableCell className="border dark:text-white p-2 w-5">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggle(f)}
                  />
                </TableCell>

                <TableCell className="border dark:text-white p-2">{f.TITLE}</TableCell>
                <TableCell className="border dark:text-white p-2">{f.AMOUNT}</TableCell>

                {/* <TableCell className="border">
                  <input
                    disabled={!selected}
                    value={selectedObj?.REMARKS || ""}
                    onChange={(e) =>
                      handleRemarkChange(f.FEE_ID, e.target.value)
                    }
                    placeholder="Enter remarks"
                    className="border px-2 py-1 rounded w-full dark:text-white"
                  />
                </TableCell> */}
              </TableRow>
            );
          })}

        </TableBody>
      </Table>
    </div>
  );
};

export default React.memo(FeeTable);
