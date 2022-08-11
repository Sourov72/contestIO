import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { obj2str, participantTypeToValue, participantValueToType } from "../helperFunctions";

export const ContestParticipantSearch = (props) => {
  const [searchShow, setSearchShow] = useState(false);
  const [allUsers, setallUsers] = useState([]);

  const type = props.type;
  const contestID = props.contestID;

  useEffect(() => {
    getallUser("");
  }, [type, contestID]);

  const handleChange = async (e) => {
    console.log("searchfield:", e.target.value); // but not here

    await getallUser(e.target.value);
  };

  async function getallUser(name) {
    var bitmask = 0;
    if (type === "voterlist") {
      bitmask = participantTypeToValue("voter");
    }
    if (type === "participantlist") {
      bitmask = participantTypeToValue("contestant");
    }
    if (type == "jurylist") {
      bitmask = participantTypeToValue("jury");
    }

    var q = [
      { type: ["bitsAnySet", bitmask] },
      { contestID: ["eq", contestID] },
    ];
    if (name) {
      q.push({ username: ["regex", name] });
    }
    const query = obj2str(q);
    console.log("query", query);

    axios
      .get(`http://localhost:5000/api/participants/query?${query}`)
      .then((res) => {
        // console.log("response:", res);
        // setallUsers([])
        // console.log("allusers before:", allUsers)
        setallUsers(res.data.participants);
        // console.log("allusers after:", allUsers)
      });
  }

  function searchList() {
    // if (searchShow) {

    return allUsers.length > 0 ? (
      <>
        {" "}
        <tr key="1">
          <td className="fw-bold">Email</td>
          <td className="fw-bold">User Name</td>
        </tr>
        {allUsers.map((currentPerson) => {
          return (
            <tr key={currentPerson.email}>
              <td>
                <Link
                  to="/profile"
                  state={{ id: currentPerson.userID }}
                >
                  {currentPerson.email}
                </Link>
              </td>
              <td>
                <Link
                  to="/profile"
                  state={{ id: currentPerson.userID }}
                >
                  {currentPerson.username}
                </Link>
              </td>
              <td>{participantValueToType(currentPerson.type)}</td>
            </tr>
          );
        })}
      </>
    ) : (
      <tr>
        <td className="text-center fw-light fst-italic text-muted">
          No Users to show
        </td>
      </tr>
    );
  }

  return (
    <div className="container row mt-4 mb-3 px-0">
      <div className="col-1"></div>
      <div className="col-9 search-div">
        <input
          className="form-control me-2 text-center search-bar"
          type="search"
          placeholder="Search People"
          onBlur={(e) => {
            e.target.value = "";
            handleChange(e);
          }}
          onChange={handleChange}
        />

        <table className="table table-borderless table-hover search-table mb-2">
          <tbody>{searchList()}</tbody>
        </table>
      </div>
    </div>
  );
};
