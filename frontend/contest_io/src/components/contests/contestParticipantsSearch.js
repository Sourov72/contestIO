import React, { useEffect, useState } from "react";
import axios from "axios";
import { obj2str, participantValueToType } from "../helperFunctions";

// const SearchList = (props) => {
//   <tr>

//     <td>{props.person.username}</td>
//     <td>{props.person.email}</td>
//   </tr>;
// };

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

  // const filteredPersons = Array.from(allUsers);
  // const filteredPersons = searchResultsList.filter((person) => {
  //     // console.log(person.username);
  //     return (
  //         person.username.toLowerCase().includes(searchField.toLowerCase()) ||
  //         person.email.toLowerCase().includes(searchField.toLowerCase())
  //     );
  // });

  async function getallUser(name) {
    // console.log("searchField:", searchField);
    var lte = 0;
    var gt = 0;
    if (type === "voterlist") {
      lte = 15;
      gt = 2;
    }
    if (type === "participantlist") {
      lte = 44;
      gt = 32;
    }
    if (type == "jurylist") {
      lte = 20;
      gt = 16;
    }

    var q = [
      { type: ["lte", lte] },
      { type: ["gt", gt] },
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
        console.log("response:", res);
        setallUsers(res.data.participants);
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
            //   <SearchList key={currentPerson.email} person={currentPerson} />

            <tr key={currentPerson.email}>
              <td>{currentPerson.email}</td>
              <td>{currentPerson.username}</td>
              {/* <td>{participantValueToType(currentPerson.type)}</td> */}
            </tr>
          );
        })}{" "}
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
          {/* <tbody>{searchShow && <tr>{moreButton()}</tr> }</tbody> */}
        </table>
      </div>
    </div>
  );
};
