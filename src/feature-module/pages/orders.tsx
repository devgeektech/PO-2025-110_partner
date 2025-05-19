import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './style.scss';
import { FaAngleLeft } from "react-icons/fa";
import { FaLocationArrow } from 'react-icons/fa';
import { MdOutlineFileDownload } from 'react-icons/md';
import { getOrders } from '../../services/orders';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import html2pdf from "html2pdf.js";
import { all_routes } from '../router/all_routes';
const Orders = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const invoiceRef = useRef();
  const [tab, setTab] = useState('active');
  const partnerId = queryParams.get("partnerId");
  const navigate = useNavigate();
  const route = all_routes;
  const formatDate = (isoDate: any) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const [orders, setOrders] = useState<any>([]);
  const [filter, setFiter] = useState<string>("active")

  const fetchOrders = async () => {
    try {
      if (token) {
        localStorage.setItem('token', token);
      }
      const result = await getOrders(tab);
      if (result.data.data) {
        setOrders(result.data.data)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage);
      }
    }
  };

  const getInvoiceHTML = (order: any) => (
    <div className="content">
      <div className="container mt-4">
        <div className="card mb-3 border-0 order-mob">
          <h3 className="text-center mb-4 main-text">Invoice</h3>
          <div className="card-body-invoice">
            <div className="card-body-invoice-inner">
              <h5 className="card-title mb-2">Service :</h5>
              <p className="card-text text-muted small mb-1">
                {order?.category?.name}
              </p>
            </div>
            <div className="card-body-invoice-inner">
              <h5 className="card-title mb-2">Amount Paid :</h5>
              <p className="card-text text-muted small mb-1">{order?.amount}</p>
            </div>
            <div className="card-body-invoice-inner">
              <h5 className="card-title mb-2">Date & Time :</h5>
              <p className="card-text text-muted small mb-1">
                {formatDate(order?.pickupDate)}
              </p>
            </div>
            <div className="card-body-invoice-inner">
              <h5 className="card-title mb-2">Transaction ID :</h5>
              <p className="card-text text-muted small mb-1">ASFVV123</p>
            </div>
            <div className="card-body-invoice-inner border-line-area">
              <div className="border-line"></div>
            </div>
            <div className="card-body-invoice-inner payment-status">
              <h5 className="card-title mb-2">Payment Status</h5>
              <p className="card-text text-muted small mb-1">
                <span className="payment-status-button">Paid</span>
              </p>
            </div>
            <div className="card-body-invoice-inner">
              <h5 className="card-title mb-2">Payment Method :</h5>
              <p className="card-text text-muted small mb-1 apple-pay">
                <img src="/assets/img/apple-pay.png" alt="Apple Pay" />
                E-Wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleDownload = (order: any) => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const content = getInvoiceHTML(order);
    const wrapper = document.createElement("div");
    wrapper.className = "pdf-wrapper";

    const { render } = require("react-dom");
    render(content, wrapper);

    container.appendChild(wrapper);

    html2pdf()
      .set({
        margin: 0,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .from(wrapper)
      .save()
      .then(() => {
        document.body.removeChild(container);
      });
  };

  const handleBackRoute = () => {
    navigate(route.ordersRedirect + `?token=${token}&partnerId=${partnerId}`)
  };



  useEffect(() => {
    fetchOrders()
  }, [tab])

  return (
    <div className="content">
      <div className="container mt-4">
        <div className="left-icon">
          <FaAngleLeft onClick={()=>handleBackRoute()} />

          <h3 className="text-center mb-4 main-text">Orders</h3>
        </div>
        {/* Tabs */}

        <div className="d-flex bg-white p-3 justify-content-center mb-3 active-history-button position-sticky top-0 z-3 ">
          <button onClick={() => setTab("active")} className={(tab == "active") ? "btn btn-outline-primary active-button" : "btn btn-outline-primary history-button"}>Active </button>
          <button onClick={() => setTab("history")} className={(tab != "active") ? "btn btn-primary active-button" : "btn btn-outline-primary history-button"}>History</button>
        </div>

        {/* Orders List */}
        <div className='row'>
          {orders.map((order: any, index: any) => (
            <div className='col-lg-4 col-md-6'>
              <div key={index} className="card mb-3 shadow-sm border-0 order-mob">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                  <span className="fw-bold">{formatDate(order?.pickupDate)}</span>
                  <span className="text-muted small">{order?.deliveryTime}</span>
                </div>
                <div className="card-body">
                  <div className="card-body-inner-top">
                    <h5 className="card-title mb-2">{order?.category?.name}</h5>
                    <p className="card-text text-muted small mb-1">Order ID: {order?.orderId}</p>
                  </div>
                  <p className="card-text card-text-2 text-muted small mb-1">{order?.customerAddresses?.address} {order?.customerAddresses?.city} {order?.customerAddresses?.city} {order?.customerAddresses?.state} {order?.customerAddresses?.county}</p>
                  <p className="card-text card-text-3 fw-bold mb-2">{order.amount} <span className="text-muted small">(Paid with {order.paymentType})</span></p>
                  <div className="delivery-download-button">
                    <span className="delivery-button badge bg-primary">
                      <img src="/assets/img/delivery-icon.png" alt="" />
                      {order.status}</span>
                    <span onClick={() => handleDownload(order)} className="download-button bg-primary"><MdOutlineFileDownload /> Download Invoice</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Orders
