import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import ImageWithBasePath from "../../core/data/img/ImageWithBasePath";
import { useDispatch, useSelector } from "react-redux";
import { setLocations, setLogin, setUserDetail } from "../../core/data/redux/user/userSlice";
import { Dropdown } from "react-bootstrap";
import { clearStorage } from "../../services/storage.service";
import { LANG } from "../../constants/language";
import LogutIcon from "../../icons/LogutIcon";
import { getUserProfile, isLoginUser } from "../../services/user.service";
import { getAllLocations, getLocationById } from "../../services/partner.service";
const BackPage = () => {
  const routes: any = all_routes;
  const headerRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const [authToken, setAuthToken] = useState("");

  // const MenuToggle = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-opened");
      const sidebarOverlay = document.querySelector(".sidebar-overlay");
      if (sidebarOverlay) {
        sidebarOverlay.classList.add("opened");
      }
    } else {
      document.body.classList.remove("menu-opened");
      const sidebarOverlay = document.querySelector(".sidebar-overlay");
      if (sidebarOverlay) {
        sidebarOverlay.classList.remove("opened");
      }
    }

    // Cleanup to remove class if component unmounts
    return () => {
      document.body.classList.remove("menu-opened");
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const header = [
    {
      tittle: "Subscription",
      showAsTab: false,
      separateRoute: true,
      // routes: routes.subscription,
      routes: `${routes.subscription}?token=${authToken || localStorage.getItem("token")}`,
      hasSubRoute: false,
      showSubRoute: false
    },
  ];

  const customStyle = {
    background: location.pathname.includes(routes.home)
      ? "rgb(23, 124, 130)"
      : "rgba(33, 148, 255, 1)",
    width: "calc(100% - 64px)",
    marginLeft: "32px",
    marginRight: "32px",
    borderRadius: "24px",
  };

  useEffect(() => {
    const isLogged = isLoginUser();
    if (isLogged) {
      dispatch(setLogin(true));
      getUserDetail();
    } else {
      navigate(routes.login);
    }
  }, [])

  const getUserDetail = async () => {
    try {
      const userData = await getUserProfile();
      dispatch(setUserDetail(userData?.data?.data));
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <h3>Back page</h3>
    </>
  );
};

export default BackPage;
