import React, { useEffect, useState } from "react";
import axios from "axios";

export const CreateContest = () => {
  var today, mm, dd, yyyy;
  let id = "12";

  const [comp, setcomp] = useState({
    generalcom: true,
    timeschedulecom: false,
    contesttypecom: false,
    contestmediacom: false,
  });

  const [contest, setcontest] = useState({
    hostID: "",
    title: "",
    type: "Private",
    objective: "Photo Contest",
    description: "",
    voteWeight: 2,
    juryVoteWeight: 5,
    voterAnonymity: 1,
    startTime: "",
    registrationEndTime: new Date("2022-02-01").toJSON(),
    endTime: "",
  });

  const [lists, setlists] = useState({
    contestparticipant: "",
    contestvoter: "",
    contestjury: "",
  });

  // here id is send simpliflically not as a object
  today = new Date();
  dd = today.getDate();
  mm = today.getMonth() + 1;
  yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  today = String(yyyy + "-" + mm + "-" + dd);

  function general() {
    console.log("hello there general");

    setcomp({ generalcom: true });
  }

  function timeschedule() {
    console.log("date", today);
    // dd = today.getDate();
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

  const handleChange = (e) => {
    var { name, value } = e.target;


    if (name === "voterAnonymity") {

      if (e.target.checked) {
        value = 1
      }
      else {
        value = 0
      }

    }
    console.log(name, value);

    setcontest({
      ...contest,
      [name]: value,
    });
  };



  useEffect(() => {

    console.log("id bef: ", id);
    id = localStorage.getItem("id");
    console.log("I got the id:", id);
    setcontest({
      ...contest,
      hostID: localStorage.getItem("id"),
    });

  }, []);

  const createNewContest = (e) => {

    id = localStorage.getItem("id");
    console.log("id: ", id);
    e.preventDefault();



    console.log("hostid ", contest.hostID);


    alert("Contest Creation form posted");
    axios
      .post("http://localhost:5000/api/contests/create", contest)
      .then((res) => console.log(res));
    // window.location = "/";
  };

  const participantfileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded participant file", upload_file);

    setlists({
      ...lists,
      contestparticipant: upload_file.name,
    });

    console.log("setted file", lists.contestparticipant);
  };

  const voterfileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded voterfile file", upload_file);

    setlists({
      ...lists,
      contestvoter: upload_file.name,
    });

    console.log("setted file", lists.contestvoter);
  };

  const juryfileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded jury file", upload_file);

    setlists({
      ...lists,
      contestjury: upload_file.name,
    });

    console.log("setted file", lists.contestjury);
  };

  return (
    <>
      <div className="container">
        <div className="row gx-3 gy-2 mt-2">
          <div className="col-2 btn-group-vertical " role="group">
            {/* <button onClick={() => {
        console.log("hello")
        return (
            <>
              <div className="col-sm-9">
                <button type="submit" className="btn btn-primary">
                  in general gui
                </button>
              </div>
            </>
          );
      }}>
      Click me!
    </button> */}

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
          </div>

          <div className="col-9">
            <form>
              {(() => {
                if (comp.generalcom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label htmlFor="inputEmail4" className="form-label">
                          Set Contest Name
                        </label>
                        <input
                          type="text"
                          name="title"
                          onChange={handleChange}
                          value={contest.title}
                          className="form-control"
                          id="title"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
                        >
                          About Contest
                        </label>
                        <input
                          type="text"
                          name="description"
                          onChange={handleChange}
                          value={contest.description}
                          className="form-control"
                          id="description"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
                        >
                          Vote weight
                        </label>
                        <input
                          type="number"
                          name="voteWeight"
                          onChange={handleChange}
                          value={contest.voteWeight}
                          className="form-control"
                          id="voteWeight"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
                        >
                          Jury Vote Weight
                        </label>
                        <input
                          type="number"
                          name="juryVoteWeight"
                          onChange={handleChange}
                          value={contest.juryVoteWeight}
                          className="form-control"
                          id="juryVoteWeight"
                        />
                        <div className="my-3">
                          <label className="form-check-label " htmlFor="voterAnonymity">
                            Anonymous
                          </label>

                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="voterAnonymity"
                            onChange={handleChange}
                            id="voterAnonymity"
                          />

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
                          className="form-label my-3"
                        >
                          Registration Start time
                        </label>
                        <input
                          type="date"
                          min={today}
                          name="startTime"
                          onChange={handleChange}
                          value={contest.startTime}
                          className="form-control"
                          id="startTime"
                        />


                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
                        >
                          Registration End time
                        </label>
                        <input
                          type="date"
                          min={today}
                          name="registrationEndTime"
                          onChange={handleChange}
                          value={contest.registrationEndTime}
                          className="form-control"
                          id="registrationEndTime"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label my-3"
                        >
                          Contest End time
                        </label>
                        <input
                          type="date"
                          min={today}
                          name="endTime"
                          onChange={handleChange}
                          value={contest.endTime}
                          className="form-control"
                          id="endTime"
                        />
                      </div>
                    </>
                  );
                }

                if (comp.contesttypecom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label htmlFor="inputEmail4" className="form-label">
                          Set Contest Type
                        </label>
                        <select
                          className="form-select"
                          name="type"
                          onChange={handleChange}
                          value={contest.type}
                          id="type"
                        >
                          <option>Private</option>
                          <option>Public</option>
                          <option>Open</option>
                        </select>

                        <div>
                          <label
                            htmlFor="formFileSm1"
                            className="form-label my-3"
                          >
                            Jury File Upload
                          </label>
                          <input
                            className="form-select"
                            type="file"
                            onChange={juryfileHandle}
                          // ref={partifile}
                          // id="partifile"
                          // name="partifile"
                          />
                        </div>

                        <div
                          style={{
                            display:
                              contest.type === "Private" ||
                                contest.type === "Public"
                                ? "block"
                                : "none",
                          }}
                        >
                          <label
                            htmlFor="formFileSm1"
                            className="form-label my-3"
                          >
                            Participant File Upload
                          </label>
                          <input
                            className="form-select"
                            type="file"
                            onChange={participantfileHandle}
                          // ref={partifile}
                          // id="partifile"
                          // name="partifile"
                          />
                        </div>

                        <div
                          style={{
                            display:
                              contest.type === "Private" ? "block" : "none",
                          }}
                        >
                          <label
                            htmlFor="formFileSm1"
                            className="form-label my-3"
                          >
                            Voter File Upload
                          </label>
                          <input
                            className="form-select"
                            type="file"
                            onChange={voterfileHandle}
                          // ref={partifile}
                          // id="partifile"
                          // name="partifile"
                          />
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
                          Set Contest Objective
                        </label>
                        <select
                          className="form-select"
                          name="objective"
                          onChange={handleChange}
                          value={contest.objective}
                          id="objective"
                        >
                          <option>Photo Contest</option>
                          <option>Video Contest</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        onClick={createNewContest}
                        className="btn btn-primary"
                      >
                        Create Contest
                      </button>
                    </>
                  );
                }
              })()}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
