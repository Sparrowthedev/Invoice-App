import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
let token = localStorage.getItem("token")

export const getAllClientInfo = createAsyncThunk(
  "getAllClientThunk",
  async (payload, thunkAPI) => {
    const response = await fetch(
      "https://invoice-server-xmux.onrender.com/api/v1/client/allClients",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );
    const data = await response.json();
    if(data.length === 0){
        return null;
    }
    if (!response.ok) {
      return null;
    }
    if (response.ok) {
      return data ;
    }
  }
);

export const addNewClient = createAsyncThunk(
  "client/addNewClient",
  async (clientData, thunkAPI) => {
    try {
      const response = await fetch(
        "https://invoice-server-xmux.onrender.com/api/v1/client/registerClient",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clientData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  clients: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
};

export const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClientInfo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllClientInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.clients = action.payload;
      })
      .addCase(getAllClientInfo.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.isLoading = false;
      })
      .addCase(addNewClient.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Check if the current client state is null
        if (state.clients === null) {
          // If it's null, initialize it as an array with the new client
          state.clients = [action.payload];
          console.log(state.clients);
        } else {
          // If it's already an array, push the new client to it
          state.clients = [...state.clients, action.payload]
        }
      })
      .addCase(addNewClient.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        // Optionally store the error message
        state.errorMessage = action.payload;
      });
  },
});

export default clientSlice.reducer;
