import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./style.scss";
import { FaAngleLeft } from "react-icons/fa";
import { getOrderById, updateOrderById } from "../../services/orders";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Accordion, Button, Form, Modal } from "react-bootstrap";
import { all_routes } from "../router/all_routes";
const OrderDetails = () => {
  const { id } = useParams();
  const [status, setStatus] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const handleOpenModal = () => setShowAddressModal(true);
  const handleCloseModal = () => setShowAddressModal(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const partnerId = queryParams.get("partnerId");
  const navigate = useNavigate();
  const route = all_routes;
  const [order, setOrder] = useState<any>({});

  const handleStatusChange = async (event: any) => {
    setStatus(event.target.value);

    if (id) {
      try {
        const result = await updateOrderById(id, {
          status: event.target.value,
        });
        if (result.data) {
          toast.success(result.data.responseMessage, { autoClose: 5000 });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          let message =
            error.response?.data?.responseMessage ||
            error.response?.data?.message ||
            "Something Went Wrong";
          toast.error(message, { autoClose: 5000 });
        }
      }
    }
  };
  const formatDate = (isoDate: any) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);

  const fetchOrderDetails = async () => {
    try {
      if (token) {
        localStorage.setItem("token", token);
      }
      const result = await getOrderById(id);

      if (result.data.data) {
        let data = result.data.data;

        let serviceDetails = data.services.length
          ? data.services
              .map((service: any) => service?.serviceDetails?.name)
              .join(", ")
          : "";

        data.serviceDetails = serviceDetails;

        setOrder(data);
        console.log(data, ">>> data >>>>>");
        setStatus(result.data.data.status);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage, { autoClose: 5000 });
      }
    }
  };

  const handleBackRoute = () => {
    navigate(route.orders + `?token=${token}&partnerId=${partnerId}`);
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  useEffect(() => {}, []);

  return (
    <div className="content">
      <div className="container mt-4">
        <div className="left-icon">
          <FaAngleLeft onClick={() => handleBackRoute()} />

          <h3 className="text-center mb-4 main-text">Orders Details</h3>
        </div>
        {/* Tabs */}
        {/* <div className="d-flex justify-content-center mb-3 active-history-button">
          <button className="btn btn-primary me-2 active-button">Active</button>
          <button className="btn btn-outline-primary history-button">History</button>
        </div> */}

        {/* Orders List */}
        <div className="card mb-3 shadow-sm border-0 order-mob">
          <div className="card-header d-flex justify-content-between align-items-center bg-light">
            <span className="fw-bold">{formatDate(order?.deliveryDate)}</span>
            <span className="text-muted small">{order?.pickupTime}</span>
          </div>
          <div className="card-body card-body-2 order-details-card-body">
            <div className="card-body-inner-top">
              <h5 className="card-title mb-2">
                <p className="card-text text-muted small mb-1">
                  {order?.services
                    ?.map((service: any) => service?.serviceDetails?.name)
                    .join(", ")}
                </p>
              </h5>
              <p className="card-text text-muted small mb-1">
                Order ID: {order?.orderId}
              </p>
            </div>
            <p className="card-text card-text-2 text-muted small mb-1">
              {order?.customerAddresses?.address}{" "}
              {order?.customerAddresses?.city} {order?.customerAddresses?.city}{" "}
              {order?.customerAddresses?.state}{" "}
              {order?.customerAddresses?.county}
            </p>
            <p className="card-text card-text-3 fw-bold mb-2">
              ₱{(order?.amount ?? 0) - (order?.transportation ?? 0)}{" "}
              <span className="text-muted small">
                (Paid with {order?.paymentType || "N/A"})
              </span>
            </p>
            {order?.transportation != null && (
              <p className="card-text text-muted small mb-1">
                Transportation Fee: ₱{order.transportation}
              </p>
            )}
            {status === "Completed" && (
              <div className="delivery-download-button">
                <span className="delivery-button-2 badge bg-primary">
                  <img src="/assets/img/delivery-icon-white.png" alt="" />{" "}
                  {order?.status}
                </span>
              </div>
            )}

            {status !== "Completed" && (
              <div className="delivery-download-button delivery-download-button-2">
                <Form.Select
                  aria-label="Default select example"
                  className="download-button"
                  onChange={handleStatusChange}
                  value={status}
                  disabled={status === "Completed"}
                >
                  <option>Select menu</option>
                  <option value="Order placed" disabled={true}>
                    Order placed
                  </option>
                  <option
                    value="In process"
                    disabled={
                      !["On the way"].includes(status) ||
                      status === "Order placed"
                    }
                  >
                    In process
                  </option>
                  <option
                    disabled={
                      !["On the way", "In process"].includes(status) ||
                      status === "Order placed"
                    }
                    value="Laundry is cleaned"
                  >
                    Laundry is cleaned
                  </option>
                </Form.Select>
              </div>
            )}
          </div>
          <div className="full-address-accordion mt-3">
            <div className="order-no-110">
              <p className="card-text fw-bold">Customer Details:</p>
            </div>

            <Accordion defaultActiveKey="0">
              {order?.customerAddresses?.map((address: any, index: number) => (
                <Accordion.Item
                  eventKey={index.toString()}
                  key={address._id || index}
                >
                  <Accordion.Header>Pickup Address</Accordion.Header>

                  <Accordion.Body style={{ padding: 0 }}>
                    {/* Customer Info Section */}
                    <div
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "12px 15px",
                        background: "#fff",
                      }}
                    >
                      <h6 className="fw-bold mb-2">Customer Info</h6>
                      <p className="mb-1">
                        <strong>Email:</strong>{" "}
                        {order?.customer?.email || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Phone:</strong>{" "}
                        {order?.customer?.phone || "N/A"}
                      </p>
                    </div>

                    {/* Address Details Section */}
                    <div
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "12px 15px",
                        background: "#fff",
                        marginTop: "10px",
                      }}
                    >
                      <h6 className="fw-bold mb-2">Address Details</h6>
                      {/* <p className="mb-1"><strong>Name:</strong> {address.name ? address.name.charAt(0).toUpperCase() + address.name.slice(1) : `Address ${index + 1}`}</p> */}
                      <p className="mb-1">
                        <strong>Street:</strong> {address?.street || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>City:</strong> {address?.city|| "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>State:</strong> {address?.state || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Country:</strong> {address?.country || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Zip Code:</strong> {address?.zipCode || "N/A"}
                      </p>
                      <p className="mb-1">
                        <strong>Type:</strong>{" "}
                        {capitalize(address?.addressType) || "N/A"}
                      </p>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>

            <Accordion defaultActiveKey="0" style={{ marginTop: "5px" }}>
              <Accordion.Item eventKey="delivery">
                <Accordion.Header>Delivery Address</Accordion.Header>

                <Accordion.Body style={{ padding: 0 }}>
                  {/* Customer Info Section */}
                  <div
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px 15px",
                      background: "#fff",
                    }}
                  >
                    <h6 className="fw-bold mb-2">Customer Info</h6>
                    <p className="mb-1">
                      <strong>Email:</strong> {order?.customer?.email || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Phone:</strong> {order?.customer?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Address Details Section */}
                  <div
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "12px 15px",
                      background: "#fff",
                      marginTop: "10px",
                    }}
                  >
                    <h6 className="fw-bold mb-2">Address Details</h6>
                    {/* <p className="mb-1"><strong>Name:</strong> {address.name ? address.name.charAt(0).toUpperCase() + address.name.slice(1) : `Address ${index + 1}`}</p> */}
                    <p className="mb-1">
                      <strong>Street:</strong>{" "}
                      {order?.deliveryAddress?.street}
                    </p>
                    <p className="mb-1">
                      <strong>City:</strong> {order?.deliveryAddress?.city || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>State:</strong> {order?.deliveryAddress?.state || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Country:</strong>{" "}
                      {order?.deliveryAddress?.country || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Zip Code:</strong>{" "}
                      {order?.deliveryAddress?.zipCode || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Type:</strong>{" "}
                      {capitalize(order?.deliveryAddress?.addressType)|| "N/A"}
                    </p>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
          {/* <Modal show={showAddressModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Customer Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Accordion defaultActiveKey="0">
                {order?.customerAddresses?.map((address: any, index: number) => (
                  <Accordion.Item eventKey={index.toString()} key={address._id || index}>
                    <Accordion.Header>
                    {address.name
                      ? address.name.charAt(0).toUpperCase() + address.name.slice(1)
                      : `Address ${index + 1}`}
                    </Accordion.Header>
                    <Accordion.Body>
                      <p><strong>Name:</strong> {address.name
                      ? address.name.charAt(0).toUpperCase() + address.name.slice(1)
                      : `Address ${index + 1}`}</p>
                      <p><strong>Street:</strong> {address?.street}</p>
                      <p><strong>City:</strong> {address?.city}</p>
                      <p><strong>State:</strong> {address?.state}</p>
                      <p><strong>Country:</strong> {address?.country}</p>
                      <p><strong>Zip Code:</strong> {address?.zipCode}</p>
                      <p><strong>Type:</strong> {capitalize(address?.addressType)}</p>
                    </Accordion.Body>
                  </Accordion.Item>
                  ))}
              </Accordion>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal> */}

          {/* <div className="card-body-2">
            <div className="card-body-inner-top">
              <h5 className="card-title mb-2">{order?.title}</h5>

            </div>
            {status !== "Completed" && (<div className="delivery-download-button delivery-download-button-2">
              <Form.Select aria-label="Default select example" className='download-button' onChange={handleStatusChange} value={status} disabled={status === "Completed"} >
                <option>Select menu</option>
                <option value="Order placed" disabled={
                    true 
                  }
                  >Order placed</option>
                <option value="In process" disabled={
                    !["On the way"].includes(status) || status === "Order placed" 
                  } >In process</option>
                <option disabled={
                    !["On the way","In process"].includes(status) || status === "Order placed"
                  } value="Laundry is cleaned">Laundry is cleaned</option>
              </Form.Select>
            </div>)}
          </div> */}

          <div className="order-no-110">
            <p className="card-text">
              Instructions:
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "300",
                  marginLeft: "5px",
                }}
              >
                {order?.instructions}
              </span>
            </p>
          </div>

          <div className="per-kilogram-area">
            {order?.services?.map((service: any, index: any) => (
              <div
                className="per-kilogram-inner-top mb-3"
                key={service?._id || index}
              >
                <p>{service?.serviceDetails?.name}</p>
                <div className="per-kilogram-inner">
                  <div className="weightmachine">
                    <p className="card-text weightmachine-image">
                      <img
                        src={
                          service.type === "bag"
                            ? "/assets/img/Bag.png"
                            : "/assets/img/weight-machine.png"
                        }
                        alt=""
                      />
                    </p>
                  </div>
                  <div className="weightmachine">
                    <p className="card-text weightmachine-text-1">
                      {service.type === "bag" ? "Per Bag" : "Per Kilogram"}
                    </p>
                    <p className="card-text weightmachine-text-2">
                      {service.type !== "bag"
                        ? "Perfect for mixed loads. Pay based on total laundry Weight."
                        : "Flat-rate pricing per PeakUp bag. No need to worry about weight."}
                    </p>
                  </div>
                </div>

                <div className="weightmachine-input-fiels">
                  <input
                    type="text"
                    className="input-kg"
                    placeholder="6 Kg"
                    readOnly={true}
                    value={service?.amount}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
