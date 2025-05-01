import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './style.scss';
import { FaAngleLeft } from "react-icons/fa";
import {FaLocationArrow } from 'react-icons/fa';
import {MdOutlineFileDownload } from 'react-icons/md';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
const Invoice = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const orders = [
    {
      date: '23 March 2025',
      time: '10:00 AM',
      orderId: '105',
      title: 'Wash & Fold',
      address: 'Cagayan Valley Road, Bonga Plaridel Philippines',
      amount: '₱ 100.00',
      payment: 'Paid with Wallet',
      status: 'On the Way'
    }
  ]

  useEffect(()=>{
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [])

  return (
    <div className="content">
      <div className="container mt-4">
      <div className="left-icon">
           <FaAngleLeft/>
      
        <h3 className="text-center mb-4 main-text">Invoice</h3>
        </div>
        {/* Tabs */}
        {/* <div className="d-flex justify-content-center mb-3 active-history-button">
          <button className="btn btn-primary me-2 active-button">Active</button>
          <button className="btn btn-outline-primary history-button">History</button>
        </div> */}

        {/* Orders List */}
        {orders.map((order, index) => (
          <div key={index} className="card mb-3 border-0 order-mob">

            <div className="card-body-invoice">
              <div className="card-body-invoice-inner">
                 <h5 className="card-title mb-2">Service :</h5>
                 <p className="card-text text-muted small mb-1">Wash & Fold, Dry<br /> Cleaning</p>
               </div>

               <div className="card-body-invoice-inner">
                 <h5 className="card-title mb-2">Amount Paid :</h5>
                 <p className="card-text text-muted small mb-1">$449</p>
               </div>

               <div className="card-body-invoice-inner">
                 <h5 className="card-title mb-2">Date & Time :</h5>
                 <p className="card-text text-muted small mb-1">Tue, Sept 4, 11:30 am</p>
               </div>

               <div className="card-body-invoice-inner">
                 <h5 className="card-title mb-2">Transation ID :</h5>
                 <p className="card-text text-muted small mb-1">ASFVV123</p>
               </div>

               <div className="card-body-invoice-inner border-line-area">
               <div className=" border-line"></div>
               </div>

               <div className="card-body-invoice-inner payment-status">
                 <h5 className="card-title mb-2">Payment Status</h5>
                 <p className="card-text text-muted small mb-1">
                  <span className="payment-status-button">
                    Paid
                    </span>
                    </p>
               </div>
               <div className="card-body-invoice-inner">
                 <h5 className="card-title mb-2">Transation ID :</h5>
                 <p className="card-text text-muted small mb-1 apple-pay"><img src="/assets/img/apple-pay.png" alt=""/>Apple Pay</p>
               </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  )
}

export default Invoice
