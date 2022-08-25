import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../alert.component";
import axios from "axios";
import {
  obj2str,
  participantTypeToValue,
  participantValueToType,
} from "../helperFunctions";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const ContestParticipantSearch = (props) => {
  const token = cookies.get("TOKEN");
  const [searchShow, setSearchShow] = useState(false);
  const [allUsers, setallUsers] = useState([]);
  const [searchfield, setsearchfield] = useState("");

  const [deleteparticipant, setdeleteparticipant] = useState({
    clicked: false,
    voter: false,
    contestant: false,
    jury: false,
  });

  const type = props.type;
  const contestID = props.contestID;

  useEffect(() => {
    getallUser("");
  }, [type, contestID]);

  const handleChange = async (e) => {
    console.log("searchfield:", e.target.value); // but not here

    await getallUser(e.target.value);
    setsearchfield(e.target.value);
  };

  const deletehandler = (param) => async (e) => {
    console.log("clicked", param.userID, param.contestID);

    const participant = {
      userID: param.userID,
      contestID: param.contestID,
    };

    await axios
      .delete("http://localhost:5000/api/participants/delete", {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        data: participant,
      })
      .then((res) => {
        if (type === "voterlist") {
          setdeleteparticipant({ clicked: true, voter: true });
        }
        if (type === "participantlist") {
          setdeleteparticipant({ clicked: true, contestant: true });
        }
        if (type === "jurylist") {
          setdeleteparticipant({ clicked: true, jury: true });
        }
        timeout();
        console.log("res body in participant delete", res.data);
      });

    console.log("SEWRCH FF", searchfield);
    await getallUser(searchfield);
  };

  function timeout() {
    console.log("in time out");
    setTimeout(function () {
      setdeleteparticipant({
        clicked: false,
        voter: false,
        contestant: false,
        jury: false,
      });
    }, 2000);
    console.log("after timeout");
  }

  async function getallUser(name) {
    var bitmask = 0;
    if (type === "voterlist") {
      bitmask = participantTypeToValue("voter");
    }
    if (type === "participantlist") {
      bitmask = participantTypeToValue("contestant");
    }
    if (type === "jurylist") {
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
    // console.log("query", query);

    axios
      .get(`http://localhost:5000/api/participants/query?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setallUsers(res.data.participants);
      });
  }

  function searchList() {
    // if (searchShow) {

    return allUsers.length > 0 ? (
      <>
        <tr key="1">
          <td className="fw-bold">Email</td>
          <td className="fw-bold">User Name</td>
        </tr>
        {allUsers.map((currentPerson) => {
          return (
            <tr key={currentPerson.email}>
              <td>
                <Link
                  to={"/profile/" + currentPerson.userID}
                  state={{ id: currentPerson.userID }}
                >
                  {currentPerson.email}
                </Link>
              </td>
              <td>
                <Link
                  to={"/profile/" + currentPerson.userID}
                  state={{ id: currentPerson.userID }}
                >
                  {currentPerson.username}
                </Link>
              </td>
              {currentPerson.userID !== props.hostID ? (
                <>
                  <td>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-x"
                      viewBox="0 0 16 16"
                      onClick={deletehandler({
                        userID: currentPerson.userID,
                        contestID: props.contestID,
                      })}
                    >
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </td>
                </>
              ) : (
                <>
                  <td>HOST</td>
                </>
              )}
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
      <div className="col-2"></div>
      <div className="col-9 search-div">
        <input
          className="form-control me-2 text-center search-bar"
          type="search"
          placeholder={props.placeholder}
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
      {deleteparticipant.clicked === true ? (
        <>
          <Alert
            alertclass="alert alert-danger alert-dismissible fade show"
            {...(deleteparticipant.voter
              ? { alerttext: "Voter Deleted Successfully" }
              : {})}
            {...(deleteparticipant.contestant
              ? { alerttext: "Contestant Deleted Successfully" }
              : {})}
            {...(deleteparticipant.jury
              ? { alerttext: "Jury Deleted Successfully" }
              : {})}

            // alerthandle={alerthandle}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};
