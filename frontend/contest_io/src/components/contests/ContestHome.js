import React, { useEffect, useState } from "react";
import { ContestBox } from "./contestBox";
import { obj2qstr, arr2str } from "../helperFunctions";

export const ContestHome = ({ id }) => {
  // contest stuff
  const [ongoingContests, setOngoing] = useState([]);
  const [upcomingContests, setUpcoming] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [pastContests, setPast] = useState([]);

  const ongoingQuery = obj2qstr({
    startTime: arr2str(["lte", new Date().toJSON()]),
    endTime: arr2str(["gt", new Date().toJSON()]),
    limit: arr2str(["limit", 4]),
  })
  const upcomingQuery = obj2qstr({
    registrationEndTime: arr2str(["gt", new Date().toJSON()]),
    limit: arr2str(["limit", 4]),
  })
  const myContestsQuery = obj2qstr({
    hostID: arr2str(["eq", id]),
    limit: arr2str(["limit", 2]),
  })
  const pastQuery = obj2qstr({
    endTime: arr2str(["lt", new Date().toJSON()]),
    limit: arr2str(["limit", 2]),
  })

  // fires when the function is called
  useEffect(() => {
    const fetchContests = async (query, func) => {
      const response = await fetch(`/api/contests/query?${query}`);
      const json = await response.json();

      if (response.ok) {
        func(json.contests);
      }
    };
    fetchContests(ongoingQuery, setOngoing);
    fetchContests(upcomingQuery, setUpcoming);
    fetchContests(myContestsQuery,setMyContests);
    fetchContests(pastQuery, setPast);
  }, []);

  return (
    <div className="row">
      <div className="col-4">
        <ContestBox
          contests={ongoingContests}
          boxTitle="Ongoing Contests"
          q={ongoingQuery}
          col={12}
        />
      </div>
      <div className="col-4">
        <ContestBox
          contests={upcomingContests}
          boxTitle="Upcoming Contests"
          q={upcomingQuery}
          col={12}
        />
      </div>
      <div className="col-4">
        <ContestBox contests={myContests} boxTitle="My Contests" col={12} q={myContestsQuery} />
        <ContestBox contests={pastContests} boxTitle="Past Contests" col={12} q={pastQuery} />
      </div>
      {/* <div className="col-12">
        <Link className="d-flex justify-content-center" to="/contests/search">
          <button className="btn btn-danger px-4">View More Results</button>
        </Link>
      </div> */}
    </div>
  );
};
