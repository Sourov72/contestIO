import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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

  const [newvoters, setnewvoters] = useState([]);

  useEffect(() => {
    getallUser("");
  }, []);

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
    console.log("clicked", param.userID, param.contestID);

    var participant = "";
    if (props.type === "voteradd") {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("voter"),
      };
    } else if (props.type === "juryadd") {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("jury"),
      };
    } else {
      participant = {
        userID: param.userID,
        contestID: param.contestID,
        type: participantTypeToValue("contestant"),
      };
    }

    console.log("participant", participant);

    await axios
      .post("http://localhost:5000/api/participants/create", participant, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res body in participant creation", res.data);
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

  function getallUser(name) {
    const user = {
      username: name,
      contestID: props.contestID,
    };
    console.log(user);
    axios.post("http://localhost:5000/api/user/users", user).then((res) => {
      console.log(res);
      setallUsers(res.data);
    });
  }

  function voteradd(a, b) {
    console.log("voter add", a, "fjsdkf", b);
    newvoters.push(b);
    console.log("newvoters", newvoters, "heloo", props.contestID);
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
              <td>{participantValueToType(currentPerson.type)}</td>
              <td>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-x"
                  viewBox="0 0 16 16"
                  // onClick={deletehandler({
                  //   userID: currentPerson.userID,
                  //   contestID: props.contestID,
                  // })}
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
                <i className="bi bi-file-plus-fill">bb</i> */}
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
