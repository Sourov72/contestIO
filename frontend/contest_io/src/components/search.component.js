import React, { useEffect, useState } from "react";
import axios from "axios";

// const SearchList = (props) => {
//   <tr>

//     <td>{props.person.username}</td>
//     <td>{props.person.email}</td>
//   </tr>;
// };




export const Search = () => {
    const [searchField, setsearchField] = useState("");
    const [searchShow, setSearchShow] = useState(false);
    const [allUsers, setallUsers] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/user/").then((res) => {
            // console.log("hello there boro", res.data)
            // alert("noooo")
            setallUsers(res.data);
        });
    }, []);

    const handleChange = (e) => {
        setsearchField(e.target.value);
        if (e.target.value === "") {
            setSearchShow(false);
        } else {
            setSearchShow(true);
        }
    };

    const searchResultsList = Array.from(allUsers);
    const filteredPersons = searchResultsList.filter((person) => {
        // console.log(person.username);
        return (
            person.username.toLowerCase().includes(searchField.toLowerCase()) ||
            person.email.toLowerCase().includes(searchField.toLowerCase())
        );
    });


    var stylingObject = {
        scrollbar: {
            position: "relative",
            height: "200px",
            overflow: "auto",
            color: "red",
            display: "block",
        }
    }

    function searchList() {
        if (searchShow) {
            return filteredPersons.map((currentPerson) => {
                return (
                    //   <SearchList key={currentPerson.email} person={currentPerson} />
                    <tr key={currentPerson.email}>
                        <td>{currentPerson.email}</td>
                        <td>{currentPerson.username}</td>
                    </tr>
                );
            });
        }
    }

    return (
        <div>
            {console.log("in consoleasjf", allUsers)}
            <div className="pa2">
                <input
                    className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
                    type="search"
                    placeholder="Search People"
                    onChange={handleChange}
                />
            </div>
            <div className="container" style={stylingObject.scrollbar}>


                <table className="table table-striped table-hover mb-0">
                    <tbody>
                        <tr>
                            <td>template one</td>
                        </tr>
                        {searchList()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
