import {createSlice} from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import { APIAuthenticated } from "../http/index"

const cartSlice = createSlice({
       name:"cart",
       initialState:{
        items:[],
        status:STATUSES.IDLE
       },
       reducers:{
    setItems(state, action){
        state.items = action.payload
    },
    setStatus(state, action){
        state.status = action.payload
    },
    updateItems(state, action){
        const index = state.items.findIndex(item=>item.product._id === action.payload.productId)
        if(index !== -1){
            state.items[index].quantity= action.payload.quantity
        }
    },

    deleteItem(state,action){
        const index = state.items.findIndex(item=>item.product._id===action.payload.productId)
        state.items.splice(index,1)
    },
    emptyCart(state,action){
        state.items=[]
    }
}
})

export const {setItems, setStatus, updateItems, deleteItem, emptyCart} = cartSlice.actions

export default cartSlice.reducer


export function addToCart(productId){
    return async function addToCartThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
     try{
          const response = await APIAuthenticated.post(`cart/${productId}`)
          
          // Always fetch fresh cart items after adding
          const cartResponse = await APIAuthenticated.get("cart/")
          if(cartResponse.data && cartResponse.data.data){
              dispatch(setItems(cartResponse.data.data))
              dispatch(setStatus(STATUSES.SUCCESS))
              return { type: 'cart/addToCart/fulfilled', payload: cartResponse.data.data }
          } else {
              // If response has data, use it
              if(response.data && response.data.data && Array.isArray(response.data.data)){
                dispatch(setItems(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { type: 'cart/addToCart/fulfilled', payload: response.data.data }
              }
              throw new Error('No cart data received')
          }
     }catch(err){
             console.error('Add to cart error:', err)
             dispatch(setStatus(STATUSES.ERROR))
             return { type: 'cart/addToCart/rejected', error: err.message }
     }
    }
}

export function fetchCartItems(){
    return async function fetchCartItemsThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
    try{
        const response = await APIAuthenticated.get("cart/")

        dispatch(setItems(response.data.data))

        dispatch(setStatus(STATUSES.SUCCESS))

    }catch(error){
        console.log(error)
        dispatch(setStatus(STATUSES.ERROR))
    }
    }
}

export function updateCartItem(productId, quantity){
    return async function updateCartItemThunk(dispatch){
        // Don't set loading status to avoid full page reload effect
        // The optimistic update already happened, just sync with backend
        try{
            const response = await APIAuthenticated.patch(`cart/${productId}`, {quantity})
            // Only update if backend response is different (safety check)
            // The optimistic update already updated the UI
            dispatch(setStatus(STATUSES.SUCCESS))
            return { success: true }
        }catch(error){
            console.error('Update cart item error:', error)
            // On error, revert by fetching fresh data
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: error.message }
        }
    }
}


export function deleteCartItem(productId){
    return async function deleteCArtItemThunk(dispatch){
        // Don't set loading status to avoid full page reload effect
        // The optimistic delete already happened, just sync with backend
        try{
            const response = await APIAuthenticated.delete(`cart/${productId}`)
            // The optimistic deleteItem already removed it from UI
            dispatch(setStatus(STATUSES.SUCCESS))
            return { success: true }
        }catch(err){
            console.error('Delete cart item error:', err)
            // On error, revert by fetching fresh data
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: err.message }
        }
    }
}