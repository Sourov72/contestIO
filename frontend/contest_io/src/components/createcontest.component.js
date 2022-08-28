import React, { useEffect, useState } from "react";
import Compressor from "compressorjs";
import axios from "axios";
import {
  participantTypeToValue,
  uploadfile,
  deletefile,
} from "./helperFunctions";
import Cookies from "universal-cookie";
import { storage } from "../firebase";
import { ref } from "firebase/storage";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
const cookies = new Cookies();

export const CreateContest = () => {
  var today, mm, dd, yyyy;
  let id = "12";
  const token = cookies.get("TOKEN");

  const [comp, setcomp] = useState({
    generalcom: true,
    timeschedulecom: false,
    contesttypecom: false,
  });
  const [srcimg, setsrc] = useState("");

  const [imageUpload, setimageUpload] = useState("");
  const [prog, setProg] = useState(0)

  const [contest, setcontest] = useState({
    hostID: "",
    title: "",
    type: "Private",
    objective: "Photo Contest",
    description: "",
    voteWeight: 2,
    juryVoteWeight: 5,
    voterAnonymity: 0,
    startTime: "",
    registrationEndTime: "",
    endTime: "",
    img: "",
  });

  const [uploadshow, setuploadshow] = useState({	
    display: false,	
    displaytext: "",	
  });
  

  const [lists, setlists] = useState({
    contestant: [],
    voter: [],
    jury: [],
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

  function general(e) {
    e.preventDefault();
    setProg(0)
    setcomp({ generalcom: true });
  }

  function timeschedule(e) {
    e.preventDefault();
    setProg(33)
    setcomp({ timeschedulecom: true });
  }

  function contesttype(e) {
    e.preventDefault();
    setProg(66)
    setcomp({ contesttypecom: true });
  }

  const bannerfileHandle = async (e) => {
    const upload_file = e.target.files[0];
    new Compressor(upload_file, {
      quality: 0.2,
      success: (result) => {
        console.log("Hello, inside compressed, ", result.size);
        setimageUpload(result);
      },
    });
    console.log("uploaded file", upload_file);
    setsrc(URL.createObjectURL(upload_file));
    // console.log("setted file image ref", imageRef);
  };

  const handleChange = (e) => {
    var { name, value } = e.target;
    if (name === "voterAnonymity") {
      if (e.target.checked) {
        value = 1;
      } else {
        value = 0;
      }
    }
    // console.log(name, value);
    setcontest({
      ...contest,
      [name]: value,
    });
  };

  useEffect(() => {
    // console.log("id bef: ", id);
    id = localStorage.getItem("id");
    // console.log("I got the id:", id);
    setcontest({
      ...contest,
      hostID: localStorage.getItem("id"),
    });
  }, []);

  const uploadshowfunc = (e) => {	
    console.log("in time out");	
    // uploadshow.displaytext = "upload successfull";	
    setuploadshow({ display: true, displaytext: "UpLoading File" });	
    console.log(uploadshow.displaytext);	
  };

  const createNewContest = async (e) => {
    e.preventDefault();
    setProg(100)
    id = localStorage.getItem("id");
    let pictureRef = "";
    // console.log("img in isgnfdsf", imageUpload);
    // console.log("hostid ", contest.hostID);
    // console.log("contest", contest);
    if (imageUpload !== "") {
      const downloadURL = await uploadfile(imageUpload);
      contest.img = encodeURIComponent(downloadURL);
      // console.log("user img after", contest.img);
      pictureRef = await ref(storage, downloadURL);
    }

    axios
      .post("http://localhost:5000/api/contests/create", contest, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const host = {
          userID: localStorage.getItem("id"),
          contestID: res.data._id,
          type: participantTypeToValue("host", "voter", "follower"),
        };

        // console.log("object host type value", host.type);
        axios
          .post("http://localhost:5000/api/participants/create", host, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => console.log("host creation", res));
        const allLists = {
          ...lists,
          contestID: res.data._id,
        };
        axios
          .post("http://localhost:5000/api/participants/createAll", allLists, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => console.log("members creation", res));
        alert("Contest Creation success");
        window.location = "/";
      })
      .catch((error) => {
        setuploadshow({ display: false, displaytext: "" });
        alert("could not create contest, ", error);
        if (pictureRef !== "") {
          deletefile(pictureRef);
        }
      });
  };

  const fileHandle = (e) => {
    const upload_file = e.target.files[0];
    var name = e.target.name;
    // console.log("name: ", name);
    const reader = new FileReader();

    reader.onloadend = (e) => {
      const text = reader.result;
      const emails = text.split(/\r?\n/);
      // console.log('emails are: ',emails);
      // console.log('name is: ',name);

      setlists({
        ...lists,
        [name]: emails,
      });
      // console.log("the list: ", lists);
    };
    reader.readAsText(upload_file);
  };

  let source = "../../images/loading.gif";

  return (
    <>
      <div className="container">
        <h1 className=" text-center my-2">Create a New Contest</h1>
        <div className="row mt-2">
          <div className="col-3 ">
            <div className="d-flex flex-column justify-content-center mt-2">
              <button
                type="radio"
                className={
                  comp.generalcom || comp.timeschedulecom || comp.contesttypecom
                    ? "btn btn-success text-white my-2"
                    : "btn btn-theme text-white my-2"
                }
                onClick={general}
              >
                General
              </button>

              <button
                type="radio"
                className={
                  comp.timeschedulecom || comp.contesttypecom
                    ? "btn btn-success text-white my-2"
                    : "btn btn-theme text-white my-2"
                }
                onClick={timeschedule}
              >
                Time schedule
              </button>

              <button
                type="radio"
                className={
                  comp.contesttypecom
                    ? "btn btn-success text-white my-2"
                    : "btn btn-theme text-white my-2"
                }
                onClick={contesttype}
              >
                Voting &amp; Participants
              </button>

              {comp.generalcom && srcimg !== "" && (
                <>
                  <PhotoProvider maskOpacity={0.8} bannerVisible={false}>
                    <PhotoView src={srcimg}>
                      <img
                        src={srcimg}
                        className=" img-thumbnail mb-1 mt-2"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      ></img>
                    </PhotoView>
                  </PhotoProvider>
                  <p className="text-center fst-italic fw-lighter mt-0 py-0">
                    Banner - Click for better view
                  </p>
                </>
              )}
            </div>
          </div>

          {uploadshow.display === true && (	
            <>	
              <div	
                style={{	
                  position: "fixed",	
                  display: "block",	
                  width: "100%",	
                  height: "100%",	
                  zIndex: "10",	
                  backgroundColor: "rgba(0,0,0, 0.4)",	
                  top: "0",	
                  left: "0",	
                }}	
              >	
                <img	
                  src={source}	
                  className=" img-thumbnail"	
                  style={{	
                    position: "absolute",	
                    marginLeft: "40%",	
                    top: "25%",	
                    width: "20%",	
                    backgroundColor: "transparent",	
                    borderWidth: "0px",	
                  }}	
                ></img>	
              </div>	
            </>	
          )}
            
          <div className="col-7">
            {/* progress bar */}
            <div className="progress my-3">
              <div
                className="progress-bar bg-theme"
                role="progressbar"
                style={{
                  width:`${prog}%`,
                }}
                aria-valuenow={prog}
                aria-valuemin="0"
                aria-valuemax="100"
              >{prog}%</div>
            </div>

            <form>
              {(() => {
                if (comp.generalcom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold"
                        >
                          Contest Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          onChange={handleChange}
                          value={contest.title}
                          placeholder="My Amazing Contest"
                          className="form-control"
                          id="title"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold my-3"
                        >
                          About
                        </label>
                        <input
                          type="text"
                          name="description"
                          onChange={handleChange}
                          value={contest.description}
                          placeholder="Some Amazing Description.."
                          className="form-control input-large"
                          id="description"
                        />

                        <div className="row">
                          <div className="col-6">
                            <label
                              htmlFor="inputEmail4"
                              className="form-label fw-bold my-3"
                            >
                              Contest Type
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
                          </div>
                          <div className="col-6">
                            <label
                              htmlFor="inputEmail4"
                              className="form-label fw-bold my-3"
                            >
                              Contest Objective
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
                              <option>Poll</option>
                            </select>
                          </div>
                        </div>

                        <div className="my-3">
                          <label
                            className="form-check-label fw-bold me-2"
                            htmlFor="voterAnonymity"
                          >
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
                      <div className="mb-3">
                        <label
                          htmlFor="formFileSm"
                          className="form-label fw-bold mb-2"
                        >
                          Contest Banner Upload
                        </label>

                        <input
                          className="form-control form-control-sm mb-3"
                          type="file"
                          accept="image/*"
                          onChange={bannerfileHandle}
                        />
                      </div>
                      <div className="d-flex flex-row justify-content-end">
                        <button
                          type="radio"
                          className="btn btn-theme text-center px-4"
                          onClick={timeschedule}
                        >
                          Next
                        </button>
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
                          className="form-label fw-bold my-3"
                        >
                          Registration/Contest Start Time
                        </label>
                        <input
                          // min={today}
                          name="startTime"
                          placeholder="Registration Start Time"
                          type="text"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                          onChange={handleChange}
                          value={contest.startTime}
                          className="form-control"
                          id="startTime"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold my-3"
                        >
                          Registration End Time
                        </label>
                        <input
                          // min={today}
                          name="registrationEndTime"
                          placeholder="Registration End Time"
                          type="text"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                          onChange={handleChange}
                          value={contest.registrationEndTime}
                          className="form-control"
                          id="registrationEndTime"
                        />

                        <label
                          htmlFor="inputEmail4"
                          className="form-label fw-bold my-3"
                        >
                          Contest End Time
                        </label>
                        <input
                          // min={today}
                          name="endTime"
                          type="text"
                          placeholder="Contest End Time"
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                          onChange={handleChange}
                          value={contest.endTime}
                          className="form-control"
                          id="endTime"
                        />
                      </div>
                      <div className="d-flex flex-row justify-content-end">
                        <button
                          type="radio"
                          className="btn btn-dark text-center px-4 me-2"
                          onClick={general}
                        >
                          Previous
                        </button>
                        <button
                          type="radio"
                          className="btn btn-theme text-center px-4"
                          onClick={contesttype}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  );
                }

                if (comp.contesttypecom === true) {
                  return (
                    <>
                      <div className="mb-3">
                        <div>
                          <div className="row">
                            <div className="col-6">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label fw-bold my-3"
                              >
                                General Vote weight
                              </label>
                              <input
                                type="number"
                                name="voteWeight"
                                onChange={handleChange}
                                value={contest.voteWeight}
                                className="form-control"
                                id="voteWeight"
                              />
                            </div>
                            <div className="col-6">
                              <label
                                htmlFor="inputEmail4"
                                className="form-label fw-bold my-3"
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
                            </div>
                          </div>

                          <label
                            htmlFor="formFileSm1"
                            className="form-label fw-bold my-3"
                          >
                            Jury File Upload
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="jury"
                            accept="text/plain"
                            onChange={fileHandle}
                            id="jury"
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
                            className="form-label fw-bold my-3"
                          >
                            Contestant File Upload
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="contestant"
                            accept="text/plain"
                            onChange={fileHandle}
                            id="contestant"
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
                            className="form-label fw-bold my-3"
                          >
                            Voter File Upload
                          </label>
                          <input
                            className="form-control"
                            type="file"
                            name="voter"
                            accept="text/plain"
                            onChange={fileHandle}
                            id="voter"
                          />
                        </div>
                      </div>
                      <div className="d-flex flex-row justify-content-end">
                        <button
                          type="radio"
                          className="btn btn-dark text-center px-4 me-2"
                          onClick={timeschedule}
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          className="btn btn-theme px-4"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                        >
                          Create Contest
                        </button>
                      </div>
                      <div
                        className="modal fade"
                        id="exampleModal"
                        tabIndex="-1"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="exampleModalLabel"
                              >
                                Create Contest
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
                                onClick={(e) => {	
                                  createNewContest(e);	
                                  uploadshowfunc(e);	
                                }}	
                                className="btn btn-theme"	
                                data-bs-dismiss="modal"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
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