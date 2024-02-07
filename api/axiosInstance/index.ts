import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_APP_BASE_URL
})