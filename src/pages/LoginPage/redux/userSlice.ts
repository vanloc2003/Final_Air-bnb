import { createSlice } from '@reduxjs/toolkit'

const userJson = localStorage.getItem("user");
const initialState = {
    user: userJson ? JSON.parse(userJson) : null,
}

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        setUserLoginAction: (state, { payload }) => {
            state.user = payload;

        },
        setUserLogoutAction: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        }
    }
});

export const { setUserLoginAction, setUserLogoutAction } = userSlice.actions

export default userSlice.reducer