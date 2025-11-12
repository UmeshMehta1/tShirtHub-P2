import {createSlice} from  "@reduxjs/toolkit"
import {STATUSES} from "../statues/statuses"
import { API } from '../http/index'

const authSlice = createSlice({
    name:"auth",

    initialState:{
        data:[],
        status: STATUSES.IDLE,
        token: localStorage.getItem('token') || "",
        isAuthenticated: !!localStorage.getItem('token'),
        error: null,
    },

    reducers:{
        setUser(state, action){
            state.data= action.payload
            state.isAuthenticated = true
        },
        setStatus(state,action){
            state.status= action.payload
        },
        setError(state, action){
            state.error = action.payload
        },
        setToken(state, action){
            state.token= action.payload
            if(action.payload){
                state.isAuthenticated = true
            }
        },

        logOut(state, action){
            state.data=[],
            state.token = null,
            state.isAuthenticated = false,
            state.status= STATUSES.SUCCESS
            localStorage.removeItem('token')
        },
        clearError(state){
            state.error = null
        },
    }
})


export const {setUser, setStatus, setToken, logOut, clearError, setError}= authSlice.actions

export default authSlice.reducer

export function registerUser(data){
    return async function registerUserThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        dispatch(clearError())
        
        // Validate input
        if (!data.username || !data.email || !data.userNumber || !data.password) {
            const errorMessage = "All fields are required"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }

        try {
            const response = await API.post("/auth/register", data)
            
            // Check if response is successful and has data
            if (response && response.status === 201 && response.data) {
                // if backend returns created user, save it in state
                if (response.data.data) {
                    dispatch(setUser(response.data.data))
                }
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data }
            } else {
                // Response doesn't have expected data
                const errorMessage = response.data?.message || "Registration failed. Invalid response from server."
                dispatch(setError(errorMessage))
                dispatch(setStatus(STATUSES.ERROR))
                return { success: false, error: errorMessage }
            }
        } catch (e) {
            // Log full error details to help debugging (network / server response)
            console.error('registerUser error:', e)
            let errorMessage = "Registration failed"
            
            if (e.response) {
                console.error('server response:', e.response.status, e.response.data)
                // Get backend message if available
                errorMessage = e.response.data?.message || e.response.data?.error || "Registration failed. Please check your information."
                alert(errorMessage) // Show alert for user feedback
            } else if (e.request) {
                console.error('no response received:', e.request)
                errorMessage = "No response from server. Please check your connection."
            } else {
                errorMessage = e.message || "An error occurred during registration"
            }
            
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}


export function loginUser(data){
    return async function loginUserThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        dispatch(clearError())
        
        // Validate input
        if (!data.email || !data.password) {
            const errorMessage = "Email and password are required"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
        
        try {
            const response = await API.post("/auth/login", data)
            
            // Check if response is successful and has token
            if(response && response.status === 200 && response.data && response.data.token){
                // Store token in localStorage
                localStorage.setItem('token', response.data.token)
                
                // Update Redux state
                dispatch(setUser(response.data.data))
                dispatch(setToken(response.data.token))
                dispatch(setStatus(STATUSES.SUCCESS))
                
                // Return success for component to handle navigation
                return { success: true, data: response.data }
            } else {
                // Response doesn't have token
                const errorMessage = response.data?.message || "Login failed. Invalid response from server."
                dispatch(setError(errorMessage))
                dispatch(setStatus(STATUSES.ERROR))
                return { success: false, error: errorMessage }
            }
        } catch (error) {
            console.error('Login error:', error)
            let errorMessage = "Something went wrong"
            
            if (error.response) {
                // Server responded with error (401, 400, etc.)
                errorMessage = error.response.data?.message || error.response.data?.error || "Login failed. Please check your credentials."
                console.error('Server error:', error.response.status, error.response.data)
            } else if (error.request) {
                // Request made but no response
                errorMessage = "No response from server. Please check your connection."
                console.error('No response:', error.request)
            } else {
                // Error setting up request
                errorMessage = error.message || "An error occurred during login"
            }
            
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}