import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ContestParticipantSearch } from "./contestParticipantsSearch";
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
  const location = useLocation();
  const [userType, setUserType] = useState("");
  const [startdate, setstartdate] = useState();

  const [comp, setcomp] = useState({
    generalcom: true,
    timeschedulecom: false,
    contesttypecom: false,
    contestmediacom: false,
    voterlist: false,
    participantlist: false,
    jurylist: false,
    categoryadd: false,
    newvoteradd: false,
    newparticipantadd: false,
    newjuryadd: false,
    blockuser: false,
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
  });

  const [lists, setlists] = useState({
    contestparticipant: "",
    contestvoter: "",
    contestjury: "",
  });

  // here id is send simpliflically not as a object

  function general() {
    setcomp({ generalcom: true });
  }

  function timeschedule() {
    setcomp({ timeschedulecom: true });
  }

  function contesttype() {
    setcomp({ contesttypecom: true });
  }

  function contestmedia() {
    setcomp({ contestmediacom: true });
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

  function juryadd() {
    setcomp({ newjuryadd: true });
  }

  function blockuser(){
    setcomp({ blockuser: true });
  }

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
        });

        setstartdate(
          new Date(Date.parse(res.data.registrationEndTime) + 86400000)
        );
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
          console.log("participants", res.data.participants);
          let types = participantValueToType(res.data.participants[0]["type"]);

          setUserType(types);
        } else {
          setUserType("");
        }
        // console.log("participant types:", types);
      });
  }, [contestID]);

  function dateconver(date) {
    var myDate = new Date(Date.parse(date));

    var output =
      myDate.getDate() +
      "\\" +
      (myDate.getMonth() + 1) +
      "\\" +
      myDate.getFullYear();

    return output;
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

  let source = "../images/" + "photo-contest-logo.png";
  var stylingObject = {
    image: {
      // width: 400,
      borderColor: "purple",
      borderWidth: 2,
      borderRadius: 10,
    },
  };

  return (
    <>
      <div className="container">
        <div className="row gx-3 gy-2 mt-2">
          <div className="col-2">
            <p className="text-center fw-bold mb-0">Information</p>
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

              <button
                type="submit"
                className="btn btn-theme my-2"
                onClick={contesttype}
              >
                Contest type
              </button>

              <button
                type="submit"
                className="btn btn-theme my-2"
                onClick={contestmedia}
              >
                Contest Media
              </button>
              {userType.includes("FOLLOWER") && (
                <>
                  <button className="btn btn-theme px-4 my-2">
                    <Link
                      to="/uploadcontentshow"
                      className="text-light"
                      state={{ contestID: contestID, userType: userType }}
                    >
                      See Contents
                    </Link>
                  </button>
                </>
              )}
            </div>
            {/* {console.log("usertype ", userType)} */}
            {userType.includes("HOST") && (
              <div className="d-flex flex-column justify-content-center">
                <p className="text-center fw-bold mb-0 mt-2">
                  Contestant Lists
                </p>
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
                  Participant List
                </button>

                <button
                  type="submit"
                  className="btn btn-theme my-2"
                  onClick={contestjury}
                >
                  Jury List
                </button>
              </div>
            )}

            <div className="d-flex flex-column justify-content-center">
              <p className="text-center fw-bold mb-0 mt-2">Options</p>
              {userType.includes("HOST") ? (
                <>
                  <button className="btn btn-theme my-2">
                    <Link
                      to="/contestaddcategory"
                      className="text-light"
                      state={{ contestID: contestID }}
                    >
                      Add Category
                    </Link>
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
              ) : (
                <div> </div>
              )}

              {!userType.includes("BLOCKED") && (
                <>
                {console.log("contest type", contest.type)}
                  {contest.type.includes("Open") &&
                    !userType.includes("CONTESTANT") && !userType.includes("HOST") && !userType.includes("JURY") && (
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

                  {contest.type.includes("Open") &&
                    !userType.includes("VOTER") && !userType.includes("JURY") && (
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

                  {contest.type.includes("Public") &&
                    !userType.includes("VOTER") && !userType.includes("JURY") && (
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
                </>
              )}

              {userType.includes("CONTESTANT") && (
                <>
                  <button className="btn btn-theme my-2">
                    <Link
                      to="/contestcontentadd"
                      className="text-light"
                      state={{
                        contestID: contestID,
                        contesttype: contest.objective,
                      }}
                    >
                      Add Contents
                    </Link>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="col-9">
            <form>
              {(() => {
                if (comp.generalcom === true) {
                  return (
                    <>
                      <div className="row">
                        <div className="mb-3 col-8">
                          <label
                            htmlFor="inputEmail4"
                            className="form-label fw-bold"
                          >
                            Title
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.title}
                          </div>

                          <label
                            htmlFor="inputEmail4"
                            className="form-label my-3 fw-bold"
                          >
                            About
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.description}
                          </div>

                          <label
                            htmlFor="inputEmail4"
                            className="form-label my-3 fw-bold"
                          >
                            Vote weight
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.voteWeight}
                          </div>

                          <label
                            htmlFor="inputEmail4"
                            className="form-label my-3 fw-bold"
                          >
                            Jury Vote Weight
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.juryVoteWeight}
                          </div>
                          <div className="my-3">
                            <label
                              className="form-check-label fw-bold"
                              htmlFor="voterAnonymity"
                            >
                              Anonymous
                            </label>

                            <div
                              style={{
                                display:
                                  contest.voterAnonymity === 1
                                    ? "block"
                                    : "none",
                              }}
                              className="form-control form-control-sm"
                            >
                              Yes
                            </div>

                            <div
                              style={{
                                display:
                                  contest.voterAnonymity === 0
                                    ? "block"
                                    : "none",
                              }}
                              className="form-control form-control-sm"
                            >
                              No
                            </div>
                          </div>
                        </div>
                        <div className="mb-3 col-4 ">
                          {/* <img src={require(`../images/${user.img}`)} className="img-thumbnail" alt="..."></img> */}

                          {/* <img src={source} alt="no image"/> */}
                          <img
                            src={source}
                            className=" img-thumbnail"
                            style={stylingObject.image}
                            alt="..."
                          ></img>
                          <div htmlFor="formFileSm" className="form-label">
                            Contest Logo
                          </div>
                        </div>
                      </div>
                    </>
                  );
                }

                if (comp.timeschedulecom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold"
                        >
                          Registration Start time
                        </label>
                        <div className="form-control form-control-sm">
                          {dateconver(contest.startTime)}
                        </div>

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3 fw-bold"
                        >
                          Registration End time
                        </label>
                        <div className="form-control form-control-sm">
                          {dateconver(contest.registrationEndTime)}
                        </div>

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3 fw-bold"
                        >
                          Contest Start time
                        </label>
                        <div className="form-control form-control-sm">
                          {console.log("inhtml", startdate)}
                          {startdate.getDate() +
                            "\\" +
                            (startdate.getMonth() + 1) +
                            "\\" +
                            startdate.getFullYear()}
                        </div>

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3 fw-bold"
                        >
                          Contest End time
                        </label>
                        <div className="form-control form-control-sm">
                          {dateconver(contest.endTime)}
                        </div>
                      </div>
                    </>
                  );
                }

                if (comp.contesttypecom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold"
                        >
                          Contest Type
                        </label>
                        <div className="form-control form-control-sm">
                          {contest.type}
                        </div>
                      </div>
                    </>
                  );
                }

                if (comp.contestmediacom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold"
                        >
                          Contest Objective
                        </label>
                        <div className="form-control form-control-sm">
                          {contest.objective}
                        </div>
                      </div>
                      <button
                        type="submit"
                        onClick={EditContest}
                        className="btn btn-theme"
                      >
                        Edit Contest
                      </button>
                    </>
                  );
                }

                if (comp.voterlist === true) {
                  return (
                    <ContestParticipantSearch
                      type="voterlist"
                      contestID={contestID}
                      hostID = {contest.hostID}
                    />
                  );
                }

                if (comp.participantlist === true) {
                  return (
                    <ContestParticipantSearch
                      type="participantlist"
                      contestID={contestID}
                    />
                  );
                }

                if (comp.jurylist === true) {
                  return (
                    <ContestParticipantSearch
                      type="jurylist"
                      contestID={contestID}
                    />
                  );
                }

                if (comp.newvoteradd === true) {
                  console.log("helo there new voter add");

                  return <Search contestID={contestID} type={"voteradd"} hostID = {contest.hostID}/>;
                }
                if (comp.newparticipantadd === true) {
                  console.log("helo there new voter add");

                  return (
                    <Search contestID={contestID} type={"contestantadd"} hostID = {contest.hostID}/>
                  );
                }
                if (comp.newjuryadd === true) {
                  console.log("helo there new voter add");

                  return <Search contestID={contestID} type={"juryadd"} hostID = {contest.hostID}/>;
                }

                if (comp.blockuser === true) {
                  console.log("helo there new block user add");

                  return <Search contestID={contestID} type={"blockuser"} hostID = {contest.hostID}/>;
                }
              })()}
            </form>
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
                  Join as Participant
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
                  className="btn btn-primary"
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
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  onClick={participateAsVoter}
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
