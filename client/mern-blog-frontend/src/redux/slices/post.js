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

export const fetchTagsSortedByLatest = createAsyncThunk("/post/fetchTagsSortedByLatest", async () => {
    const { data } = await axios.get("/posts/sorted")
    return data
})

export const fetchTagsSortedByviews = createAsyncThunk("/post/fetchTagsSortedByviews", async () => {
    const { data } = await axios.get("/posts/sortedByViews")
    return data
})
export const fetchPostsByTags = createAsyncThunk("/post/fetchPostsByTags", async (params) => {
    console.log("params(поиск по тегам: )", params)
    const { data } = await axios.get("/tags/jkjkjkjkj",{params})
    return data
})
//получение постов по тэгу
export const getPostsByTags = createAsyncThunk("/post/fetchTagsSortedByviews", async (params) => {
    const { data } = await axios.get("/posts/sortedByViews", {params})
    return data
})

//создаем новую функцию для асинхронных запросов, необходимо создание именно здесь для отображение изменений в сторе

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', async (id) => {
    console.log(`/post/${id}`)
    axios.delete(`/post/${id}`)
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
            console.log(action)
            state.posts.status = "loaded"
            state.posts.items = action.payload
        },
        [fetchPosts.rejected]: (state, action) => {
            state.posts.items = []
            state.posts.status = "error"
        },
        //получение постов по тэгу

        [fetchPostsByTags.pending]: (state, action) => {
            state.posts.items = []
            state.posts.status = 'loading'
        },
        [fetchPostsByTags.fulfilled]: (state, action) => {
            console.log(action)
            state.posts.status = "loaded"
            state.posts.items = action.payload
        },
        [fetchPostsByTags.rejected]: (state, action) => {
            state.posts.items = []
            state.posts.status = "error"
        },


        //получение постов отсортированных по времени
        [fetchTagsSortedByLatest.pending]: (state) => {
            console.log("Идет загрузка постов...")
            state.posts.status = "loading"
            state.posts.items = []
        },
        [fetchTagsSortedByLatest.fulfilled]: (state, action) => {
            console.log(action)
            state.posts.items = action.payload
            state.posts.status = "loaded"
        },
        [fetchTagsSortedByviews.pending]: (state) => {
            console.log("Идет загрузка постов...")
            state.posts.status = "loading"
            state.posts.items = []
        },
        [fetchTagsSortedByviews.fulfilled]: (state, action) => {
            console.log(action)
            state.posts.items = action.payload
            state.posts.status = "loaded"
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
            console.log(action)
            state.posts.items=state.posts.items.filter(obj=>obj._id !== action.meta.arg)
        }
    }
})

export const postsReducer = postSlice.reducer