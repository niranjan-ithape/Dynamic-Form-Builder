import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// 🔹 Register user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', userData)
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong')
    }
  }
)

// 🔹 Login user
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', userData)
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Invalid credentials')
    }
  }
)

// 🔹 Logout user
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('user')
})

const user = JSON.parse(localStorage.getItem('user'))

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
  },
})

export default authSlice.reducer
