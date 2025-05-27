import http from "./http.service";
import { getStorageItem } from "./storage.service";
const token = getStorageItem("token");

export const getOrders = async (tab:any) => {
  const token = getStorageItem("token");
  return http.get(`/partner/order?filter=${tab}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const getOrderById = async (id: any) => {
  const token = getStorageItem("token");
  return http.get(`/partner/order/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const updateOrderById = async (id: any, payload: any) => {
  const token = getStorageItem("token");
  return http.put(`/partner/order/${id}/status`, payload, {
    headers: {
      Authorization: `${token}`,
    },
  });
};