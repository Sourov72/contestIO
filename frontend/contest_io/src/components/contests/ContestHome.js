import React, { useEffect, useState } from "react";
import { ContestBox } from "./contestBox";
import { obj2str} from "../helperFunctions";

export const ContestHome = ({ id }) => {
  // contest stuff
  const [ongoingContests, setOngoing] = useState([]);
  const [upcomingContests, setUpcoming] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [pastContests, setPast] = useState([]);

  const ongoingQuery = obj2str([
    {registrationEndTime: ["lte", new Date().toJSON()]},
    {endTime: ["gt", new Date().toJSON()]},
    {limit: ["limit", 4]},
  ])
  const upcomingQuery = obj2str([
    {registrationEndTime: ["gt", new Date().toJSON()]},
    {limit: ["limit", 4]},
  ])
  const myContestsQuery = obj2str([
    {hostID: ["eq", id]},
    {limit: ["limit", 2]},
  ])
  const pastQuery = obj2str([
    {endTime: ["lt", new Date().toJSON()]},
    {limit: ["limit", (id ? 2 : 4)]},
  ])

  // fires when the function is called
  useEffect(() => {
    const fetchContests = async (query, func) => {
      const response = await fetch(`/api/contests/query?${query}`);
      const json = await response.json();

      if (response.ok) {
        func(json.contests);
      }
    };
    // console.log('ongoing:', ongoingQuery)
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
          q={ongoingQuery.split('limit')[0]}
          col={12}
        />
      </div>
      <div className="col-4">
        <ContestBox
          contests={upcomingContests}
          boxTitle="Upcoming Contests"
          q={upcomingQuery.split('limit')[0]}
          col={12}
        />
      </div>
      <div className="col-4">
        {id && <ContestBox contests={myContests} boxTitle="My Contests" col={12} q={myContestsQuery.split('limit')[0]} />}
        <ContestBox contests={pastContests} boxTitle="Past Contests" col={12} q={pastQuery.split('limit')[0]} />
      </div>
    </div>
  );
};
