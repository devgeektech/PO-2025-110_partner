import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import "./CategoriesList.scss";
import { toast } from "react-toastify";
import { CiCirclePlus } from "react-icons/ci";
import { addCategory, getCategoryDetail, updateCategory } from "../../services/categories";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { all_routes } from "../router/all_routes";

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

  const [categoryDetail, setCategoryDetail] = useState<CategoryDetailType | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
    description: Yup.string(),
    image: Yup.mixed().when([], {
      is: () => !isEditMode,
      then: schema => schema.required("Image is required"),
    }),
  });

  const formik = useFormik({
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

        toast.success("Service saved successfully");
        resetForm();
        setSelectedImage(null);
        setStatus("Active");
      } catch (error: any) {
        console.log(error, ">>> error");
        toast.error(error.response?.data?.responseMessage);
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
      console.log("result.data.data==>", JSON.stringify(result.data.data));
      if (result.data.data) {
        setCategoryDetail(result.data.data);
        setStatus(result.data.data.status || "Active");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.responseMessage);
      }
    }
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
          <h3 className="mb-3 text-center">{isEditMode ? "Edit Service" : "Add Service"}</h3>
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
              <div className="text-danger mt-1">{formik.errors.serviceName}</div>
            )}
          </Form.Group>

          {/* Upload Image */}
          <Form.Group className="mb-3">
            <Form.Label>{isEditMode ? "Update Service Image" : "Add Service Image"}</Form.Label>
            <div className="uploadBox text-center p-4 border border-light rounded">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="d-none"
                id="upload-image"
              />
              <CiCirclePlus />

              {/* Show file name */}
              <label htmlFor="upload-image" className="uploadLabel blue-label">
                {selectedImage?.name || categoryDetail?.photo || "Upload Icon"}
              </label>
            </div>
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
