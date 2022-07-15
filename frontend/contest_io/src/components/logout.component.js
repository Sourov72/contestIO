import React, { useState } from "react";
import axios from "axios";

export const Logout = (props) => {
  

  const login = (e) => {
    e.preventDefault();

    localStorage.setItem('id',"");
        console.log("hello this is logged in person userid: ", localStorage.getItem('id'));

        window.location = "/";
    
  };

  return (
    <div className="login container">
      
      <h1 className="container text-center">Logout</h1>
      <form>
        <div className="mb-3">
         Are you sure you want to logout?
         
        </div>
        

        <button type="submit" className="btn btn-primary" onClick={login}>
          Logout
        </button> 
      </form>
    </div>
  );
};
