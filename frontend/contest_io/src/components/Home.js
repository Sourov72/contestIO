import React from "react";
import { Link } from "react-router-dom";

import bg1 from "../images/background1.png";
import bg2 from "../images/background3.jpg";
import bg3 from "../images/background4.jpg";

export const Home = (props) => {
  return (
    <>
      <div className="container mt-5">
        <div className="row home-box">
          <div className="col-6 p-4 d-flex flex-column justify-content-center">
            <h1 className="text-center fw-bold headline">
              Join our Community, Host &amp; Participate for Free
            </h1>
            <p className="text-center">
              Browse our contests, or know more about us.
            </p>

            <div className="d-flex flex-row justify-content-center">
              <Link to="/contests">
                <button className="btn btn-danger text-center px-4 me-2">
                  Check Out Contests
                </button>
              </Link>
              <Link to="/about">
                <button className="btn text-center btn-dark px-4">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
          <div className="col-6 mx-0 px-0">
            {/* <img src={bg1} className="img-fluid rounded " alt="background-1" /> */}
            <div
              id="carouselExampleSlidesOnly"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src={bg1}
                    style={{
                      width: "100%",
                      height: "480px",
                      objectFit: "cover",
                    }}
                    className="img-fluid rounded "
                    alt="background-1"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={bg2}
                    style={{
                      width: "100%",
                      height: "480px",
                      objectFit: "cover",
                    }}
                    className="img-fluid rounded "
                    alt="background-2"
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src={bg3}
                    style={{
                      width: "100%",
                      height: "480px",
                      objectFit: "cover",
                    }}
                    className="img-fluid rounded "
                    alt="background-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
