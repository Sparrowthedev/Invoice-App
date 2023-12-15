import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
let token = localStorage.getItem("token")

export const getAllInvoices = createAsyncThunk(
  "getAllInvoices",
  async (payload, thunkAPI) => {
    const response = await fetch(
      "http://localhost:5000/api/v1/invoice/allInvoice",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );
    const data = await response.json();
    if (data.length === 0) {
      return null;
    }
    if (!response.ok) {
      return null;
    }
    if (response.ok) {
      return data;
    }
  }
);

export const addNewInvoice = createAsyncThunk(
    "invoice/addNewInvoice",
    async (invoice, thunkAPI) => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/invoice/addInvoice",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(invoice),
          }
        );
        const data = await response.json();
        if(!response.ok) {
          return null;
        }
        if(response.ok) {
            return data;
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
      }
    }
  );
  
  const initialState = {
    invoices: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
  };


  export const invoiceSlice = createSlice({
    name: "invoices",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getAllInvoices.pending, (state, action) => {
          state.isLoading = true;
        })
        .addCase(getAllInvoices.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.invoices = action.payload;
        })
        .addCase(getAllInvoices.rejected, (state, action) => {
          state.isError = true;
          state.isSuccess = false;
          state.isLoading = false;
        })
        .addCase(addNewInvoice.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(addNewInvoice.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          // Check if the current client state is null
          if (state.invoices === null) {
            // If it's null, initialize it as an array with the new client
            state.invoices = [action.payload];
            console.log(state.invoices);
          } else {
            // If it's already an array, push the new client to it
            state.invoices = [...state.invoices, action.payload]
          }
        })
        .addCase(addNewInvoice.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          // Optionally store the error message
          state.errorMessage = action.payload;
        });
    },
  });
  
  export default invoiceSlice.reducer;
  
