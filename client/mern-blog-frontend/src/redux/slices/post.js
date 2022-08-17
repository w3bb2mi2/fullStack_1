import { createSlice, createAsyncThunk } from '@reduxjs/toolkit' // обычный редюсер
import axios from '../axios'
//import axios from '../axios.js'

export const fetchPosts = createAsyncThunk("/posts/fetchPosts", async () => {
    const { data } = await axios.get('/posts')
    return data
})

export const fetchTags = createAsyncThunk("/post/fetchTags", async () => {
    const { data } = await axios.get("/tags")
    return data
})

//создаем новую функцию для асинхронных запросов, необходимо создание именно здесь для отображение изменений в сторе

export const fetchRemovePost = (id) =>createAsyncThunk('posts/fetchRemovePost', async () => {
    console.log(`/post/${id}`)
    await axios.delete(`/post/${id}`)
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
        // получение статей
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
        // получение тэгов
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
        },
        // удаление статей
        [fetchRemovePost.pending]:(state, action)=>{
            state.posts.items=state.posts.items.filter(obj=>obj._id === action.payload)
        }

    }
})

export const postsReducer = postSlice.reducer