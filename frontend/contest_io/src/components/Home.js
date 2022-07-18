import React from "react";
import { Link } from "react-router-dom";

import bg1 from "../images/background1.jpg";

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
          <div className="col-6 mx-0">
            <img src={bg1} class="img-fluid rounded " alt="background-1" />
          </div>
        </div>
      </div>
      {/* <div id="backgroundimage1">
        <div>
          <h1
            style={{
              color: "#34eb8c",
              textAlign: "center",
              alignContent: "center",
            }}
          >
            <br></br>
            <br></br>
            <br></br>
            <span class="span-block">Join our Comunity</span>
            <span class="span-block">and</span>
            <span class="span-block">Host/Particpate for FREE!!</span>
          </h1>
          <div class="containercenter">
            <div class="centerbutton">
              <a class="d-flex" href="/about">
                <button class="btn btn-success px-4">Learn More</button>
              </a>
              <br></br>
              <a class="d-flex" href="/signup">
                <button class="btn btn-warning px-4 mx-2">Join Now</button>
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
