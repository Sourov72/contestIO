import React, { useEffect, useState, useRef } from "react";

export const CreateContest = () => {
  var today, mm, dd, yyyy;

  const [comp, setcomp] = useState({
    generalcom: true,
    timeschedulecom: false,
    contesttypecom: false,
    contestmediacom: false,
  });

  const [contest, setcontest] = useState({
    contestname: "",
    contestabout: "",
    conteststarttime: "",
    contestendtime: "",
    contesttype: "Private",
    contestobjective: "Photo Contest",
    contestparticipant: '',
    contestvoter: '',
    contestjury: '',
  });

  useEffect(() => {
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
  }, []);

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
    console.log("hello there contest type", contest.contesttype);
    setcomp({ contesttypecom: true });
  }

  function contestmedia() {
    console.log("hello there contest media");
    setcomp({ contestmediacom: true });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setcontest({
      ...contest,
      [name]: value,
    });
  };

  const participantfileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded participant file", upload_file);

    setcontest({
      ...contest,
      contestparticipant: upload_file.name,
    });

    console.log("setted file", contest.contestparticipant);
  };

  const voterfileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded voterfile file", upload_file);

    setcontest({
      ...contest,
      contestvoter: upload_file.name,
    });

    console.log("setted file", contest.contestvoter);
  };

  const juryfileHandle = (e) => {
    const upload_file = e.target.files[0];
    console.log("uploaded jury file", upload_file);

    setcontest({
      ...contest,
      contestjury: upload_file.name,
    });

    console.log("setted file", contest.contestjury);
  };

  return (
    <>
      <div className="container">
        <div className="row gx-3 gy-2">
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

          <div className="mx-5 col-9">
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
                          name="contestname"
                          onChange={handleChange}
                          value={contest.contestname}
                          className="form-control"
                          id="contestname"
                        />

                        <label htmlFor="inputEmail4" className="form-label my-3">
                          About Contest
                        </label>
                        <input
                          type="text"
                          name="contestabout"
                          onChange={handleChange}
                          value={contest.contestabout}
                          className="form-control"
                          id="contestabout"
                        />
                      </div>
                    </>
                  );
                }

                if (comp.timeschedulecom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label htmlFor="inputEmail4" className="form-label my-3">
                          Contest Start time
                        </label>
                        <input
                          type="date"
                          min={today}
                          name="conteststarttime"
                          onChange={handleChange}
                          value={contest.conteststarttime}
                          className="form-control"
                          id="conteststarttime"
                        />

                        <label htmlFor="inputEmail4" className="form-label my-3">
                          Contest End time
                        </label>
                        <input
                          type="date"
                          min={today}
                          name="contestendtime"
                          onChange={handleChange}
                          value={contest.contestendtime}
                          className="form-control"
                          id="contestendtime"
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
                          name="contesttype"
                          onChange={handleChange}
                          value={contest.contesttype}
                          id="contesttype"
                        >
                          <option>Private</option>
                          <option>Public</option>
                          <option>Open</option>
                        </select>

                        <div >
                          <label htmlFor="formFileSm1" className="form-label my-3">
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

                        <div style={{ display: contest.contesttype === "Private" || contest.contesttype === "Public" ? 'block' : 'none' }}>
                          <label htmlFor="formFileSm1" className="form-label my-3">
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



                        <div style={{ display: contest.contesttype === "Private" ? 'block' : 'none' }}>
                          <label htmlFor="formFileSm1" className="form-label my-3">
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
                          name="contestobjective"
                          onChange={handleChange}
                          value={contest.contestobjective}
                          id="contestobjective"
                        >
                          <option>Photo Contest</option>
                          <option>Video Contest</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">
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
