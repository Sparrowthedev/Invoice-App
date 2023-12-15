import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useNavigate } from 'react-router-dom'



export const logoutVendor = () => {
    const navigate = useNavigate()
    navigate('/login')
    localStorage.clear()
}

let logedInVendor = JSON.parse(localStorage.getItem('vendorInfo'))

const initialState = {
    vendorData: logedInVendor ? logedInVendor : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const vendorAuthSlice = createSlice({
    name: "vendorAuth",
    initialState,

    reducers: {
        reset: (state) => {
            state.isError = false,
                state.isSuccess = false,
                state.isLoading = false,
                state.message = ""
        }
    },
})

export default vendorAuthSlice.reducer
export const { reset } = vendorAuthSlice.actions