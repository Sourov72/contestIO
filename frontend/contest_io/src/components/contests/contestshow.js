import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ContestParticipantSearch } from "./contestParticipantsSearch";
import { ContestContentAdd } from "./contestcontent";
import { ContestCategoryAdd } from "./category";
import { UploadedContentsShow } from "../contents/uploadedcontentsshow";
import { ContestResult } from "./contestResult";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import {
  participantValueToType,
  obj2str,
  participantTypeToValue,
} from "../helperFunctions";
import { Search } from "../add_participant_search";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const ContestShow = () => {
  const { contestID } = useParams();
  const token = cookies.get("TOKEN");
  const [userType, setUserType] = useState("");

  const [comp, setcomp] = useState({
    generalcom: true,
    timeschedulecom: false,
    voterlist: false,
    participantlist: false,
    jurylist: false,
    categoryadd: false,
    contentadd: false,
    contentshow: false,
    newvoteradd: false,
    newparticipantadd: false,
    newjuryadd: false,
    blockuser: false,
    resultshow: false,
    leavecontest: false,
  });

  const [contest, setcontest] = useState({
    hostID: "",
    title: "",
    type: "",
    objective: "",
    description: "",
    voteWeight: 2,
    juryVoteWeight: 5,
    voterAnonymity: 1,
    startTime: "",
    registrationEndTime: "",
    endTime: "",
    img: "",
  });

  function general() {
    setcomp({ generalcom: true });
  }

  function timeschedule() {
    setcomp({ timeschedulecom: true });
  }

  function contestvoter() {
    setcomp({ voterlist: true });
  }

  function contestparticipant() {
    setcomp({ participantlist: true });
  }

  function contestjury() {
    setcomp({ jurylist: true });
  }

  function addcontestcategory() {
    setcomp({ categoryadd: true });
  }

  function voteradd() {
    setcomp({ newvoteradd: true });
  }

  function contestantadd() {
    setcomp({ newparticipantadd: true });
  }
  function contentadd() {
    setcomp({ contentadd: true });
  }

  function contentshow() {
    setcomp({ contentshow: true });
  }

  function resultshow() {
    setcomp({ resultshow: true });
  }

  function juryadd() {
    setcomp({ newjuryadd: true });
  }

  function blockuser() {
    setcomp({ blockuser: true });
  }

  const leavecontest = async (e) => {
    e.preventDefault();
    setcomp({ leavecontest: true });

    console.log("clicked", localStorage.getItem("id"), contestID);

    const participant = {
      userID: localStorage.getItem("id"),
      contestID: contestID,
    };

    await axios
      .delete("http://localhost:5000/api/participants/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: participant,
      })
      .then((res) => {
        console.log("res body in participant Left", res.data);
        window.location = "/";
      });
  };

  useEffect(() => {
    const uid = localStorage.getItem("id");

    axios
      .get("http://localhost:5000/api/contests/contest/" + contestID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setcontest({
          hostID: res.data.hostID,
          title: res.data.title,
          type: res.data.type,
          objective: res.data.objective,
          description: res.data.description,
          voteWeight: res.data.voteWeight,
          juryVoteWeight: res.data.juryVoteWeight,
          voterAnonymity: res.data.voterAnonymity,
          startTime: res.data.startTime,
          registrationEndTime: res.data.registrationEndTime,
          endTime: res.data.endTime,
          img: decodeURIComponent(res.data.img),
        });
      });
    var q = [{ userID: ["eq", uid] }, { contestID: ["eq", contestID] }];
    const query = obj2str(q);
    console.log("qure", query);
    axios
      .get(`http://localhost:5000/api/participants/query?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.participants.length !== 0) {
          // console.log("participants", res.data.participants);
          let types = participantValueToType(res.data.participants[0]["type"]);

          setUserType(types);
        } else {
          setUserType("");
        }
        // console.log("participant types:", types);
      });
  }, [contestID]);

  function dateconver(date, op, inc = 0) {
    var myDate = new Date(Date.parse(date));
    myDate.setDate(myDate.getDate() + inc);
    if (op === "date") {
      return myDate.getDate();
    }
    if (op === "month") {
      return myDate.getMonth();
    }
    if (op === "year") {
      return myDate.getFullYear();
    }
  }

  const EditContest = (e) => {
    // id = localStorage.getItem("id");
    // console.log("id: ", id);
    // e.preventDefault();
    // console.log("hostid ", contest.hostID);
    // alert("Contest Creation form posted");
    // axios
    //   .post("http://localhost:5000/api/contests/create", contest)
    //   .then((res) => console.log(res));
    // window.location = "/";
  };

  const participateAsParticipant = async (e) => {
    e.preventDefault();

    console.log("participant add bro");

    const participant = {
      userID: localStorage.getItem("id"),
      contestID: contestID,
      type: participantTypeToValue("contestant", "voter", "follower"),
    };
    console.log("contest id", contestID);
    console.log("participant", participant);

    await axios
      .post("http://localhost:5000/api/participants/create", participant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res body in participant creation", res.data);
      });

    var q = [
      { userID: ["eq", localStorage.getItem("id")] },
      { contestID: ["eq", contestID] },
    ];
    const query = obj2str(q);
    console.log("qure in participant add", query);
    axios
      .get(`http://localhost:5000/api/participants/query?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.participants.length !== 0) {
          console.log("participants", res.data.participants);
          let types = participantValueToType(res.data.participants[0]["type"]);

          setUserType(types);
        } else {
          setUserType("");
        }
        // console.log("participant types:", types);
      });
  };

  const participateAsVoter = async (e) => {
    e.preventDefault();

    console.log("voter add bro");

    const participant = {
      userID: localStorage.getItem("id"),
      contestID: contestID,
      type: participantTypeToValue("voter", "follower"),
    };
    console.log("contest id", contestID);
    console.log("participant", participant);

    await axios
      .post("http://localhost:5000/api/participants/create", participant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res body in participant creation", res.data);
      });

    var q = [
      { userID: ["eq", localStorage.getItem("id")] },
      { contestID: ["eq", contestID] },
    ];
    const query = obj2str(q);
    console.log("qure in participant add", query);
    axios
      .get(`http://localhost:5000/api/participants/query?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.participants.length !== 0) {
          console.log("participants", res.data.participants);
          let types = participantValueToType(res.data.participants[0]["type"]);

          setUserType(types);
        } else {
          setUserType("");
        }
        // console.log("participant types:", types);
      });
  };

  const getBadges = () => {
    const today = new Date();
    const endDay = new Date(contest.endTime);
    const regEndDay = new Date(contest.registrationEndTime);
    return (
      <>
        {/* contest types */}
        {contest.type === "Public" && (
          <span className="badge rounded-pill bg-success me-1">Public</span>
        )}
        {contest.type === "Private" && (
          <span className="badge rounded-pill bg-danger  me-1">Private</span>
        )}
        {contest.type === "Open" && (
          <span className="badge rounded-pill bg-info text-dark me-1 ">
            Open
          </span>
        )}

        {/* contest times */}
        {endDay < today && (
          <span className="badge rounded-pill bg-light text-dark me-1 ">
            Finished
          </span>
        )}
        {regEndDay <= today && today < endDay && (
          <span className="badge rounded-pill bg-warning text-dark me-1 ">
            Ongoing
          </span>
        )}
        {regEndDay > today && (
          <span className="badge rounded-pill bg-primary me-1 ">Upcoming</span>
        )}

        {/* anonymity */}
        {contest.voterAnonymity === 1 && (
          <span className="badge rounded-pill bg-secondary me-1">
            Anonymous
          </span>
        )}
      </>
    );
  };

  let source = "../images/contest-banner.jpg";
  var stylingObject = {
    image: {
      width: "100%",
      height: "200px",
      objectFit: "cover",
      borderColor: "purple",
      borderWidth: 2,
      borderRadius: 10,
    },
  };

  return (
    <>
      <div className="container">
        <div className="row gx-3 gy-2 mt-2">
          <div className="col-3">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingOne">
                  <button
                    className="accordion-button text-center fw-bold"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Information
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  className="accordion-collapse collapse show"
                  aria-labelledby="headingOne"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <div className="d-flex flex-column justify-content-center">
                      <button
                        type="submit"
                        className="btn btn-theme my-2"
                        onClick={general}
                      >
                        General
                      </button>

                      <button
                        type="submit"
                        className="btn btn-theme my-2"
                        onClick={timeschedule}
                      >
                        Time schedule
                      </button>
                      {userType.includes("FOLLOWER") && (
                        <>
                          <button
                            type="submit"
                            className="btn btn-theme my-2"
                            onClick={contentshow}
                          >
                            See Contents
                          </button>
                          <button
                            type="submit"
                            className="btn btn-theme my-2"
                            onClick={resultshow}
                          >
                            See Results
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* {console.log(userType)} */}
              {token && userType.includes("HOST") && (
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed text-center fw-bold"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      Contestants
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="d-flex flex-column justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-theme my-2"
                          onClick={contestvoter}
                        >
                          Voter List
                        </button>

                        <button
                          type="submit"
                          className="btn btn-theme my-2"
                          onClick={contestparticipant}
                        >
                          Contestant List
                        </button>

                        <button
                          type="submit"
                          className="btn btn-theme my-2"
                          onClick={contestjury}
                        >
                          Jury List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {token &&  !userType.includes("BLOCKED") && (
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed text-center fw-bold"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      Options
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <div className="d-flex flex-column justify-content-center">
                        {token && userType.includes("HOST") && (
                          <>
                            <button
                              type="submit"
                              className="btn btn-theme my-2"
                              onClick={addcontestcategory}
                            >
                              Add Category
                            </button>
                            <button className="btn btn-theme my-2">
                              <Link to="" state={{}} className="text-light">
                                Edit Contest
                              </Link>
                            </button>

                            <button
                              type="submit"
                              className="btn btn-theme my-2"
                              onClick={voteradd}
                            >
                              Add Voters
                            </button>

                            <button
                              type="submit"
                              className="btn btn-theme my-2"
                              onClick={contestantadd}
                            >
                              Add Contestants
                            </button>

                            <button
                              type="submit"
                              className="btn btn-theme my-2"
                              onClick={juryadd}
                            >
                              Add Jury
                            </button>

                            <button
                              type="submit"
                              className="btn btn-danger my-2"
                              onClick={blockuser}
                            >
                              Block Users
                            </button>
                          </>
                        )}

                        {token && userType.includes("CONTESTANT") && (
                          <>
                            <button
                              type="submit"
                              className="btn btn-theme my-2"
                              onClick={contentadd}
                            >
                              Add Contents
                            </button>
                          </>
                        )}

                        {token && !userType.includes("BLOCKED") && (
                          <>
                            {contest.type.includes("Open") &&
                              !userType.includes("CONTESTANT") &&
                              !userType.includes("VOTER") &&
                              !userType.includes("HOST") &&
                              !userType.includes("JURY") && (
                                <>
                                  <button
                                    className="btn btn-warning my-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#asParticipant"
                                  >
                                    Participate as Contestant
                                  </button>
                                </>
                              )}

                            {(contest.type.includes("Open") ||
                              contest.type.includes("Public")) &&
                              !userType.includes("VOTER") &&
                              !userType.includes("CONTESTANT") &&
                              !userType.includes("JURY") && (
                                <>
                                  <button
                                    className="btn btn-warning my-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#asVoter"
                                  >
                                    Participate as Voter
                                  </button>
                                </>
                              )}

                            {userType.length !== 0 &&
                              !userType.includes("HOST") && (
                                <>
                                  <button
                                    className="btn btn-danger my-2 fw-bold"
                                    data-bs-toggle="modal"
                                    data-bs-target="#asLeaver"
                                  >
                                    Leave Contest
                                  </button>
                                </>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {comp.resultshow === true && (
              <img
                src={"../images/party-popper.gif"}
                className="img-thumbnail my-2"
                style={{
                  // height: "200px",
                  border: "none",
                }}
              />
            )}
          </div>

          <div className="col-9">
            <div className="row">
              <div className="col-5">
                <div className="d-flex flex-column">
                  <h1 className="fw-bold">{contest.title}</h1>
                  <h4 className="text-left">{contest.objective}</h4>
                </div>
                <h4 className="badges float-left">{getBadges()}</h4>
              </div>
              <div className="col-7">
                <PhotoProvider maskOpacity={0.8} bannerVisible={false}>
                  <PhotoView src={contest.img}>
                    <img
                      src={contest.img}
                      className=" img-thumbnail"
                      style={stylingObject.image}
                      alt="..."
                    />
                  </PhotoView>
                </PhotoProvider>
              </div>
            </div>
            <>
              {(() => {
                if (comp.generalcom === true) {
                  return (
                    <>
                      <div>
                        <div className="row">
                          <div className="col-12">
                            <h4 className="mt-3 mb-0 fw-bold">About</h4>
                            <p>{contest.description}</p>
                          </div>
                          <div className="col-12">
                            <h4 className=" mb-0 fw-bold mb-2">Vote Weight</h4>
                            <div className="row">
                              <div className="col-12">
                                <h3>
                                  <span className="badge text-bg-warning me-1">
                                    Voter:{contest.voteWeight}
                                  </span>
                                  <span className="badge text-bg-danger me-1">
                                    Jury:{contest.juryVoteWeight}
                                  </span>
                                </h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }

                if (comp.timeschedulecom === true) {
                  return (
                    <>
                      <div className="row mt-3">
                        <div className="col-3 d-flex flex-column text-center justify-content-center">
                          <h4 className="mt-3 mb-0 fw-bold">
                            Registration Starts
                          </h4>
                          <h3>
                            <span className="badge text-bg-success me-1">
                              {dateconver(contest.startTime, "date")}
                            </span>
                            <span className="badge text-bg-success me-1">
                              {dateconver(contest.startTime, "month")}
                            </span>
                            <span className="badge text-bg-success me-1">
                              {dateconver(contest.startTime, "year")}
                            </span>
                          </h3>
                        </div>
                        <div className="col-3 d-flex flex-column text-center justify-content-center">
                          <h4 className="mt-3 mb-0 fw-bold">
                            Registration Ends
                          </h4>
                          <h3>
                            <span className="badge text-bg-secondary me-1">
                              {dateconver(contest.registrationEndTime, "date")}
                            </span>
                            <span className="badge text-bg-secondary me-1">
                              {dateconver(contest.registrationEndTime, "month")}
                            </span>
                            <span className="badge text-bg-secondary me-1">
                              {dateconver(contest.registrationEndTime, "year")}
                            </span>
                          </h3>
                        </div>
                        <div className="col-3 d-flex flex-column text-center justify-content-center">
                          <h4 className="mt-3 mb-0 fw-bold">
                            Contest <br /> Starts
                          </h4>
                          <h3>
                            <span className="badge text-bg-info me-1">
                              {dateconver(
                                contest.registrationEndTime,
                                "date",
                                1
                              )}
                            </span>
                            <span className="badge text-bg-info me-1">
                              {dateconver(
                                contest.registrationEndTime,
                                "month",
                                1
                              )}
                            </span>
                            <span className="badge text-bg-info me-1">
                              {dateconver(
                                contest.registrationEndTime,
                                "year",
                                1
                              )}
                            </span>
                          </h3>
                        </div>
                        <div className="col-3 d-flex flex-column text-center justify-content-center">
                          <h4 className="mt-3 mb-0 fw-bold">
                            Contest <br /> Ends
                          </h4>
                          <h3>
                            <span className="badge text-bg-danger me-1">
                              {dateconver(contest.endTime, "date", 1)}
                            </span>
                            <span className="badge text-bg-danger me-1">
                              {dateconver(contest.endTime, "month", 1)}
                            </span>
                            <span className="badge text-bg-danger me-1">
                              {dateconver(contest.endTime, "year", 1)}
                            </span>
                          </h3>
                        </div>
                      </div>
                    </>
                  );
                }

                if (comp.voterlist === true) {
                  return (
                    <ContestParticipantSearch
                      type="voterlist"
                      placeholder="Search For Voters"
                      contestID={contestID}
                      hostID={contest.hostID}
                    />
                  );
                }

                if (comp.participantlist === true) {
                  return (
                    <ContestParticipantSearch
                      type="participantlist"
                      placeholder="Search For Contestants"
                      contestID={contestID}
                    />
                  );
                }

                if (comp.jurylist === true) {
                  return (
                    <ContestParticipantSearch
                      type="jurylist"
                      placeholder="Search For Jury"
                      contestID={contestID}
                    />
                  );
                }

                if (comp.newvoteradd === true) {
                  return (
                    <Search
                      contestID={contestID}
                      placeholder="Search For New Voters"
                      type={"voteradd"}
                      hostID={contest.hostID}
                    />
                  );
                }
                if (comp.newparticipantadd === true) {
                  return (
                    <Search
                      contestID={contestID}
                      placeholder="Search For New Contestants"
                      type={"contestantadd"}
                      hostID={contest.hostID}
                    />
                  );
                }
                if (comp.newjuryadd === true) {
                  return (
                    <Search
                      contestID={contestID}
                      placeholder="Search For New Jury"
                      type={"juryadd"}
                      hostID={contest.hostID}
                    />
                  );
                }

                if (comp.categoryadd === true) {
                  return <ContestCategoryAdd contestID={contestID} />;
                }

                if (comp.contentadd === true) {
                  return (
                    <ContestContentAdd
                      contestID={contestID}
                      contesttype={contest.objective}
                    />
                  );
                }

                if (comp.contentshow === true) {
                  return (
                    <UploadedContentsShow
                      contestID={contestID}
                      userType={userType}
                    />
                  );
                }

                if (comp.resultshow === true) {
                  return (
                    <ContestResult contestID={contestID} userType={userType} />
                  );
                }

                if (comp.blockuser === true) {
                  return (
                    <Search
                      contestID={contestID}
                      placeholder="Search Participants to Block"
                      type={"blockuser"}
                      hostID={contest.hostID}
                    />
                  );
                }
              })()}
            </>
          </div>
        </div>

        <div
          className="modal fade"
          id="asParticipant"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Join as Contestant
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
                  onClick={participateAsParticipant}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="asVoter"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Join as Voter
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
                  onClick={participateAsVoter}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="asLeaver"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Leave Contest
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
                  onClick={leavecontest}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
