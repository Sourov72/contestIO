import React, { useEffect, useState } from "react";
import axios from "axios";
import { ContestBox } from "./contestBox";
import { Search } from "./search";
import { obj2str } from "../helperFunctions";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const ContestHome = ({ id }) => {
  const token = cookies.get("TOKEN");
  // contest stuff
  const [ongoingContests, setOngoing] = useState([]);
  const [upcomingContests, setUpcoming] = useState([]);
  const [myContests, setMyContests] = useState([]);
  const [pastContests, setPast] = useState([]);

  const ongoingQuery = obj2str([
    { registrationEndTime: ["lte", new Date().toJSON()] },
    { endTime: ["gt", new Date().toJSON()] },
    { limit: ["limit", 4] },
  ]);
  const upcomingQuery = obj2str([
    { registrationEndTime: ["gt", new Date().toJSON()] },
    { limit: ["limit", 4] },
  ]);
  const myContestsQuery = obj2str([
    { userID: ["eq", id] },
    { limit: ["limit", 2] },
  ]);
  const pastQuery = obj2str([
    { endTime: ["lt", new Date().toJSON()] },
    { limit: ["limit", id ? 2 : 4] },
  ]);

  // fires when the function is called
  useEffect(() => {
    const fetchContests = async (query, func) => {
      // console.log("current query", query)
      // console.log("current token", token)
      axios
        .get(`http://localhost:5000/api/contests/query?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // console.log('response:', response.data)
          func(response.data.contests);
        });
    };
    fetchContests(ongoingQuery, setOngoing);
    fetchContests(upcomingQuery, setUpcoming);
    if(token) fetchContests(myContestsQuery, setMyContests);
    fetchContests(pastQuery, setPast);
  }, []);

  return (
    <div className="container py-3">
      <Search
        apiURI={`/api/contests/query?`}
        searchPlaceHolder="Search for Contests..."
        queryOn="title"
        keyval="_id"
      />
      <div className="row">
        <div className="col-4">
          <ContestBox
            contests={ongoingContests}
            boxTitle="Ongoing Contests"
            q={ongoingQuery.split("limit")[0]}
            col={12}
          />
        </div>
        <div className="col-4">
          <ContestBox
            contests={upcomingContests}
            boxTitle="Upcoming Contests"
            q={upcomingQuery.split("limit")[0]}
            col={12}
          />
        </div>
        <div className="col-4">
          {id && (
            <ContestBox
              contests={myContests}
              boxTitle="My Contests"
              col={12}
              q={myContestsQuery.split("limit")[0]}
            />
          )}
          <ContestBox
            contests={pastContests}
            boxTitle="Past Contests"
            col={12}
            q={pastQuery.split("limit")[0]}
          />
        </div>
      </div>
    </div>
  );
};
