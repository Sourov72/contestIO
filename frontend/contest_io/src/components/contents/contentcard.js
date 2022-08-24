import React, { useEffect, useState } from "react";
import { participantValueToType, obj2str } from "../helperFunctions";
import Cookies from "universal-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert } from "../alert.component";
const cookies = new Cookies();

export const Contentcard = (props) => {
  var hov = false;
  const token = cookies.get("TOKEN");

  // var imagename = "";

  const [image, setimage] = useState("");
  const [check, setcheck] = useState(false);
  const [userType, setUserType] = useState("");
  const [voters, setvoters] = useState([]);
  const [voteranonymity, setvoteranonymity] = useState(0);
  const [voted, setvoted] = useState(false);
  const [votedeleted, setvotedeleted] = useState(false);

  useEffect(
    () => {
      console.log("In content Use Effect");
      // console.log("userid", props.userID);

      // console.log("contestid", props.contestID);

      console.log("choiceid", props.choiceID);

      // console.log("categoryid", props.categoryID);

      console.log("contentid", props.contentID);

      const contestid = {
        contestID: props.contestID,
      };
      axios
        .get("http://localhost:5000/api/contests/getvoteranonymity", {
          params: contestid,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res body in anonimity get", res.data);
          setvoteranonymity(res.data);
          // setvoteranonymity(res.data.voteranonymity);
        });

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

      const choiceid = {
        choiceID: props.choiceID,
      };

      axios
        .get("http://localhost:5000/api/votes/getContentVoters", {
          params: choiceid,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setvoters(res.data);
          console.log("res body in content voters get", res.data);
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

  const alerthandle = async () => {
    if (voted === true) {
      console.log("voted alert closed");
      setvoted(false);
    }

    if (votedeleted === true) {
      console.log("deleted voted alert closed");
      setvotedeleted(false);
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

      await axios
        .post("http://localhost:5000/api/votes/create", vote, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setvoted(true);
          setvotedeleted(false);
          timeout();
          console.log("res body in vote create", res.data);
        });

      const choiceid = {
        choiceID: props.choiceID,
      };

      axios
        .get("http://localhost:5000/api/votes/getContentVoters", {
          params: choiceid,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setvoters(res.data);
          console.log("res body in content voters get", res.data);
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

      await axios
        .delete("http://localhost:5000/api/votes/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          data: vote,
        })
        .then((res) => {
          setvotedeleted(true);
          setvoted(false);
          timeout();
          console.log("res body in vote delete", res.data);
        });

      const choiceid = {
        choiceID: props.choiceID,
      };

      axios
        .get("http://localhost:5000/api/votes/getContentVoters", {
          params: choiceid,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setvoters(res.data);
          console.log("res body in content voters get", res.data);
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

  // console.log("hello there brooooo")
  const linkStyle = {
    image: {
      width: "60%",
      height: "60%",
      transform: "translate(0px, 2%)",
      borderColor: "purple",
      borderWidth: 3,
      borderRadius: "20%",
    },

    modalimage: {
      width: "90%",
      height: "90%",
      borderColor: "black",
      borderWidth: 2,
      borderRadius: "5%",
    },

    card: {
      borderWidth: 3,
    },

    checkbox: {
      width: "4%",
      height: "17px",
      transform: "translate(0px, -20%)",
      borderColor: "black",
      borderWidth: 2,
      color: "black",
      borderRadius: "50%",
    },

    votedcheckbox: {
      width: "4%",
      height: "17px",
      transform: "translate(0px, -20%)",
      borderColor: "black",
      borderWidth: 2,
      color: "red",
      backgroundColor: "black",
      borderRadius: "50%",
    },

    iconimage: {
      width: "9%",
      height: "9%",
      borderRadius: "50%",
    },
  };

  function timeout() {
    console.log("in time out");
    setTimeout(function () {
      setvoted(false);
      setvotedeleted(false);
    }, 2000);
    console.log("after timeout");
  }

  const cardBody = () => {
    return (
      <div className="card border-success mb-3 my-2" style={linkStyle.card}>
        <div className="view">
          <img
            src={"../images/" + props.link}
            className="img-thumbnail "
            style={linkStyle.image}
            onClick={imageClick}
            name={props.link}
            data-bs-toggle="modal"
            data-bs-target={"#" + props.title[0] + props.key}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}

          // alt={user.username}
          ></img>
        </div>

        <div className="card-body  text-bg-info my-2">
          <h5 className="card-title text-uppercase fw-bold fs-2 ">
            {props.title}
          </h5>
          <p className="card-text fw-semibold">{props.description}</p>
        </div>

        <div>
          {voteranonymity === 1 ? (
            <></>
          ) : (
            <>
              {" "}
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-toggle="modal"
                data-bs-target={"#" + props.title[0] + props.choiceID}
              >
                Voter List
              </button>
              <p>Number of Voters {voters.length}</p>
            </>
          )}
        </div>

        {userType.includes("VOTER") || userType.includes("JURY") ? (
          <>
            {check === true ? (
              <>
                <div className="form-check fw-bold text-uppercase">
                  <input
                    className="form-check-input "
                    type="checkbox"
                    name="voted"
                    onChange={handleChange}
                    style={linkStyle.votedcheckbox}
                    id="ownuploads"
                    checked
                  // {...1===1? {"checked"}:<>bla</>}
                  />
                  <label className="form-check-label" htmlFor="voted">
                    vote
                  </label>
                </div>
              </>
            ) : (
              <>
                <div className="form-check fw-bold  text-uppercase">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="unvoted"
                    style={linkStyle.checkbox}
                    onChange={handleChange}
                    id="ownuploads"
                  // {...1===1? {"checked"}:<>bla</>}
                  />
                  <label className="form-check-label" htmlFor="unvoted">
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

  function voterList() {
    // if (searchShow) {

    return voters.length > 0 ? (
      <>
        {" "}
        <tr key="1">
          {/* <td className="fw-bold">Email</td> */}
          <td className="fw-bold">User Name</td>
        </tr>
        {voters.map((currentPerson) => {
          return (
            <tr key={currentPerson.id[0][0]}>
              <td data-bs-dismiss="modal">
                <Link
                  to={"/profile/" + currentPerson.id[0][0]}
                  state={{ id: currentPerson.id[0][0] }}
                >
                  {currentPerson.username[0][0]}
                </Link>
                <img
                  src={"../images/" + currentPerson.img[0][0]}
                  className="img-thumbnail "
                  style={linkStyle.iconimage}
                // onClick={imageClick}
                // name={props.link}
                // data-bs-toggle="modal"
                // data-bs-target={"#" + props.title[0] + props.key}
                // onMouseEnter={toggleHover}
                // onMouseLeave={toggleHover}

                // alt={user.username}
                ></img>
              </td>
            </tr>
          );
        })}
      </>
    ) : (
      <tr>
        <td className="text-center fw-light fst-italic text-muted">
          No Voters to show
        </td>
      </tr>
    );
  }

  return (
    <>
      {props.col === 12 ? (
        <div className="col-5 mb-3">{cardBody()}</div>
      ) : (
        <div className="col-5 mb-3">{cardBody()}</div>
      )}

      {voted === true ? (
        <>
          <Alert
            alertclass="alert alert-success alert-dismissible fade show"
            alerttext="Voted Successfully!"
            alerthandle={alerthandle}
          />
        </>
      ) : (
        <></>
      )}

      {votedeleted === true ? (
        <>
          <Alert
            alertclass="alert alert-danger alert-dismissible fade show "
            alerttext="Vote Removed Successfully!"
            alerthandle={alerthandle}
          />
        </>
      ) : (
        <></>
      )}

      <div
        className="modal fade"
        id={props.title[0] + props.key}
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
                style={linkStyle.modalimage}

              // alt={user.username}
              />
            </div>
            {console.log("image name props", image)}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        {console.log("types", userType)}
      </div>

      <div
        className="modal fade"
        id={props.title[0] + props.choiceID}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <table className="table table-borderless table-hover search-table mb-2">
              <tbody>{voterList()}</tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
