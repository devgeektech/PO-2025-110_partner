import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { getOrderById } from "../../services/orders";
import { createPaymentReq } from "../../services/payment.service";
import "./style.scss";

const MayaPayment = () => {
  const { id } = useParams();
  const [order, setOrder] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // detect redirect result (from Maya)
  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get("status"); // success | failed | canceled

  useEffect(() => {
    if (paymentStatus === "success") {
      toast.success("Payment Successful!");
      navigate(`/orders/${id}`);
    }
    if (paymentStatus === "failed") {
      toast.error("Payment Failed!");
    }
    if (paymentStatus === "cancelled") {
      toast.info("Payment Cancelled.");
    }
  }, [paymentStatus]);

  // Fetch order details
  const loadOrder = async () => {
    try {
      const res = await getOrderById(id);
      if (res.data?.data) {
        setOrder(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to load order.");
    }
  };

  useEffect(() => {
    if(id){
        loadOrder();
    }
  }, []);

  // Handle Maya payment
  const handlePayNow = async () => {
    setLoading(true);

    try {
      const res = await createPaymentReq({
        orderId: id,
        amount: order.amount,
        customer: {  
          email: order.customer?.email,
          phone: order.customer?.phone,
        },
        description: 'Testing'
      });

      // if (res.data?.checkoutUrl) {
      //   window.location.href = res.data.checkoutUrl; // redirect to Maya WebView
      // } else {
      //   toast.error("Unable to start payment.");
      // }
    } catch (err) {
      toast.error("Payment error. Check API keys.");
    }

    setLoading(false);
  };

  return (
    <div className="content">
      <div className="container mt-4">
        <h3 className="text-center mb-4 main-text">Maya Payment</h3>

        <div className="card shadow-sm border-0 p-3">
          <h5 className="fw-bold">Order #{order?.orderId}</h5>

          <p className="text-muted small mb-1">
            {order?.services
              ?.map((service) => service?.serviceDetails?.name)
              .join(", ")}
          </p>

          <p className="fw-bold mt-2">
            Amount to Pay:  
            <span className="text-success">
              ₱ {order?.amount?.toFixed(2)}
            </span>
          </p>

          <div className="mt-3">
            <p><strong>Email:</strong> {order?.customer?.email}</p>
            <p><strong>Phone:</strong> {order?.customer?.phone}</p>
          </div>

          <button
            className="btn btn-primary w-100 mt-4"
            disabled={loading}
            onClick={handlePayNow}
          >
            {loading ? "Redirecting..." : "Pay with Maya"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MayaPayment;
