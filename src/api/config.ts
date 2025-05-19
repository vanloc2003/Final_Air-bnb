import axios from 'axios';
import { store } from '../main';
import { hideLoading, showLoading } from '../components/Loading/redux/loadingSlice';

export const CYBER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OSIsIkhldEhhblN0cmluZyI6IjAzLzA5LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1Njg1NzYwMDAwMCIsIm5iZiI6MTcyOTcwMjgwMCwiZXhwIjoxNzU3MDA1MjAwfQ.nPo29RkxTkE_C16RhJnxw90M3v3cu3Ur91a47F5epxA";

const userJson = localStorage.getItem("user");
let userInfo = null;

if (userJson) {
    userInfo = JSON.parse(userJson);
}

export const https = axios.create({
    baseURL: "https://airbnbnew.cybersoft.edu.vn",
    headers: {
        tokenCybersoft: CYBER_TOKEN,
        token: userInfo?.token,

    }
})
https.interceptors.request.use(function (config) {
    store.dispatch(showLoading())
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
https.interceptors.response.use(function (response) {
    setTimeout(() => {
        store.dispatch(hideLoading());
    }, 2000)
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    store.dispatch(hideLoading());
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
