import axios from "axios";
import { notification } from "antd";

const api = axios.create({
    baseURL: `http://127.0.0.1:5000`,
    headers: {
        "Content-Type": "application/json",
    },
});

// GET
export const getAPI = async(url) =>{
    try{
        const res = await api.get(url);
        return res;
    } catch(err){
        notification.error({
            message: "Error",
            description: err.response?.data?.message || "Something went wrong.",
        });

        throw err;
    }
}

//POST
export const postAPI = async(url, data) => {
    try{
        const res = await api.post(url, data);

        notification.success({
            message: "Success",
            description: res.data.message || "Operation completed successfully.",
        });
        return res;
    } catch(err){
        notification.error({
            message: "Error",
            description: err.response?.data?.message || "Something went wrong.",
        });

        throw err;
    }
}

// PUT
export const putAPI = async(url, data) => {
    try{
        const res = await api.put(url, data);

        notification.success({
            message: "Success",
            description: res.data.message || "Updated successfully.",
        });
        return res;
    } catch(err){
        notification.error({
            message: "Error",
            description: err.response?.data?.message || "Something went wrong.",
        });

        throw err;
    }
}