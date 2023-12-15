import { configureStore } from '@reduxjs/toolkit'
import vendorAuthReducer from './vendorAuthSlice'
import clientReducer from './clientSlice'
import ItemListReducer from './ItemListSlice'
import invoiceSlice from './invoiceSlice'

export default configureStore({
    reducer: {
        vendorAuth: vendorAuthReducer,
        client: clientReducer,
        invoices: invoiceSlice,
        itemList: ItemListReducer
    },
    extraReducers:{
        
    }
})