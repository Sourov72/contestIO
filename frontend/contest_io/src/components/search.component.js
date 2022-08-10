import React, { useEffect, useState } from "react";
import axios from "axios";

// const SearchList = (props) => {
//   <tr>

//     <td>{props.person.username}</td>
//     <td>{props.person.email}</td>
//   </tr>;
// };

export const Search = (props) => {
  const [searchField, setsearchField] = useState("");
  const [searchShow, setSearchShow] = useState(false);
  const [allUsers, setallUsers] = useState("");

  const [newvoters, setnewvoters] = useState([]);

  useEffect(() => {
    getallUser();
  }, []);

  const handleChange = (e) => {
    setsearchField(e.target.value);

    if (e.target.value === "") {
      setSearchShow(false);
    } else {
      setSearchShow(true);
    }
    getallUser();
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

  function getallUser() {
    const user = {
      username: searchField,
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
    console.log("newvoters", newvoters, "heloo", props.contestvoteaddID);
  }

  function add() {
    // e.preventDefault();

    // console.log(b);

    // axios.post()

    axios
      .post(
        "http://localhost:5000/api/contests/voteradd/" + props.contestvoteaddID,
        newvoters
      )
      .then((res) => {
        if (res.data.msg === "Voter Updated!") {
          alert("updated successfully");
          // window.location = "/profile";
        }
        window.location = "/";
      });
  }

  function searchList() {
    // if (searchShow) {

    return filteredPersons.map((currentPerson) => {
      return (
        //   <SearchList key={currentPerson.email} person={currentPerson} />
        <tr
          key={currentPerson.email}
          onClick={() => voteradd(currentPerson.email, currentPerson._id)}
        >
          <td>{currentPerson.email}</td>
          <td>{currentPerson.username}</td>
          {/* <td><button
                        type="submit"
                        className="btn btn-primary my-2"
                        onClick={voteradd(currentPerson.email)}
                    >
                        Add
                    </button></td> */}
        </tr>
      );
    });
    // }
  }

  return (
    <div>
      helo terjkfjkdsajflkds
      {console.log("in consoleasjf", allUsers)}
      <div className="">
        <input
          className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
          type="search"
          placeholder="Search People"
          onChange={handleChange}
        />
      </div>
      <div className="container" style={stylingObject.scrollbar}>
        <table className="table table-dark  mb-0">
          <tbody>
            {searchList()}
            <tr>
              <td>
                <button
                  type="submit"
                  className="btn btn-primary my-2"
                  onClick={add}
                >
                  Voters add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
