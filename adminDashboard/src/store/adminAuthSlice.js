import { createSlice } from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import { API } from '../http/index'

const adminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        data: [],
        status: STATUSES.IDLE,
        token: localStorage.getItem('adminToken') || "",
        isAuthenticated: !!localStorage.getItem('adminToken'),
        error: null,
    },
    reducers: {
        setAdmin(state, action) {
            state.data = action.payload
            state.isAuthenticated = true
        },
        setStatus(state, action) {
            state.status = action.payload
        },
        setError(state, action) {
            state.error = action.payload
        },
        setToken(state, action) {
            state.token = action.payload
            if (action.payload) {
                state.isAuthenticated = true
            }
        },
        logOut(state) {
            state.data = []
            state.token = null
            state.isAuthenticated = false
            state.status = STATUSES.SUCCESS
            localStorage.removeItem('adminToken')
        },
        clearError(state) {
            state.error = null
        },
    }
})

export const { setAdmin, setStatus, setToken, logOut, clearError, setError } = adminAuthSlice.actions
export default adminAuthSlice.reducer

export function adminLogin(data) {
    return async function adminLoginThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        dispatch(clearError())

        if (!data.email || !data.password) {
            const errorMessage = "Email and password are required"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }

        try {
            const response = await API.post("/auth/login", data)

            if (response && response.status === 200 && response.data && response.data.token) {
                // Check if user is admin (you may need to adjust this based on your backend response)
                const userData = response.data.data?.[0] || response.data.data
                if (userData && userData.role !== 'admin') {
                    const errorMessage = "Access denied. Admin privileges required."
                    dispatch(setError(errorMessage))
                    dispatch(setStatus(STATUSES.ERROR))
                    return { success: false, error: errorMessage }
                }

                localStorage.setItem('adminToken', response.data.token)
                dispatch(setAdmin(userData))
                dispatch(setToken(response.data.token))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data }
            } else {
                const errorMessage = response.data?.message || "Login failed. Invalid response from server."
                dispatch(setError(errorMessage))
                dispatch(setStatus(STATUSES.ERROR))
                return { success: false, error: errorMessage }
            }
        } catch (error) {
            console.error('Admin login error:', error)
            let errorMessage = "Something went wrong"

            if (error.response) {
                errorMessage = error.response.data?.message || error.response.data?.error || "Login failed. Please check your credentials."
            } else if (error.request) {
                errorMessage = "No response from server. Please check your connection."
            } else {
                errorMessage = error.message || "An error occurred during login"
            }

            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

