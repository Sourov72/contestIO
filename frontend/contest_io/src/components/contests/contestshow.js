import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ContestParticipantSearch } from "./contestParticipantsSearch";
import { participantValueToType, obj2str } from "../helperFunctions";
import { Search } from "../search.component";
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
            <div className="btn-group-vertical " role="group">
              <button
                type="submit"
                className="btn btn-primary my-2"
                onClick={general}
              >
                General
              </button>

              <button
                type="submit"
                className="btn btn-primary my-2"
                onClick={timeschedule}
              >
                Time schedule
              </button>

              <button
                type="submit"
                className="btn btn-primary my-2"
                onClick={contesttype}
              >
                Contest type
              </button>

              <button
                type="submit"
                className="btn btn-primary my-2"
                onClick={contestmedia}
              >
                Contest Media
              </button>

              {userType.includes("HOST") ? (
                <>
                  {console.log("contestidd ", contestID)}
                  <Link
                    to="/contestaddcategory"
                    state={{ contestID: contestID }}
                  >
                    <button className="btn btn-danger px-4 my-2">
                      Add Category
                    </button>
                  </Link>
                  <Link to="" state={{}}>
                    <button className="btn btn-danger px-4 my-2">
                      Edit Contest
                    </button>
                  </Link>

                  <button
                    type="submit"
                    className="btn btn-primary my-2"
                    onClick={contestvoter}
                  >
                    Voter List
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary my-2"
                    onClick={contestparticipant}
                  >
                    Participant List
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary my-2"
                    onClick={contestjury}
                  >
                    Jury List
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary my-2"
                    onClick={voteradd}
                  >
                    New Voter Add
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary my-2"
                    onClick={contestantadd}
                  >
                    New Contestant Add
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary my-2"
                    onClick={juryadd}
                  >
                    New Jury Member Add
                  </button>
                </>
              ) : (
                <div> </div>
              )}
{/* 
              {!userType.includes("FOLLOWER") && !userType.includes("BLOCKED") && (
                <>
                  <Link
                    to="/"
                    state={{
                      contestID: contestID,
                      contesttype: contest.objective,
                    }}
                  >
                    <button className="btn btn-danger px-4 my-2">
                      Participate
                    </button>
                  </Link>
                </>
              )} */}
              {console.log("user tyep", userType)}
              {userType.includes("FOLLOWER") && (
                <>
                  <Link
                    to="/uploadcontentshow"
                    state={{ contestID: contestID, userType: userType }}
                  >
                    <button className="btn btn-danger px-4 my-2">
                      See Contents
                    </button>
                  </Link>
                </>
              )}
              {userType.includes("CONTESTANT") && (
                <>
                  <Link
                    to="/contestcontentadd"
                    state={{
                      contestID: contestID,
                      contesttype: contest.objective,
                    }}
                  >
                    <button className="btn btn-danger px-4 my-2">
                      Add Contents
                    </button>
                  </Link>
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
                          <label htmlFor="inputEmail4" className="form-label">
                            Contest Title
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.title}
                          </div>

                          <label
                            htmlFor="inputEmail4"
                            className="form-label my-3"
                          >
                            About Contest
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.description}
                          </div>

                          <label
                            htmlFor="inputEmail4"
                            className="form-label my-3"
                          >
                            Vote weight
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.voteWeight}
                          </div>

                          <label
                            htmlFor="inputEmail4"
                            className="form-label my-3"
                          >
                            Jury Vote Weight
                          </label>
                          <div className="form-control form-control-sm">
                            {contest.juryVoteWeight}
                          </div>
                          <div className="my-3">
                            <label
                              className="form-check-label "
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
                        <label htmlFor="inputEmail4" className="form-label">
                          Registration Start time
                        </label>
                        <div className="form-control form-control-sm">
                          {dateconver(contest.startTime)}
                        </div>

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
                        >
                          Registration End time
                        </label>
                        <div className="form-control form-control-sm">
                          {dateconver(contest.registrationEndTime)}
                        </div>

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
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
                          className="form-label my-3"
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
                        <label htmlFor="inputEmail4" className="form-label">
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
                        <label htmlFor="inputEmail4" className="form-label">
                          Contest Objective
                        </label>
                        <div className="form-control form-control-sm">
                          {contest.objective}
                        </div>
                      </div>
                      {/* <button
                        type="submit"
                        onClick={EditContest}
                        className="btn btn-primary"
                      >
                        Edit Contest
                      </button> */}
                    </>
                  );
                }

                if (comp.voterlist === true) {
                  return (
                    <ContestParticipantSearch
                      type="voterlist"
                      contestID={contestID}
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

                  return <Search contestID={contestID} type={"voteradd"} />;
                }
                if (comp.newparticipantadd === true) {
                  console.log("helo there new voter add");

                  return (
                    <Search contestID={contestID} type={"contestantadd"} />
                  );
                }
                if (comp.newjuryadd === true) {
                  console.log("helo there new voter add");

                  return <Search contestID={contestID} type={"juryadd"} />;
                }
              })()}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
