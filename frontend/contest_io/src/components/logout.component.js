import React from "react";
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
      <h2 className="text-center fw-bold my-3">Log Out</h2>
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4 my-5">
          <div className="card text-center text-bg-theme-light">
            <div className="card-body">
              <div className="mb-3">Are you sure you want to logout?</div>
              <button type="submit" className="btn btn-theme" onClick={login}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>
    </div>
  );
};
