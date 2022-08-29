import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Alert } from "./alert.component";
import {
  obj2str,
  participantTypeToValue,
  participantValueToType,
} from "./helperFunctions";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// const SearchList = (props) => {
//   <tr>

//     <td>{props.person.username}</td>
//     <td>{props.person.email}</td>
//   </tr>;
// };

export const Search = (props) => {
  const token = cookies.get("TOKEN");
  const [searchField, setsearchField] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const [allUsers, setallUsers] = useState("");

  const [addparticipant, setaddparticipant] = useState({
    clicked: false,
    voter: false,
    contestant: false,
    jury: false,
    blocked: false,
    unblocked: false,
  });

  const [newvoters, setnewvoters] = useState([]);

  useEffect(() => {
    getallUser("");
  }, [props.type]);

  const handleChange = (e) => {
    setsearchField(e.target.value);

    if (e.target.value === "") {
      setSearchShow(false);
    } else {
      setSearchShow(true);
    }
    getallUser(e.target.value);
  };

  const addhandler = (param) => async (e) => {
    e.preventDefault();
    console.log("clicked in block", param.userID, param.contestID);

    var participant = "";
    if (props.type === "voteradd") {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("voter", "follower"),
      };
      console.log("voter value", participant.type);
    } else if (props.type === "juryadd") {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("jury", "follower"),
      };
      console.log("jury value", participant.type);
    } else if (props.type === "contestantadd") {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("contestant", "voter", "follower"),
      };
      console.log("contestant value", participant.type);
    } else if (props.type === "blockuser") {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("blocked"),
      };
    }

    console.log("participant", participant);

    if (props.type === "blockuser") {
      console.log("in block container");
      await axios
        .post("http://localhost:5000/api/participants/blockuser", participant, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setaddparticipant({ clicked: true, blocked: true });
          timeout();
          console.log("res body in block user creation", res.data);
        });
    } else {
      await axios
        .post("http://localhost:5000/api/participants/create", participant, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (props.type === "voteradd") {
            setaddparticipant({ clicked: true, voter: true });
          }
          if (props.type === "contestantadd") {
            setaddparticipant({ clicked: true, contestant: true });
          }
          if (props.type === "juryadd") {
            setaddparticipant({ clicked: true, jury: true });
          }
          timeout();
          console.log("res body in participant creation", res.data);
        });
    }

    console.log("SEWRCH FF", searchField);
    await getallUser(searchField);
  };

  const unblockuser = (param) => async (e) => {
    e.preventDefault();
    console.log("clicked in unblock", param.userID, param.contestID);

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
        setaddparticipant({ clicked: true, unblocked: true });
        timeout();
        console.log("res body in participant delete", res.data);
      });

    console.log("SEWRCH FF", searchField);
    await getallUser(searchField);
  };

  var stylingObject = {
    scrollbar: {
      position: "relative",
      height: "200px",
      overflow: "auto",
      color: "red",
      display: "block",
    },
  };

  async function getallUser(name) {
    const user = {
      username: name,
      contestID: props.contestID,
    };
    console.log(user);
    if (props.type === "blockuser") {
      console.log("in block user");
      await axios
        .post("http://localhost:5000/api/user/block", user)
        .then((res) => {
          // console.log("all users from block", res.data[0].type.length);

          var list1 = [];
          var list2 = [];

          for (let i = 0; i < res.data.length; i++) {
            if (
              res.data[i].type.length !== 0 &&
              participantValueToType(res.data[i].type[0]).includes("BLOCKED")
            ) {
              // console.log("blocked participant", res.data[i])
              list2.push(res.data[i]);
            } else {
              list1.push(res.data[i]);
            }
          }
          list1 = list1.concat(list2);

          // console.log("list1", list1);
          setallUsers(list1);
        });
    } else {
      await axios
        .post("http://localhost:5000/api/user/users", user)
        .then((res) => {
          console.log(res);
          setallUsers(res.data);
        });
    }
  }

  function timeout() {
    console.log("in time out");
    setTimeout(function () {
      setaddparticipant({
        clicked: false,
        voter: false,
        contestant: false,
        jury: false,
        blocked: false,
        unblocked: false,
      });
    }, 2000);
    console.log("after timeout");
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
                  to={"/profile/" + currentPerson._id}
                  state={{ id: currentPerson._id }}
                >
                  {currentPerson.email}
                </Link>
              </td>
              <td>
                <Link
                  to={"/profile/" + currentPerson._id}
                  state={{ id: currentPerson._id }}
                >
                  {currentPerson.username}
                </Link>
              </td>
              {/* <td>{participantValueToType(currentPerson.type)}</td> */}
              <td>
                {props.type === "blockuser" ? (
                  <>
                    {/* <p>{}</p> */}
                    {participantValueToType(currentPerson.type).includes(
                      "BLOCKED"
                    ) &&
                      currentPerson._id !== props.hostID && (
                        <button
                          type="submit"
                          className="btn btn-warning"
                          onClick={unblockuser({
                            userID: currentPerson._id,
                            contestID: props.contestID,
                          })}
                        >
                          UNBLOCK
                        </button>
                      )}
                    {!participantValueToType(currentPerson.type).includes(
                      "BLOCKED"
                    ) &&
                      currentPerson._id !== props.hostID && (
                        <button
                          type="submit"
                          className="btn btn-danger"
                          onClick={addhandler({
                            userID: currentPerson._id,
                            contestID: props.contestID,
                          })}
                        >
                          BLOCK
                        </button>
                      )}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-plus-lg"
                      viewBox="0 0 16 16"
                      onClick={addhandler({
                        userID: currentPerson._id,
                        contestID: props.contestID,
                      })}
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                      />
                    </svg>
                  </>
                )}
              </td>
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
    // }
  }

  return (
    <>
      <div className="container row my-4 mb-3 px-0">
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
      </div>
      {props.type !== "blockuser" && addparticipant.clicked === true ? (
        <>
          <Alert
            alertclass="alert alert-success alert-dismissible fade show"
            {...(addparticipant.voter
              ? { alerttext: "Voter Added Successfully" }
              : {})}
            {...(addparticipant.contestant
              ? { alerttext: "Contestant Added Successfully" }
              : {})}
            {...(addparticipant.jury
              ? { alerttext: "Jury Added Successfully" }
              : {})}

            // alerthandle={alerthandle}
          />
        </>
      ) : (
        <></>
      )}
      {props.type === "blockuser" && addparticipant.clicked === true ? (
        <>
          <Alert
            {...(addparticipant.blocked
              ? {
                  alertclass: "alert alert-danger alert-dismissible fade show",
                  alerttext: "User Blocked Successfully",
                }
              : {})}
            {...(addparticipant.unblocked
              ? {
                  alertclass: "alert alert-warning alert-dismissible fade show",
                  alerttext: "User Unblocked Successfully",
                }
              : {})}

            // alerthandle={alerthandle}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};
