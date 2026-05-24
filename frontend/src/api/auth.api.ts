import axios from "axios"

export interface ApiResponse<T = undefined> {
    status: number;
    message: string;
    data?: T;
}

export const AuthApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})
