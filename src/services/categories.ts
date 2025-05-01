import http from "./http.service";
import { getStorageItem } from "./storage.service";
const token = getStorageItem("token");

export const addCategory = async (payload: any) => {
    return http.post(`/category`, payload, {
        headers: {
          Authorization: `${token}`,
        },
      });
}

export const getCategories = async (id: any) => {
    return http.get(`/category/${id}`, {
        headers: {
            Authorization: `${token}`
        }
    });
}

export const deleteCategory = async (id: any) => {
    return http.delete(`/category/${id}`, {
        headers: {
            Authorization: `${token}`
        }
    });
}