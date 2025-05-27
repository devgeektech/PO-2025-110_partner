import http from "./http.service";
import { getStorageItem } from "./storage.service";

export const getOrders = async (tab:any) => {
  let token = getStorageItem("token");
  return http.get(`/partner/order?filter=${tab}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const getOrderById = async (id: any) => {
  let token = getStorageItem("token");
  return http.get(`/partner/order/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const updateOrderById = async (id: any, payload: any) => {
  let token = getStorageItem("token");
  return http.put(`/partner/order/${id}/status`, payload, {
    headers: {
      Authorization: `${token}`,
    },
  });
};