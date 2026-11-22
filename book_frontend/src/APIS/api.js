import axios from "axios";
import { notification } from "antd";

const api = axios.create({
    baseURL: `http://127.0.0.1:5000`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("b_token");
        
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)

// GET
export const getAPI = async(url) =>{
    try{
        const res = await api.get(url);
        return res;
    } catch(err){
        throw err;
    }
}

//POST
export const postAPI = async(url, data) => {
    try{
        const res = await api.post(url, data);

        return res;
    } catch(err){
        throw err;
    }
}

// PUT
export const putAPI = async(url, data) => {
    try{
        const res = await api.put(url, data);
        return res;
    } catch(err){
        throw err;
    }
}
