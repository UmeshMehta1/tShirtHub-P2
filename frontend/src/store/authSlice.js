import {createSlice} from  "@reduxjs/toolkit"
import {STATUSES} from "../statues/statuses"
import { API } from '../http'

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
        

    try{
        const response = await API.post("/auth/register", data)
        // if backend returns created user, save it in state
        if (response && response.data && response.data.data) {
            dispatch(setUser(response.data.data))
        }
        dispatch(setStatus(STATUSES.SUCCESS))

    } catch (e) {
        // Log full error details to help debugging (network / server response)
        console.error('registerUser error:', e)
        if (e.response) {
            console.error('server response:', e.response.status, e.response.data)
            // show backend message if available
            if (e.response.data && e.response.data.message) {
                alert(e.response.data.message)
            }
        } else if (e.request) {
            console.error('no response received:', e.request)
        }
        dispatch(setStatus(STATUSES.ERROR))
    }

}
}


export function loginUser(data){
    return async function loginUserThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        dispatch(clearError())
        try {
            const response = await API.post("/auth/login",data)
            
            if(response.status === 200 && response.data.token){
                // Store token in localStorage
                localStorage.setItem('token',response.data.token)
                
                // Update Redux state
                dispatch(setUser(response.data.data))
                dispatch(setToken(response.data.token))
                dispatch(setStatus(STATUSES.SUCCESS))
                
                // Return success for component to handle navigation
                return { success: true, data: response.data }
            }
        } catch (error) {
            console.error('Login error:', error)
            let errorMessage = "Something went wrong"
            
            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.message || error.response.data?.error || "Login failed"
                console.error('Server error:', error.response.status, error.response.data)
            } else if (error.request) {
                // Request made but no response
                errorMessage = "No response from server. Please check your connection."
                console.error('No response:', error.request)
            }
            
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}