import React, { useState } from "react";
import axios from "axios";

export const Login = (props) => {
  const [user, setuser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setuser({
      ...user,
      [name]: value,
    });
  };

  const login = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/user/login", user).then((res) => {
      
      if (res.data.message === "Login Successfull") {
        // props.onLogin(res.data.user);
        alert(res.data.message);

        localStorage.setItem('id',res.data.user._id);
        console.log("hello this is logged in person userid: ", localStorage.getItem('id'));

        window.location = "/";

        
      } else {
        alert(res.data.message);
      }
    });
  };

  return (
    <div className="login container">
      {console.log("User", user)}
      <h1 className="container text-center">Login</h1>
      <form>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={user.email}
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={user.password}
            className="form-control"
            id="exampleInputPassword1"
          />
        </div>

        <button type="submit" className="btn btn-primary" onClick={login}>
          Login
        </button>
       
      </form>
    </div>
  );
};
