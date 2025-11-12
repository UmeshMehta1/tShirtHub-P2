import { createSlice } from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import { APIAuthenticated } from "../http/index"

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        paymentUrl: null,
        pidx: null,
        status: STATUSES.IDLE,
        error: null
    },
    reducers: {
        setPaymentUrl(state, action) {
            state.paymentUrl = action.payload
        },
        setPidx(state, action) {
            state.pidx = action.payload
        },
        setStatus(state, action) {
            state.status = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        },
        clearPayment(state) {
            state.paymentUrl = null
            state.pidx = null
            state.error = null
            state.status = STATUSES.IDLE
        }
    }
})

export const { setPaymentUrl, setPidx, setStatus, setError, clearPayment } = paymentSlice.actions
export default paymentSlice.reducer

// Initiate Khalti Payment
export function initiateKhaltiPayment(orderId, amount) {
    return async function initiateKhaltiPaymentThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.post("payment/", {
                orderId,
                amount
            })
            
            if (response.data && response.data.payment) {
                dispatch(setPidx(response.data.payment.pidx))
                dispatch(setPaymentUrl(response.data.payment.payment_url))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, paymentUrl: response.data.payment.payment_url }
            } else {
                throw new Error("Payment URL not received")
            }
        } catch (error) {
            console.error("Khalti payment initiation error:", error)
            const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || "Failed to initiate payment"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

// Verify Khalti Payment
export function verifyKhaltiPayment(pidx) {
    return async function verifyKhaltiPaymentThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.post("payment/verifypidx", {
                pidx
            })
            
            if (response.data && response.data.message === "payment verified successfully") {
                dispatch(setStatus(STATUSES.SUCCESS))
                dispatch(clearPayment())
                return { success: true }
            } else {
                throw new Error("Payment verification failed")
            }
        } catch (error) {
            console.error("Khalti payment verification error:", error)
            const errorMessage = error.response?.data?.message || "Payment verification failed"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

