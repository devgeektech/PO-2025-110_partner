import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import "./CategoriesList.scss";
import { toast } from "react-toastify";
import { CiCirclePlus } from "react-icons/ci";
import {
  addCategory,
  getCategoryDetail,
  updateCategory,
} from "../../services/categories";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { all_routes } from "../router/all_routes";
import { FaAngleLeft } from "react-icons/fa";

type CategoryDetailType = {
  name?: string;
  description?: string;
  photo?: string;
  status?: string;
};

export default function AddServicesTabContent() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const partnerId = queryParams.get("partnerId");
  const navigate = useNavigate();
  const route = all_routes;

  const [categoryDetail, setCategoryDetail] =
    useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [status, setStatus] = useState("Active");

  const isEditMode = Boolean(id);

  const initialValues = {
    serviceName: categoryDetail?.name || "",
    description: categoryDetail?.description || "",
    image: categoryDetail?.photo || "",
    status: categoryDetail?.status || "Active",
  };

  const addServiceSchema = Yup.object().shape({
    serviceName: Yup.string().required("Service name is required"),
    description: Yup.string().min(10, "Description must be at least 10 characters")
    .max(300, "Description cannot exceed 300 characters"),
    image: Yup.mixed().when([], {
      is: () => !isEditMode,
      then: (schema) => schema.required("Icon is required"),
    }),
  });

  const formik:any = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: addServiceSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const payload: any = {
          ...values,
          status,
        };

        const formData = new FormData();
        for (const key in payload) {
          if (key !== "image") {
            formData.append(key, payload[key]);
          }
        }

        if (payload.image instanceof File) {
          formData.append("image", payload.image);
        }

        if (id) {
          const result = await updateCategory(formData, id);
          navigateToListing(result);
        } else {
          const result = await addCategory(formData);
          navigateToListing(result);
        }

        toast.success("Service added successfully and is pending admin approval. Please enable the service once approved", { autoClose: 5000 });
        resetForm();
        setSelectedImage(null);
        setStatus("Active");
      } catch (error: any) {
        console.log(error, ">>> error");
        toast.error(error.response?.data?.responseMessage, { autoClose: 5000 });
      }
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setSelectedImage(file);
      formik.setFieldValue("image", file);
    }
  };

  const navigateToListing = (res: any) => {
    if (res?.status === 200) {
      navigate(route.services + `?token=${token}&partnerId=${partnerId}`);
    }
  };

  const fetchDetails = async (id: string) => {
    try {
      const result = await getCategoryDetail(id);
      if (result.data.data) {
        setCategoryDetail(result.data.data);
        setStatus(result.data.data.status || "Active");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage, { autoClose: 5000 });
      }
    }
  };

  const handleBackRoute = () => {
    navigate(route.services + `?token=${token}&partnerId=${partnerId}`);
  };

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [id, token]);

  return (
    <div className="accountSettingTab">
      <div className="personalIformation bgFormColor p-4 formEditWrap mb-3">
        <div className="service-heading mb-2">
          <div className="left-icon">
            <FaAngleLeft onClick={() => handleBackRoute()} />
          </div>
          <h3 className="mb-3 text-center">
            {isEditMode ? "Edit Service" : "Add Service"}
          </h3>
        </div>
        <Form onSubmit={formik.handleSubmit}>
          {/* Service Name */}
          <Form.Group className="mb-3">
            <Form.Label>Service Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add Service Name"
              {...formik.getFieldProps("serviceName")}
              className={clsx("commonInput", {
                "border border-danger":
                  formik.touched.serviceName && formik.errors.serviceName,
              })}
            />
            {formik.touched.serviceName && formik.errors.serviceName && (
              <div className="text-danger mt-1">
                {formik.errors.serviceName}
              </div>
            )}
          </Form.Group>

          {/* Upload Image */}
          <Form.Group className="mb-3">
          {!(selectedImage || categoryDetail?.photo) && <Form.Label>
              {isEditMode ? "Update Service Icon" : "Add Service Icon"}
            </Form.Label> }
            {!(selectedImage || categoryDetail?.photo) && <div className="uploadBox text-center p-4 border border-light rounded position-relative">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="d-none"
                id="upload-image"
              />
              <label
                htmlFor="upload-image"
                className="uploadLabel blue-label cursor-pointer"
              >
                {!selectedImage && (
                  <CiCirclePlus size={32} />
                )}
                {selectedImage?.name || categoryDetail?.photo || "Upload Icon"}
              </label>

            </div> }
             {/* Image Preview */}
             {(selectedImage || categoryDetail?.photo) && (
                <div className="image-preview mt-3 position-relative d-inline-block">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : categoryDetail?.photo
                          ? `${process.env.REACT_APP_IMAGE_URL}${categoryDetail.photo}`
                          : ""
                    }
                    alt="Preview"
                    className="img-thumbnail"
                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                  />
                  {/* Cross Icon to Remove */}
                  {(selectedImage || categoryDetail?.photo) && (
                    <span
                      className="remove-image"
                      onClick={() => {

                        let data = categoryDetail;
                        setCategoryDetail({...data, photo:null})

                        setSelectedImage(null);
                        formik.setFieldValue("image", "");
                      }}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "#fff",
                        borderRadius: "50%",
                        cursor: "pointer",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ccc",
                        transform: "translate(50%, -50%)",
                      }}
                    >
                      ×
                    </span>
                  )}
                </div>
              )}
            {formik.touched.image && formik.errors.image && (
              <div className="text-danger mt-1">{formik.errors.image}</div>
            )}
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Service description"
              {...formik.getFieldProps("description")}
              className={clsx("commonInput", {
                "border border-danger":
                  formik.touched.description && formik.errors.description,
              })}
            />
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-4">
            <Form.Label>Status</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="status-active"
                label="Active"
                name="status"
                value="Active"
                checked={status === "Active"}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-fill"
              />
              <Form.Check
                type="radio"
                id="status-inactive"
                label="Inactive"
                name="status"
                value="InActive"
                checked={status === "InActive"}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-fill"
              />
            </div>
          </Form.Group>

          <Button type="submit" className="w-100 gradientButton">
            {isEditMode ? "Update Service" : "Add Service"}
          </Button>
        </Form>
      </div>
    </div>
  );
}
