import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons'; // or use custom icon if needed
import test from "./../../icons/ArrowBottomIcon"
import './CategoriesList.scss';
import { FaAngleLeft, FaSearch } from 'react-icons/fa';
import { deleteCategory, getCategories } from '../../services/categories';
import DeleteCategoryModal from './deleteService';
import { BsThreeDotsVertical } from 'react-icons/bs'; 
import { Dropdown } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { useLocation } from 'react-router-dom';
export default function CategoriesList() {
  const [categories, setCategories] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const partnerId = queryParams.get("partnerId")
  const fetchServices = async () => {
    try {
      console.log(token,"token", partnerId,"partnerId")
      if (token) {
        console.log(token,'>>> token')
        localStorage.setItem('token', token);
      }
      if(partnerId){
        console.log(partnerId,">>> partner Id")
      const result = await getCategories(partnerId);
        if(result.data.data) {
          setCategories(result.data.data)
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage);
      }
    }
  };

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async() => {
    if (selectedCategory && selectedCategory._id) {
      try {
        const result:any = await deleteCategory(selectedCategory._id);
        console.log(result.data.responseMessage,">>> result >>>")
        if(result.data.responseMessage){
          toast.success(result.data.responseMessage)
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.responseMessage);
        }
      }
      setShowDeleteModal(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    fetchServices();
  },[])

  return (
    <div className="categories-screen">
      <div className="cat-title mb-2">
        <FaAngleLeft />
        <h4 className="mb-3 screen-title">Categories</h4>
        <FaSearch />
      </div>
      <div className="categories-list">
        {categories.map((cat: any) => (
          <Card
            key={cat.name}
            className="category-card mb-3 d-flex flex-row align-items-center p-3"
          >
            <img
              src={process.env.REACT_APP_IMAGE_URL + cat.photo}
              alt={cat.name}
              className="category-icon me-3"
            />
            <div className="flex-grow-1">
              <h6 className="mb-1 fw-bold">{cat.name}</h6>
              <p className="mb-0 text-muted small">{cat.description}</p>
            </div>
            {/* <Button variant="link" className="text-muted p-0" onClick={() => handleDeleteClick(cat)}>
              <i className="bi bi-three-dots-vertical"></i>
            </Button> */}
            <Dropdown align="end">
              <Dropdown.Toggle
                as="button"
                variant="link"
                className="text-muted p-0 border-0 bg-transparent"
              >
                <BsThreeDotsVertical size={20} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDeleteClick(cat)}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Card>
        ))}
      </div>

      <Button className="fab-button rounded-circle shadow-lg" variant="primary">
        <Plus size={24} />
      </Button>

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        show={showDeleteModal}
        onHide={handleCloseModal}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}
