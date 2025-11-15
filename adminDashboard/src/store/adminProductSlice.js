import { createSlice } from "@reduxjs/toolkit"
import { STATUSES } from "../statues/statuses"
import { APIAuthenticated, API } from '../http/index'

const adminProductSlice = createSlice({
    name: "adminProduct",
    initialState: {
        products: [],
        product: null,
        status: STATUSES.IDLE,
        error: null,
    },
    reducers: {
        setProducts(state, action) {
            state.products = action.payload
        },
        setProduct(state, action) {
            state.product = action.payload
        },
        addProduct(state, action) {
            state.products.push(action.payload)
        },
        updateProduct(state, action) {
            const index = state.products.findIndex(p => p._id === action.payload._id)
            if (index !== -1) {
                state.products[index] = action.payload
            }
        },
        removeProduct(state, action) {
            state.products = state.products.filter(p => p._id !== action.payload)
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

export const { setProducts, setProduct, addProduct, updateProduct, removeProduct, setStatus, setError, clearError } = adminProductSlice.actions
export default adminProductSlice.reducer

export function fetchProducts() {
    return async function fetchProductsThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get("/admin/product/getproducts")
            if (response.data && response.data.data) {
                dispatch(setProducts(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Fetch products error:', error)
            const errorMessage = error.response?.data?.message || "Failed to fetch products"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function fetchSingleProduct(id) {
    return async function fetchSingleProductThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await API.get(`/admin/product/getproducts/${id}`)
            if (response.data && response.data.data) {
                dispatch(setProduct(response.data.data[0]))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data[0] }
            }
        } catch (error) {
            console.error('Fetch product error:', error)
            const errorMessage = error.response?.data?.message || "Failed to fetch product"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function createProduct(formData) {
    return async function createProductThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.post("/admin/product/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.data && response.data.data) {
                dispatch(addProduct(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Create product error:', error)
            const errorMessage = error.response?.data?.message || "Failed to create product"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function updateProductData(id, formData) {
    return async function updateProductThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.patch(`/admin/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response.data && response.data.data) {
                dispatch(updateProduct(response.data.data))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true, data: response.data.data }
            }
        } catch (error) {
            console.error('Update product error:', error)
            const errorMessage = error.response?.data?.message || "Failed to update product"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

export function deleteProductData(id) {
    return async function deleteProductThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING))
        try {
            const response = await APIAuthenticated.delete(`/admin/product/${id}`)
            if (response.status === 200) {
                dispatch(removeProduct(id))
                dispatch(setStatus(STATUSES.SUCCESS))
                return { success: true }
            }
        } catch (error) {
            console.error('Delete product error:', error)
            const errorMessage = error.response?.data?.message || "Failed to delete product"
            dispatch(setError(errorMessage))
            dispatch(setStatus(STATUSES.ERROR))
            return { success: false, error: errorMessage }
        }
    }
}

