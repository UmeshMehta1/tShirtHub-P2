import { configureStore } from "@reduxjs/toolkit"
import adminAuthReducer from "./adminAuthSlice"
import adminProductReducer from "./adminProductSlice"
import adminOrderReducer from "./adminOrderSlice"
import adminUserReducer from "./adminUserSlice"

export const store = configureStore({
    reducer: {
        adminAuth: adminAuthReducer,
        adminProduct: adminProductReducer,
        adminOrder: adminOrderReducer,
        adminUser: adminUserReducer,
    }
})

export default store

