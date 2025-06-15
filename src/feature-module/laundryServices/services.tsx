import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Dropdown } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import { FaAngleLeft, FaSearch } from "react-icons/fa";
import { deleteCategory, getCategories } from "../../services/categories";
import DeleteCategoryModal from "./deleteService";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import { io } from 'socket.io-client';

export default function CategoriesList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const partnerId = queryParams.get("partnerId");
  const navigate = useNavigate();
  const route = all_routes;
  const socketURL = process.env.REACT_APP_SOCKET_URL || 'https://api.peakup25.com';
  const socketRef = useRef<any>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      if (token) {
        localStorage.setItem("token", token);
      }

      if (partnerId) {
        const result = await getCategories(partnerId, searchTerm);
        if (result.data.data) {
          setCategories(result.data.data);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage, { autoClose: 5000 });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCatgegory = () => {
    navigate(
      route.addserviceRedirect + `?token=${token}&partnerId=${partnerId}`
    );
  };

  const titleCase = (str: any) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleBackRoute = () => {
    navigate(route.servicesRedirect + `?token=${token}&partnerId=${partnerId}`);
  };

  const handleDeleteClick = (category: any) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleEditClick = (category: any) => {
    setSelectedCategory(category);
    const path = route.editserviceRedirect.replace(":id", category._id);
    navigate(`${path}?token=${token}&partnerId=${partnerId}`);
  };

  const handleConfirmDelete = async (note: string) => {
    if (selectedCategory && selectedCategory._id) {
      try {
        const result: any = await deleteCategory(selectedCategory._id, note);
        if (result.data.responseMessage) {
          toast.success(result.data.responseMessage, { autoClose: 5000 });
          fetchServices();
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.responseMessage, {
            autoClose: 5000,
          });
        }
      }
      setShowDeleteModal(false);
    }
};

  const handleCloseModal = () => {
    setSelectedCategory(null);
    setShowDeleteModal(false);
  };

  const handleSearch = (value: any) => {
    setSearchTerm(value);
  };

  useEffect(() => {
    fetchServices();
  }, [searchTerm]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketURL, {
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket:', socketRef.current.id);
      });

      socketRef.current.on("service", (data: any) => {
        console.log(data,'data')
        console.log(partnerId)
        console.log(data.partnerId,'dsad')
        if (data.partnerId === partnerId) {
          fetchServices();
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [partnerId]);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          position: "relative",
          paddingBottom: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h4
          style={{
            margin: 0,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          Services
        </h4>

        <div>
          <FaSearch
            onClick={() => setShowSearchInput(!showSearchInput)}
            style={{
              fontSize: "18px",
              cursor: "pointer",
              position: "absolute",
              top: "0px",
              right: "0px",
            }}
          />
          {showSearchInput && (
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                position: "absolute",
                right: "0px",
                bottom: "5px",
                transition: "1s all ease-in-out",
              }}
            />
          )}
        </div>
      </div>

      <div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <h3
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              textAlign: "center",
            }}
          >
            No services found.
          </h3>
        ) : (
          categories.map((cat: any) => (
            <Card
              key={cat._id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f5f5f9",
              }}
              onClick={() => handleEditClick(cat)}
            >
              <img
                src={
                  cat.photo
                    ? process.env.REACT_APP_IMAGE_URL + cat.photo
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYgizZqMv5a7Qo5ZXvwKCHeRsslPrArnCZ4g&s"
                }
                alt={cat.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginRight: "15px",
                }}
              />
              <div style={{ flexGrow: 1 }}>
                <h6 style={{ marginBottom: "4px", fontWeight: "bold" }}>{titleCase(cat.name)}</h6>
                <p style={{ margin: 0, fontSize: "13px", color: "#6c757d" }}>
                  {cat.description}
                </p>
              </div>
              <div style={{ marginRight: "15px" }}>
                <span>
                  {!cat.isActiveByAdmin
                    ? "Admin Approval Pending"
                    : cat.status === "Active"
                      ? "Active"
                      : "Inactive"}
                </span>
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as="button"
                    variant="link"
                    className="text-muted p-0 border-0 bg-transparent"
                  >
                    <BsThreeDotsVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditClick(cat)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleDeleteClick(cat)}>
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card>
          ))
        )}
      </div>

      <Button
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          padding: "12px 15px",
          fontSize: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
        variant="primary"
      >
        <Plus size={24} onClick={() => handleAddCatgegory()} />
      </Button>

      <DeleteCategoryModal
        show={showDeleteModal}
        onHide={handleCloseModal}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}  