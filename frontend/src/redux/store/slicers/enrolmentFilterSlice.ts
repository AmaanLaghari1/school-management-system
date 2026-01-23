import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
    school_id: string;
    session_id: string;
    standard_id: string;
    active: boolean;
}

const initialState: FilterState = {
    school_id: "",
    session_id: "",
    standard_id: "",
    active: false
};

const enrolmentFilterSlice = createSlice({
    name: "enrolmentFilters",
    initialState,
    reducers: {
        setFilters(state: any, action: PayloadAction<FilterState>) {
            return { ...state, ...action.payload };
        },
        resetFilters() {
            return initialState;
        }
    }
});

export const { setFilters, resetFilters } = enrolmentFilterSlice.actions;
export default enrolmentFilterSlice.reducer;
