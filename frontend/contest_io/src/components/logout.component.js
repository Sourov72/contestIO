import React, { useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Logout = (props) => {
  const login = (e) => {
    e.preventDefault();

    localStorage.setItem("id", "");
    console.log(
      "hello this is logged in person userid: ",
      localStorage.getItem("id")
    );
    cookies.remove("TOKEN", { path: "/" });

    window.location = "/";
  };

  return (
    <div className="login container">
      <h1 className="container text-center">Logout</h1>
      <form>
        <div className="mb-3">Are you sure you want to logout?</div>

        <button type="submit" className="btn btn-theme" onClick={login}>
          Logout
        </button>
      </form>
    </div>
  );
};
