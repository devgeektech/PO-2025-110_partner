import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Form, ToggleButton } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import "./CategoriesList.scss";
import { toast } from "react-toastify";
import { CiCirclePlus } from "react-icons/ci";
import { addCategory } from "../../services/categories";
import { useLocation } from "react-router-dom";
export default function AddServicesTabContent() {
  const [status, setStatus] = useState("active");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const radios = [
    { name: "Active", value: "active" },
    { name: "Inactive", value: "inactive" },
  ];
  
  const initialValues = {
    serviceName: "",
    description: "",
    image: null,
    status: "active",
  };

  const addServiceSchema = Yup.object().shape({
    serviceName: Yup.string().required("Service name is required"),
    description: Yup.string(),
    image: Yup.mixed().required("Image is required"),
  });

  const formik = useFormik({
    initialValues,
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

        formData.append("status", status);

        const result = await addCategory(formData);

        console.log("Submitted Service", result);
        toast.success("Service added successfully");
        resetForm();
        setSelectedImage(null);
        setStatus("active");
      } catch (error:any) {
        console.log(error,'>>> error')
        toast.error(error.response?.data?.responseMessage)
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

  useEffect(()=>{
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [])

  return (
    <div className="accountSettingTab">
      <div className="personalIformation bgFormColor p-4 formEditWrap mb-3">
        <div className="service-heading mb-2">
            
          <h3 className="mb-3 text-center">Add Service</h3>
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
          </Form.Group>

          {/* Upload Image */}
          <Form.Group className="mb-3">
            <Form.Label>Add Service Image</Form.Label>
            <div className="uploadBox text-center p-4 border border-light rounded">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="d-none"
                id="upload-image"
              />
              <CiCirclePlus />
              <label htmlFor="upload-image" className="uploadLabel blue-label">
                {selectedImage ? selectedImage.name : "Upload Icon"}
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
          {/* <Form.Group className="mb-4">
            <Form.Label>Status</Form.Label>
            <div className="d-flex gap-3">
              <Button
                type="button"
                variant={status === 'active' ? 'primary' : 'outline-secondary'}
                onClick={() => setStatus('active')}
                className="flex-fill"
              >
                Active
              </Button>
              <Button
                type="button"
                variant={status === 'inactive' ? 'primary' : 'outline-secondary'}
                onClick={() => setStatus('inactive')}
                className="flex-fill"
              >
                Inactive
              </Button>
            </div>
          </Form.Group> */}
          <Form.Group className="mb-4">
            <Form.Label>Status</Form.Label>
            <div className="d-flex gap-3">
              <Form.Check
                type="radio"
                id="status-active"
                label="Active"
                name="status"
                value="active"
                checked={status === "active"}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-fill"
              />
              <Form.Check
                type="radio"
                id="status-inactive"
                label="Inactive"
                name="status"
                value="inactive"
                checked={status === "inactive"}
                onChange={(e) => setStatus(e.target.value)}
                className="flex-fill"
              />
            </div>
          </Form.Group>

          <Button type="submit" className="w-100 gradientButton">
            Add Service
          </Button>
        </Form>
      </div>
    </div>
  );
}
