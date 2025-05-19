import http from "./http.service";
import { getStorageItem } from "./storage.service";
const token = getStorageItem("token");

export const addCategory = async (payload: any) => {
    const myToken = getStorageItem("token");
    return http.post(`/category`, payload, {
        headers: {
          Authorization: `${myToken}`,
        },
      });
}

export const getCategories = async (id: any) => {
    const myToken = getStorageItem("token");
    return http.get(`/category/partner/${id}`, {
        headers: {
            Authorization: `${myToken}`
        }
    });
}

export const deleteCategory = async (id: any) => {
    const myToken = getStorageItem("token");
    return http.delete(`/category/${id}`, {
        headers: {
            Authorization: `${myToken}`
        }
    });
}