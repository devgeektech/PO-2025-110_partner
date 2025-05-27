import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import './style.scss';
import { FaAngleLeft } from "react-icons/fa";
import { getOrderById, updateOrderById } from '../../services/orders';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import { all_routes } from '../router/all_routes';
const OrderDetails = () => {
  const { id } = useParams();
  const [status, setStatus] = useState('Order placed');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const partnerId = queryParams.get("partnerId");
  const navigate = useNavigate();
  const route = all_routes;
  const [order, setOrder] = useState<any>({})

  const handleStatusChange = async (event: any) => {
    setStatus(event.target.value);

    if (id) {
      try {
        const result = await updateOrderById(id, { status: event.target.value });
        if (result.data) {
          toast.success(result.data.responseMessage, { autoClose: 5000 })
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          let message = error.response?.data?.responseMessage || error.response?.data?.message || "Something Went Wrong"
          toast.error(message, { autoClose: 5000 });
        }
      }
    }

  };
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

  const fetchOrderDetails = async () => {
    try {
      if (token) {
        localStorage.setItem('token', token);
      }
      const result = await getOrderById(id);
     
      if (result.data.data) {
        let data = result.data.data;
      
        let serviceDetails = data.services.length 
        ? data.services.map((service: any) => service?.serviceDetails?.name).join(', ')
        : '';
      
        data.serviceDetails = serviceDetails;
               
        setOrder(data);
        setStatus(result.data.data.status)
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage, { autoClose: 5000 });
      }
    }
  };

  const handleBackRoute = () => {
    navigate(route.orders + `?token=${token}&partnerId=${partnerId}`)
  };


  useEffect(() => {
    fetchOrderDetails()
  }, [])

  useEffect(()=> {

  }, [])

  return (
    <div className="content">
      <div className="container mt-4">
        <div className="left-icon">
          <FaAngleLeft onClick={()=>handleBackRoute()}/>

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
                {order?.services?.map((service:any) => service?.serviceDetails?.name).join(', ')}
              </p>  
              </h5>
              <p className="card-text text-muted small mb-1">Order ID: {order?.orderId}</p>
            </div>
            <p className="card-text card-text-2 text-muted small mb-1">{order?.customerAddresses?.address} {order?.customerAddresses?.city} {order?.customerAddresses?.city} {order?.customerAddresses?.state} {order?.customerAddresses?.county}</p>
            <p className="card-text card-text-3 fw-bold mb-2">₱{order?.amount} <span className="text-muted small">(Paid with {order?.paymentType})</span></p>
            <div className="delivery-download-button">
              <span className="delivery-button-2 badge bg-primary"><img src="/assets/img/delivery-icon-white.png" alt="" /> {order?.status}</span>
            </div>
          </div>

          <div className="card-body-2">
            <div className="card-body-inner-top">
              <h5 className="card-title mb-2">{order?.title}</h5>

            </div>
            <div className="delivery-download-button delivery-download-button-2">
              <Form.Select aria-label="Default select example" className='download-button' onChange={handleStatusChange} value={status}>
                <option>Select menu</option>
                <option value="Order placed">Order placed</option>
                <option value="On the way">On the way</option>
                <option value="In process">In process</option>
                <option value="Laundry is cleaned">Laundry is cleaned</option>
                <option value="Completed">Completed</option>
              </Form.Select>
              {/* <span className="Order-id-98"> Order ID: {order.orderId}</span> */}
            </div>
            {/* <div className="delivery-download-button delivery-download-button-2">
                 <span className="download-button bg-primary"> {order.status} <MdOutlineKeyboardArrowDown /></span>
                 
              </div> */}
          </div>

          {/* <div className="order-no-110">
            <p className="card-text">Order no:{order.orderId}</p>
          </div> */}

          <div className="order-no-110">
            <p className="card-text">Instructions:<span style={{fontSize: "0.875rem", fontWeight: "300", marginLeft: "5px"}}>{order?.instructions}</span></p>
          </div>

          <div className="per-kilogram-area">
            {order?.services?.map((service:any, index:any) => (
              <div className="per-kilogram-inner-top mb-3" key={service?._id || index}>
               <p>{service?.serviceDetails?.name}</p>
                <div className="per-kilogram-inner">
                  <div className="weightmachine">
                    <p className="card-text weightmachine-image">
                      <img
                        src={
                          service.type === 'bag'
                            ? '/assets/img/Bag.png'
                            : '/assets/img/weight-machine.png'
                        }
                        alt=""
                      />
                    </p>
                  </div>
                  <div className="weightmachine">
                    <p className="card-text weightmachine-text-1">
                      {service.type === 'bag' ? 'Per Bag' : 'Per Kilogram'}
                    </p>
                    <p className="card-text weightmachine-text-2">
                      { service.type !== 'bag' ?
                        'Perfect for mixed loads. Pay based on total laundry Weight.': 'Flat-rate pricing per PeakUp bag. No need to worry about weight.'}
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
  )
}

export default OrderDetails
