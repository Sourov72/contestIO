import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom'
import { ContestBox } from "./contestBox";
import { objarr2str } from "../helperFunctions";

export const ContestSearch = () => {
  const location = useLocation()
  const [skip, setskip] = useState(0);
  var limit = 8;
  const [search, setSearch] = useState({
    type: ["eq", ""],
    objective: ["eq", ""],
    voterAnonymity: ["eq", ""],
    startTime: ["gte", ""],
    endTime: ["lte", ""],
    registrationEndTime: ["gte", ""],
    limit: ["limit", limit],
    skip: ["skip", skip],
  });

  const [result, setResult] = useState({
    count: "",
    contests: [],
  });

  const fetchContests = async (q, func) => {
    const response = await fetch(`/api/contests/query?${q}`);
    const json = await response.json();

    if (response.ok) {
      func(json);
    }
  };

  useEffect(() => {
    const query = location.state.query
    fetchContests(query, setResult);
  }, [location]);

  const handleChange = async (e) => {
    var { name, value } = e.target;
    if (name === "voterAnonymity" || name === "registrationOpen") {
      if (e.target.checked) {
        value = 1;
      } else {
        value = 0;
      }
    }
    if (value === "None" || value === 0) {
      value = "";
    }
    const today = new Date();
    if (name === "registrationOpen") {
      name = "registrationEndTime";
      if (value === 1) value = today.toJSON();
    } else if (name === "startTime" || name === "endTime") {
      value = new Date(value).toJSON();
    }
    var arr = search[name];
    arr[1] = value;
    setSearch({
      ...search,
      [name]: arr,
    });
    console.log(search);
    const str = objarr2str(search);
    fetchContests(str, setResult);
  };

  return (
    <>
      <div className="row">
        <div className="col-3"></div>
        <div className="col-6 fw-light fst-italic text-muted fs-6 mb-2">
          Showing {result.count > limit ? limit : result.count} out of{" "}
          {result.count} contests{" "}
        </div>
        <div className="col-3"></div>
      </div>
      <div className="row">
        <div className="col-3 csearch-box py-2">
          {/* contest type card */}
          <div className="card search-card m-2">
            <div className="card-header fw-bold search-card fw-bold search-card">
              Contest Type
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 px-2">
                  <select
                    className="form-select"
                    name="type"
                    onChange={handleChange}
                    id="type"
                  >
                    <option>None</option>
                    <option>Private</option>
                    <option>Public</option>
                    <option>Open</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Date range card */}
          <div className="card search-card m-2">
            <div className="card-header fw-bold search-card">Date Range</div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 px-2 mb-2">
                  <input
                    name="startTime"
                    placeholder="Start Date"
                    onChange={handleChange}
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    className="form-control"
                    id="conteststarttime"
                  />
                </div>
                <div className="col-12 px-2 mb-2">
                  <input
                    name="endTime"
                    onChange={handleChange}
                    placeholder="End Date"
                    type="text"
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.type = "text")}
                    className="form-control"
                    id="contestendtime"
                  />
                </div>
                <div className="col-12 px-2 mb-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="registrationOpen"
                      onChange={handleChange}
                      id="registrationOpen"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="registrationOpen"
                    >
                      Registration Open
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* contest Objective card */}
          <div className="card search-card m-2">
            <div className="card-header fw-bold search-card">
              Contest Objective
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 px-2">
                  <select
                    className="form-select"
                    name="objective"
                    onChange={handleChange}
                    id="objective"
                  >
                    <option>None</option>
                    <option>Photo Contest</option>
                    <option>Polls</option>
                    <option>Video Contest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          {/* Privacy card */}
          <div className="card search-card m-2">
            <div className="card-header fw-bold search-card">Privacy</div>
            <div className="card-body">
              <div className="row">
                <div className="col-10 mx-2">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="voterAnonymity"
                      onChange={handleChange}
                      id="voterAnonymity"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="voterAnonymity"
                    >
                      Anonymous
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-9 ">
          <ContestBox contests={result.contests} boxTitle="" col={6} />
        </div>
      </div>
    </>
  );
};
