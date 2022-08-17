import React, { useEffect, useState } from "react";
import { participantValueToType, obj2str } from "../helperFunctions";
import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();

function ImageView(props) {
  return (
    <div className="modal-body">
      {console.log("img anem" + props.img)}
      <img
        src={"../images/" + props.img}
        className="img-thumbnail"
        // style={linkStyle.image}

        // alt={user.username}
      />{" "}
      {/* {console.log("image name props in functionsssss", props.img)} */}
    </div>
  );
}

export const Contentcard = (props) => {
  var hov = false;
  const token = cookies.get("TOKEN");

  // var imagename = "";

  const [image, setimage] = useState("");
  const [check, setcheck] = useState(false);
  const [userType, setUserType] = useState("");

  useEffect(
    () => {
      console.log("In content Use Effect");
      // console.log("userid", props.userID);

      // console.log("contestid", props.contestID);

      console.log("choiceid", props.choiceID);

      // console.log("categoryid", props.categoryID);

      console.log("contentid", props.contentID);

      const vote = {
        userID: props.userID,
        contestID: props.contestID,
        choiceID: props.choiceID,
        categoryID: props.categoryID,
      };

      axios
        .get("http://localhost:5000/api/participants/getparticipant", {
          params: vote,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res body in participant get", res.data.type);
          let types = participantValueToType(res.data.type);
          setUserType(types);
        });

      axios
        .get("http://localhost:5000/api/votes/vote", {
          params: vote,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res body in vote get", res.data);

          if (res.data.message === "vote found") {
            setcheck(true);
          } else {
            setcheck(false);
          }
        });
    },
    [
      // props.contestID,
      // props.choiceID,
      // props.categoryID,
      // props.contentID,
      // props.userID,
    ]
  );

  const imageClick = (e) => {
    console.log("Click", e.target.name);

    setimage(e.target.name);
  };

  const toggleHover = () => {
    // console.log("sjflksjf")
    if (hov === true) {
      hov = false;
    } else {
      // console.log("jfdlkdsjfk")
      hov = true;
    }
  };

  const handleChange = async (e) => {
    // e.preventDefault();
    if (e.target.checked) {
      console.log("in check option");

      // console.log("userid", props.userID);

      // console.log("contestid", props.contestID);

      console.log("choiceid", props.choiceID);

      // console.log("categoryid", props.categoryID);

      console.log("contentid", props.contentID);

      const vote = {
        userID: props.userID,
        contestID: props.contestID,
        choiceID: props.choiceID,
        categoryID: props.categoryID,
      };

      axios
        .post("http://localhost:5000/api/votes/create", vote, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res body in vote create", res.data);
        });
      setcheck(true);
    } else {
      setcheck(false);
      console.log("in uncheck option");
      // console.log("userid", props.userID);

      // console.log("contestid", props.contestID);

      console.log("choiceid", props.choiceID);

      // console.log("categoryid", props.categoryID);

      console.log("contentid", props.contentID);

      const vote = {
        userID: props.userID,
        contestID: props.contestID,
        choiceID: props.choiceID,
        categoryID: props.categoryID,
      };

      axios
        .delete("http://localhost:5000/api/votes/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          data: vote,
        })
        .then((res) => {
          console.log("res body in vote delete", res.data);
        });
    }
  };

  var stylingObject = {
    image: {
      width: "18rem",

      //   height: "10%",
      //   transform: "translate(0px, 10%)",
      borderColor: "purple",
      borderWidth: 3,
      borderRadius: "50%",
    },

    card: {
      width: "10%",
      height: "10%",
    },
  };

  var linkStyle;
  if (hov === true) {
    // console.log("hello there");
    linkStyle = {
      image: {
        borderColor: "purple",
        borderWidth: 3,
        borderRadius: "50%",
      },
    };
  } else {
    // console.log("hello there brooooo")
    linkStyle = {
      image: {
        borderColor: "red",
        borderWidth: 3,
        borderRadius: "50%",
      },
    };
  }

  const cardBody = () => {
    return (
      <div className="card ">
        <div className="view">
          <img
            src={"../images/" + props.link}
            className="img-thumbnail "
            style={linkStyle.image}
            onClick={imageClick}
            name={props.link}
            data-bs-toggle="modal"
            data-bs-target={"#" + props.title[0]}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}

            // alt={user.username}
          ></img>
        </div>

        <div className="card-body">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">{props.description}</p>
        </div>

        {userType.includes("VOTER") || userType.includes("JURY") ? (
          <>
            {check === true ? (
              <>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="ownuploads"
                  onChange={handleChange}
                  id="ownuploads"
                  checked
                  // {...1===1? {"checked"}:<>bla</>}
                />
                <div className="form-check">
                  <label className="form-check-label" htmlFor="ownuploads">
                    vote
                  </label>
                </div>
              </>
            ) : (
              <>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="ownuploads"
                  onChange={handleChange}
                  id="ownuploads"
                  // {...1===1? {"checked"}:<>bla</>}
                />
                <div className="form-check">
                  <label className="form-check-label" htmlFor="ownuploads">
                    vote
                  </label>
                </div>
              </>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <>
      {props.col === 12 ? (
        <div className="col-5 mb-3">{cardBody()}</div>
      ) : (
        <div className="col-5 mb-3">{cardBody()}</div>
      )}

      <div
        className="modal fade"
        id={props.title[0]}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Image
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <img
                src={"../images/" + image}
                className="img-thumbnail"
                style={linkStyle.image}

                // alt={user.username}
              />
            </div>
            {console.log("image name props", image)}

            {/* <ImageView img={image} /> */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              {/* <button
                                type="submit"
                                onClick={createNewContest}
                                className="btn btn-primary"
                              >
                                Submit
                              </button> */}
            </div>
          </div>
        </div>
        {console.log("types", userType)}
      </div>
    </>
  );
};
