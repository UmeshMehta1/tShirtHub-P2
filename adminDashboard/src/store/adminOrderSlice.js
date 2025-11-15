import { createSlice } from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import { APIAuthenticated } from '../http/index'

const adminOrderSlice = createSlice({
    name: "adminOrder",
    initialState: {
        orders: [],
        order: null,
        status: STATUSES.IDLE,
        error: null,
    },
    reducers: {
        setOrders(state, action) {
            state.orders = action.payload
        },
        setOrder(state, action) {
            state.order = action.payload
        },
        updateOrder(state, action) {
            const index = state.orders.findIndex(o => o._id === action.payload._id)
            if (index !== -1) {
                state.orders[index] = action.payload
            }
        },
        setStatus(state, action) {
            state.status = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        },
        clearError(state) {
            state.error = null
        },
    }
})

export const { setOrders, setOrder, updateOrder, setStatus, setError, clearError } = adminOrderSlice.actions
export default adminOrderSlice.reducer

export function fetchOrders() {
    return async function fetchOrdersThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.get("/admin/order/")
            if (response.data && response.data.data) {
                dispatch(setOrders(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Fetch orders error:', error)
            const errorMessage = error.response?.data?.message || "Failed to fetch orders"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function fetchSingleOrder(id) {
    return async function fetchSingleOrderThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.get(`/admin/order/${id}`)
            if (response.data && response.data.data) {
                dispatch(setOrder(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Fetch order error:', error)
            const errorMessage = error.response?.data?.message || "Failed to fetch order"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function updateOrderStatus(id, orderStatus) {
    return async function updateOrderStatusThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.patch(`/admin/order/${id}`, { orderStatus })
            if (response.data && response.data.data) {
                dispatch(updateOrder(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Update order status error:', error)
            const errorMessage = error.response?.data?.message || "Failed to update order status"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function updatePaymentStatus(id, paymentStatus) {
    return async function updatePaymentStatusThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.patch(`/admin/order/paymentStatus/${id}`, { paymentStatus })
            if (response.data && response.data.data) {
                dispatch(updateOrder(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Update payment status error:', error)
            const errorMessage = error.response?.data?.message || "Failed to update payment status"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

