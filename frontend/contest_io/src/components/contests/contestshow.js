import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ContestParticipantSearch } from "./contestParticipantsSearch";
import { participantValueToType, obj2str } from "../helperFunctions";
import { Search } from "../search.component";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const ContestShow = (props) => {
  const token = cookies.get("TOKEN");
  const [idd, setidd] = useState("0");
  const location = useLocation();
  const [userid, setuserid] = useState("0");
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
    console.log("hello there general");
    setcomp({ generalcom: true });
  }

  function timeschedule() {
    console.log("hello there time schedule");
    setcomp({ timeschedulecom: true });
  }

  function contesttype() {
    console.log("hello there contest type", contest.type);
    setcomp({ contesttypecom: true });
  }

  function contestmedia() {
    console.log("hello there contest media");
    setcomp({ contestmediacom: true });
  }

  function contestvoter() {
    console.log("hello there contest voter");
    setcomp({ voterlist: true });
  }

  function contestparticipant() {
    console.log("hello there contest participant");
    setcomp({ participantlist: true });
  }

  function contestjury() {
    console.log("hello there contest jury");
    setcomp({ jurylist: true });
  }

  function addcontestcategory() {
    console.log("hello there category add");
    setcomp({ categoryadd: true });
  }

  function voteradd() {
    console.log("hello there category add");
    setcomp({ newvoteradd: true });
  }

  useEffect(() => {
    const contestID = location.state.contestID;
    const uid = localStorage.getItem("id");

    // const contestID = props.contestID;
    console.log("contest id in contest show", contestID);
    setuserid( localStorage.getItem("id"));

    console.log("userID from useeffect", userid);

    setidd(userid);

    axios
      .get("http://localhost:5000/api/contests/contest/" + contestID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setcontest({
          hostID: res.data[0].hostID,
          title: res.data[0].title,
          type: res.data[0].type,
          objective: res.data[0].objective,
          description: res.data[0].description,
          voteWeight: res.data[0].voteWeight,
          juryVoteWeight: res.data[0].juryVoteWeight,
          voterAnonymity: res.data[0].voterAnonymity,
          startTime: res.data[0].startTime,
          registrationEndTime: res.data[0].registrationEndTime,
          endTime: res.data[0].endTime,
        });

        setstartdate(
          new Date(Date.parse(res.data[0].registrationEndTime) + 86400000)
        );
      });
    var q = [{ userID: ["eq", uid] }];
    const query = obj2str(q);
    axios
      .get(`http://localhost:5000/api/participants/query?${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log("current participant:", res.data.participants);
        let types = participantValueToType(res.data.participants[0]["type"]);
        console.log("participant types:", types);
        setUserType(types);
      });
  }, [location, userid]);

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

              {/* {(() => {
                if (userid !== "0") {
 

                    <>
                      {

                        <button
                          type="submit"
                          className="btn btn-primary my-2"
                          onClick={addcontestcategory}
                        >
                          Add Category
                        </button>
                      }
                    </>

                  
                }
              })} */}
              {console.log(idd, "in fjskfja")}

              {userType.includes("HOST") ? (
                <>
                  <Link
                    to="/contestaddcategory"
                    state={{ catcontestID: location.state.contestID }}
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
                </>
              ) : (
                <div> </div>
              )}

              {userType.length === 0 && (
                <>
                  <Link
                    to="/contestcontentadd"
                    state={{
                      contentcontestID: location.state.contestID,
                      contesttype: contest.objective,
                    }}
                  >
                    <button className="btn btn-danger px-4 my-2">
                      Participate
                    </button>
                  </Link>
                </>
              )}
              {!userType.includes("BLOCKED") && (
                <>
                  <Link to="/uploadcontentshow" state={{ contestID: location.state.contestID }}>
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
                      contentcontestID: location.state.contestID,
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
                      <button
                        type="submit"
                        onClick={EditContest}
                        className="btn btn-primary"
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
                      contestID={location.state.contestID}
                    />
                  );
                }

                if (comp.participantlist === true) {
                  return (
                    <ContestParticipantSearch
                      type="participantlist"
                      contestID={location.state.contestID}
                    />
                  );
                }

                if (comp.jurylist === true) {
                  return (
                    <ContestParticipantSearch
                      type="jurylist"
                      contestID={location.state.contestID}
                    />
                  );
                }

                if (comp.newvoteradd === true) {
                  console.log("helo there new voter add");

                  return <Search contestvoteaddID={location.state.contestID} />;
                }
              })()}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
