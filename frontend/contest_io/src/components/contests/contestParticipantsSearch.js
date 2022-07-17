import React, { useEffect, useState } from "react";
import axios from "axios";

// const SearchList = (props) => {
//   <tr>

//     <td>{props.person.username}</td>
//     <td>{props.person.email}</td>
//   </tr>;
// };

export const ContestParticipantSearch = (props) => {
  var type;

  const [searchField, setsearchField] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const [allUsers, setallUsers] = useState("");

  type = props.type;

  useEffect(() => {
    console.log(" in use effectprops type", props.type);
    getallUser("");
  }, [type]);

  const handleChange = async (e) => {
    console.log("inhand", e.target.value); // but not here

    setsearchField(e.target.value);
    getallUser(e.target.value);

    console.log("value in search", searchField);

    if (e.target.value === "") {
      setSearchShow(false);
    } else {
      setSearchShow(true);
    }
  };

  const filteredPersons = Array.from(allUsers);
  // const filteredPersons = searchResultsList.filter((person) => {
  //     // console.log(person.username);
  //     return (
  //         person.username.toLowerCase().includes(searchField.toLowerCase()) ||
  //         person.email.toLowerCase().includes(searchField.toLowerCase())
  //     );
  // });

  var stylingObject = {
    scrollbar: {
      position: "relative",
      height: "200px",
      overflow: "auto",
      color: "red",
      display: "block",
    },
  };

  function getallUser(value) {
    const user = {
      username: value,
    };
    console.log(user);
    console.log("serchfild", searchField);
    if (props.type === "voterlist") {
      axios.post("http://localhost:5000/api/user/users", user).then((res) => {
        console.log(res);
        setallUsers(res.data);
      });
    } else {
      setallUsers("");
    }
  }

  function searchList() {
    // if (searchShow) {

    return filteredPersons.map((currentPerson) => {
      return (
        //   <SearchList key={currentPerson.email} person={currentPerson} />
        <tr key={currentPerson.email}>
          <td>{currentPerson.email}</td>
          <td>{currentPerson.username}</td>
        </tr>
      );
    });
    // }
  }

  return (
    // <div>
    //   {/* {console.log("in consoleasjf", allUsers)} */}
    //   <div className="">
    //     <input
    //       className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
    //       type="search"
    //       placeholder="Search People"
    //       onChange={handleChange}
    //     />
    //   </div>
    //   <div className="container">
    //     <table className="table table-striped table-hover mb-0">
    //       <tbody>
    //         {searchList()}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>

    <div className="container row mt-4 mb-3 px-0">
      <div className="col-3"></div>
      <div className="col-6 search-div">
        <input
          className="form-control me-2 text-center search-bar"
          type="search"
          placeholder="Search People"
          onChange={handleChange}
        />

        <table className="table table-borderless table-hover search-table mb-2">
          <tbody>{searchList()}</tbody>
          {/* <tbody>{searchShow && <tr>{moreButton()}</tr> }</tbody> */}
        </table>
      </div>
      <div className="col-3"></div>
    </div>
  );
};
