import {configureStore} from "@reduxjs/toolkit"

import authReducer from "./authSlice"
import cartReducer from "./cartSlice"
import checkoutReducer from "./checkOutSlice"
import paymentReducer from "./paymentSlice"



const store = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
        checkout: checkoutReducer,
        payment: paymentReducer,
        
    }
})

export default store