import {createSlice} from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import reducer from "./authSlice"
import { APIAuthenticated } from "../http"

const cartSlice = createSlice({
       name:"cart",
       initialState:{
        items:[],
        status:STATUSES.SUCCESS
       },



reducer:{
    setItems(state, action){
        state.items = action.payload
    },
    setStatus(state, action){
        state.status.action.payload
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

     try{
          const response = await APIAuthenticated.post(`/cart/${productId}`)
          if(response.data && response.data.data && Array.isArray(response.data.data)){
            dispatch(setItems(response.data.data))
          }else{
            const cartResponse = APIAuthenticated.get("/cart/")
            if(cartResponse.data && cartResponse.data.data){
                dispatch(setItems(cartResponse.data.data))
            }

          }
          dispatch(setStatus(STATUSES.SUCCESS))
     }catch(err){
             dispatch(setStatus(STATUSES.Error))
     }
    }
}

export function fetchCartItems(){
    return async function fetchCartItemsThunk(dispatch){
    try{
        const response = await APIAuthenticated.get("/cart/")

        dispatch(setItems(response.data.data))

        dispatch(setStatus(STATUSES.SUCCESS))

    }catch(error){
        console.log(error)
        dispatch(setStatus(STATUSSES.ERROR))
    }
    }
}

export function updateCartItem(productId, quantity){
    return async function updateCartItemThunk(dispatch){
        dispatch(setStatus(STATUSES.LOADING))
        try{
            const response = await APIAuthenticated.patch(`/cart/${productId}`, {quantity})
            dispatch(updateItems({productId, quantity}))
        }catch(error){
            dispatch(setStatus(STATUSES.ERROR))
        }
    }
}


export function deleteCartItem(productId){
    return async function deleteCArtItemThunk(dispatch){
        try{
            const response = await APIAuthenticated.delete(`/cart/${productId}`)

            dispatch(deleteItem({productId}))
            dispatch(setStatus(STATUSES.SUCCESS))
        }catch(err){
            console.log(error)
            dispatch(setStatus(STATUSES.ERROR))
        }
    }
}