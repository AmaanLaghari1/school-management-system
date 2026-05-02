import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import * as API from "../../../api/FeeVoucher";
import Alert from "../../../components/custom/Alert";
import SubHeading from "../../../components/custom/SubHeading";
import FeeVoucherForm from "./FeeVoucherForm";
import { useSelector } from "react-redux";

const FeeVoucherAdd = () => {
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.authData.user);

    const mutation = useMutation({
    mutationFn: API.createFeeVoucher,

    onSuccess: (data, variables) => {
        // console.log("FORM VALUES:", variables);
        // return
        // console.log("API RESPONSE:", data);

        Alert({ status: true, text: "Fee voucher created successfully" });
        navigate("/fee/vouchers");
    },
    
    onError: (error:any, variables) => {
        console.log("FAILED VALUES:", variables);
        console.error(error);
        Alert({ status: false, text: error.data?.message || "Something went wrong!" });

        Alert({ status: false, text: "Something went wrong" });
    },
});
    const initialValues = {
        school_id: user.SCHOOL_ID,
        session_id: "",
        standard_id: "",
        enrolment_id: "",
        fee_cat_id: "",
        fee_month: "",
        date: "",
        remarks: "",
        selected_fees: [],
        fee_remarks: {},
        current_amount: 0,
        due_amount: 0
    };

    return (
        <div>
            <SubHeading>Add New Fee Voucher</SubHeading>

            <FeeVoucherForm
                initialValues={initialValues}
                onSubmit={(values: any) => mutation.mutate(values)}
                loading={mutation.isPending}
            />
        </div>
    );
};

export default FeeVoucherAdd;