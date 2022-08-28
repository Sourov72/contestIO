import React from "react";
import { Link } from "react-router-dom";

import bg1 from "../images/background1.png";

export const Home = (props) => {
  return (
    <>
      <div className="container mt-5">
        {/* <div className="row home-box">
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
            <img src={bg1} className="img-fluid rounded " alt="background-1" />
          </div>
        </div> */}
        <div
          id="carouselExampleCaptions"
          className="carousel slide"
          data-bs-ride="false"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={bg1} className="" alt="background-1" />
              {/* <img src="..." className="d-block w-100" alt="..."> */}
              <div className="carousel-caption d-none d-md-block">
                <h5>First slide label</h5>
                <p>
                  Some representative placeholder content for the first slide.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              {/* <img src="..." className="d-block w-100" alt="..."> */}
              <img src={bg1} className="d-block w-100" alt="background-1" />
              <div className="carousel-caption d-none d-md-block">
                <h5>Second slide label</h5>
                <p>
                  Some representative placeholder content for the second slide.
                </p>
              </div>
            </div>
            <div className="carousel-item">
              {/* <img src="..." className="d-block w-100" alt="..."> */}
              <img src={bg1} className="d-block w-100" alt="background-1" />
              <div className="carousel-caption d-none d-md-block">
                <h5>Third slide label</h5>
                <p>
                  Some representative placeholder content for the third slide.
                </p>
              </div>
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
};
