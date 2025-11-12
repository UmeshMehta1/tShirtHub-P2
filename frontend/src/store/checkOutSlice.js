import {  createSlice } from "@reduxjs/toolkit";

import { STATUSES } from "../statues/statuses";
import {API, APIAuthenticated} from "../http/index";


const checkoutSlice = createSlice({
    name : "checkout",
    initialState :{
        data : [],
        status : STATUSES.SUCCESS,
        orders : null
    },
    
    reducers : {
       setOrder(state,action){
        state.data.push(action.payload)
       },
       setStatus(state,action){
        state.status = action.payload
       },
       setOrders(state,action){
        state.orders = action.payload
       },
       updateOrderStatus(state,action){
        const status = action.payload.status 
        const orderId = action.payload.orderId
       const updatedOrder =  state.orders.map((order)=>
            order._id === orderId ? {...order,orderStatus : status} : order
        )
        state.orders = updatedOrder
       }

    },


})

export const {setOrder,setStatus,setOrders,updateOrderStatus} = checkoutSlice.actions 

export default checkoutSlice.reducer 


export function createOrder(data){
    return async function createOrderThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        try {
            console.log('Creating order with data:', data)
            const response = await APIAuthenticated.post("order/",data)
            console.log('Order created successfully:', response.data)
            
            if (response.data && response.data.data) {
                dispatch(setOrder(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { type: 'checkout/createOrder/fulfilled', payload: response.data.data }
            } else {
                throw new Error('No order data in response')
            }
        } catch (error) {
            console.error('Order creation error:', error.response?.data || error.message || error)
            dispatch(setStatus(STATUSES.ERROR))
            return { type: 'checkout/createOrder/rejected', error: error.response?.data?.message || error.message }
        }
    }
}

export function fetchOrder(){
    return async function fetchOrderThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.get("order/")
            console.log(response.data.data)
            dispatch(setOrders(response.data.data))
            dispatch(setStatus(STATUSES.SUCCESS))
        } catch (error) {
            console.log(error)
            dispatch(setStatus(STATUSES.ERROR))
        }
    }
}


export function updateOrderStatusInStore(data) {
    return function  updateOrderStatusInStoreThunk(dispatch){
        dispatch(updateOrderStatus(data))
    }
}

export function cancelOrder(orderId){
    return async function cancelOrderThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.patch("order/cancel", {id: orderId})
            // Update the order status in the store
            dispatch(updateOrderStatus({orderId: orderId, status: "cancelled"}))
            dispatch(setStatus(STATUSES.SUCCESS))
            // Refresh orders list
            dispatch(fetchOrder())
            return { success: true, data: response.data.data }
        } catch (error) {
            console.log(error)
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: error.message }
        }
    }
}
