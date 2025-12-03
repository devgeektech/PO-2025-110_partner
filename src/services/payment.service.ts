import http from "./http.service"
export const REQUEST_PAYMENT_URL = `/payment/createCardPayment`;

export const createPaymentReq = async (payload: any) => {
  return http.post(REQUEST_PAYMENT_URL, payload);
}