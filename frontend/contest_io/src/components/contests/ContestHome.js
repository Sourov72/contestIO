import React, { useEffect, useState } from "react";
import { ContestBox } from "./contestBox";
import { obj2qstr, arr2str } from "../helperFunctions";

export const ContestHome = ({ id }) => {
  // contest stuff
  const [ongoingContests, setOngoing] = useState([]);
  const [upcomingContests, setUpcoming] = useState([]);
  const [myContests, setMy] = useState([]);
  const [pastContests, setPast] = useState([]);

  // fires when the function is called
  useEffect(() => {
    const fetchContests = async (query, func) => {
      const response = await fetch(`/api/contests/query?${query}`);
      const json = await response.json();

      if (response.ok) {
        func(json.contests);
      }
    };
    const today = new Date();
    fetchContests(
      obj2qstr({
        endTime: arr2str(["gt", today.toJSON()]),
        limit: arr2str(["limit", 3]),
      }),
      setOngoing
    );
    fetchContests(
      obj2qstr({
        startTime: arr2str(["gt", today.toJSON()]),
        limit: arr2str(["limit", 3]),
      }),
      setUpcoming
    );
    fetchContests(
      obj2qstr({
        hostID: arr2str(["eq", id]),
        limit: arr2str(["limit", 2]),
      }),
      setMy
    );
    fetchContests(
      obj2qstr({
        endTime: arr2str(["lt", today.toJSON()]),
        limit: arr2str(["limit", 3]),
      }),
      setPast
    );
  }, []);


  return (
    <div className="row">
      <div className="col-4 ">
        <ContestBox contests={ongoingContests} boxTitle="Ongoing Contests" />
      </div>
      <div className="col-4 ">
        <ContestBox contests={upcomingContests} boxTitle="Upcoming Contests" />
      </div>
      <div className="col-4">
        <ContestBox contests={myContests} boxTitle="My Contests" />
        <ContestBox contests={pastContests} boxTitle="Past Contests" />
      </div>
    </div>
  );
};
