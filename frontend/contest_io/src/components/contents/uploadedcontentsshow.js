import React, {useEffect, useState} from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";



export const UploadedContentsShow = () => {
  return (
    <div className="container">
      <select className="form-select" aria-label="Default select example">
        <option selected>Open this select menu</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>
  );
};
