import React from 'react'
import { redirect } from 'react-router-dom';

const RouteProtected = ({children}:any) => {
  const token = localStorage.getItem("token");
  if(!token){
    return redirect("/login");
  }  
  return children;
}

export default RouteProtected;