import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import userSlice from './pages/LoginPage/redux/userSlice';
import loadingSlice from './components/Loading/redux/loadingSlice.ts';
import './index.css'
import App from './App.tsx'

export const store = configureStore({
  reducer: {
    userSlice: userSlice,
    loadingSlice: loadingSlice,
  }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch