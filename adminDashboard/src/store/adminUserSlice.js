import { createSlice } from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import { APIAuthenticated } from '../http/index'

const adminUserSlice = createSlice({
    name: "adminUser",
    initialState: {
        users: [],
        status: STATUSES.IDLE,
        error: null,
    },
    reducers: {
        setUsers(state, action) {
            state.users = action.payload
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

export const { setUsers, setStatus, setError, clearError } = adminUserSlice.actions
export default adminUserSlice.reducer

export function fetchUsers() {
    return async function fetchUsersThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.get("/admin/user")
            if (response.data && response.data.data) {
                dispatch(setUsers(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Fetch users error:', error)
            const errorMessage = error.response?.data?.message || "Failed to fetch users"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

