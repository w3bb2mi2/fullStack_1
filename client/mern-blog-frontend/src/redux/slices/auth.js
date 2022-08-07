import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (params) => {
    const { data } = await axios.post('localhost://5000/auth/login', params)
    return data
})

const initialState = {
    data: null,
    status: 'loading'
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: {
        [fetchUserData.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchUserData.fulfilled]: (state, action)=>{
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchUserData.rejected]: (state)=>{
            state.data = null
            state.status = 'error'
        }
    }
})

export const authReducer = authSlice.reducer