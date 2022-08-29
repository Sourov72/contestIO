import React, { useEffect, useState } from "react";
import { participantValueToType, obj2str } from "../helperFunctions";
import Cookies from "universal-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert } from "../alert.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUserAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
const cookies = new Cookies();

export const Contentcard = (props) => {
  var hov = false;
  const token = cookies.get("TOKEN");

  const [image, setimage] = useState("");
  const [check, setcheck] = useState(false);
  const [userType, setUserType] = useState([]);
  const [voters, setvoters] = useState([]);
  const [voteranonymity, setvoteranonymity] = useState(0);
  const [voted, setvoted] = useState(false);
  const [votedeleted, setvotedeleted] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    setvoteranonymity(props.anonimity);
    setimage(props.link);

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
        // console.log("res body in participant get", res.data.type);
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
        // console.log("res body in vote get", res.data);
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
        // console.log("res body in content voters get", res.data);
      });
  }, [props]);

  // const toggleHover = () => {
  //   // console.log("sjflksjf")
  //   if (hov === true) {
  //     hov = false;
  //   } else {
  //     // console.log("jfdlkdsjfk")
  //     hov = true;
  //   }
  // };

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
    e.preventDefault();
    // console.log("button name: ", e.target.name)
    if (e.target.name === "unvoted") {
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
          // console.log("res body in vote create", res.data);
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
          // console.log("res body in content voters get", res.data);
        });
      setcheck(true);
      // console.log("set to true")
    } else {
      setcheck(false);

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
          // console.log("res body in vote delete", res.data);
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
          // console.log("res body in content voters get", res.data);
        });
    }
  };

  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  // console.log("hello there brooooo")
  const linkStyle = {
    image: {
      width: "90%",
      height: "200px",
      objectFit: "cover",
      // height: "60%",
      // transform: "translate(0px, 2%)",
      borderColor: "rgba(155, 39, 176, 0.478)",
      borderWidth: 3,
      borderRadius: "10%",
    },

    modalimage: {
      // display: "none",
      position: "absolute",
      zIndex: "9999",
      top: "0",
      left: "10%",
      width: "80vw",
      height: "80vh",
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat no-repeat",
      backgroundPosition: "center center",
      backgroundColor: "black",
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
      width: "10%",
      height: "10%",
      borderRadius: "50%",
    },
  };

  function timeout() {
    // console.log("in time out");
    setTimeout(function () {
      setvoted(false);
      setvotedeleted(false);
    }, 2000);
    // console.log("after timeout");
  }

  // {
  //   console.log("props link", props.link);
  // }

  const deletecontent = async (e) => {
    e.preventDefault();
    console.log("content delete", e.target.value);

    const temp_content = {
      contentID: e.target.value,
    };

    await axios
      .delete("http://localhost:5000/api/contents/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: temp_content,
      })
      .then((res) => {
        console.log("res body in content Delete", res.data);
        // window.location = "/";
        props.func(props.select);
      });
  };

  const cardBody = () => {
    return (
      <div className="card h-100 content-card mb-3 my-2" style={linkStyle.card}>
        <div className="card-body p-0">
          <PhotoProvider maskOpacity={0.8} bannerVisible={false}>
            <PhotoView src={props.link}>
              <img
                src={props.link}
                className="img-thumbnail "
                style={linkStyle.image}
                name={props.link}
              />
            </PhotoView>
          </PhotoProvider>
          <div className="text-bg-theme mx-0 mb-0">
            <h4 className="card-title text-capitalize fw-bold mb-0">
              {props.title}
            </h4>
            <p className="card-text mb-0">{props.description}</p>
            <p className="card-text mb-0">{props.category}</p>
          </div>
        </div>
        {(props.isResult || voteranonymity !== 1) && (
          <p>
            <b>Total Voters:</b> {voters.length}
          </p>
        )}
        <div className="d-flex flex-row justify-content-center">
          {!props.isResult &&
          (userType.includes("VOTER") || userType.includes("JURY")) ? (
            <>
              {check === true ? (
                <>
                  <button
                    className="btn btn-success px-4 mt-0 mb-2 me-2"
                    type="button"
                    name="voted"
                    onClick={handleChange}
                    id="ownuploads"
                  >
                    Voted <FontAwesomeIcon icon={faCheck} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-theme px-4 mt-0 mb-2 me-2"
                    type="button"
                    name="unvoted"
                    onClick={handleChange}
                    id="ownuploads"
                  >
                    Vote
                  </button>
                </>
              )}
            </>
          ) : (
            <></>
          )}
          {voteranonymity !== 1 && (
            <>
              <button
                type="button"
                className="btn btn-theme px-4 mt-0 mb-2 me-2"
                data-bs-toggle="modal"
                data-bs-target={"#" + props.title[0] + props.choiceID}
              >
                Voters List <FontAwesomeIcon icon={faUserAlt} />
              </button>
            </>
          )}
          {props.deleteshow === true && (
            <>
              <button
                type="button"
                className="btn btn-danger px-4 mt-0 mb-2"
                data-bs-toggle="modal"
                data-bs-target={
                  "#" + props.title[0] + props.contentID + "delete"
                }
              >
                Delete <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  function voterList() {
    // if (searchShow) {

    return voters.length > 0 ? (
      <>
        <tr key="1">
          {/* <td className="fw-bold">Email</td> */}
          <td className="fw-bold" colSpan={2}>
            Voters
          </td>
        </tr>
        {voters.map((currentPerson) => {
          return (
            <tr key={currentPerson.id[0][0]}>
              <td className="text-start fw-bold" data-bs-dismiss="modal">
                <Link
                  to={"/profile/" + currentPerson.id[0][0]}
                  state={{ id: currentPerson.id[0][0] }}
                >
                  {currentPerson.username[0][0]}
                </Link>
              </td>
              <td className="text-end">
                <img
                  src={decodeURIComponent(currentPerson.img[0][0])}
                  className="img-thumbnail "
                  style={linkStyle.iconimage}
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
      <div className={"col-" + String(props.col) + " mb-3"}>{cardBody()}</div>

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

      {/* {isViewerOpen && (
        <ImageViewer
          src={[props.link]}
          currentIndex={0}
          disableScroll={true}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.8)"
          }}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )} */}

      {/* <div
        className="modal fade"
        id={props.title[0] + props.contentID}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {props.title}
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
                src={image}
                className="img-thumbnail"
                style={linkStyle.modalimage}

                // alt={user.username}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-theme"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div> */}

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

      <div
        className="modal fade"
        id={props.title[0] + props.contentID + "delete"}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Delete Content
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are You Sure?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-theme"
                data-bs-dismiss="modal"
                value={props.contentID}
                onClick={deletecontent}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
