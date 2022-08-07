import { createSlice, createAsyncThunk } from '@reduxjs/toolkit' // обычный редюсер
import axios from '../axios'
//import axios from '../axios.js'

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
    const { data } = await axios.get('/posts')
    console.log(data)
    return data
})

export const fetchTags = createAsyncThunk("/post/fetchTags", async () => {
    const { data } = await axios.get("/tags")
    return data
})


const initialState = {                         //Начальное значение
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchPosts.pending]: (state, action) => {
            state.posts.items = []
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state, action) => {
            state.posts.status = "loaded"
            state.posts.items = action.payload
        },
        [fetchPosts.rejected]: (state, action) => {
            state.posts.items = []
            state.posts.status = "error"
        },
        [fetchTags.pending]: (state, action) =>{
            state.tags.items = []
            state.tags.status = "loading"
        },
        [fetchTags.fulfilled]:(state, action) =>{
            state.tags.items = action.payload
            state.tags.status = "loaded"
        },
        [fetchTags.rejected]:(state, action)=>{
            state.tags.items = []
            state.tags.status = "error"
        }
    }
})

export const postsReducer = postSlice.reducer