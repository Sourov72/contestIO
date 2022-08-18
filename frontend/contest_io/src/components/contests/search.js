import React, { useState } from "react";
import { Link } from "react-router-dom";
import { obj2str } from "../helperFunctions";
import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();

export const Search = ({ apiURI, searchPlaceHolder, queryOn, keyval }) => {
  const token = cookies.get("TOKEN");
  
  const [searchData, setsearchField] = useState([]);
  const [searchShow, setSearchShow] = useState(false);

  const handleChange = async (e) => {
    // setsearchField(e.target.value);
    if (e.target.value === "") {
      setSearchShow(false);
    } else {
      setSearchShow(true);
      var q = obj2str([
        {[queryOn] : ["regex", e.target.value]},
        {limit : ["limit", 3]},
      ]);
      // console.log(e.target.value)
      // console.log('query: ', obj)
      // const q = obj2str(obj);
      // console.log('cq: ', q)
      axios
      .get('http://localhost:5000' + apiURI + q, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("response: ", response.data);
        setsearchField(response.data.contests)
      })
    }
  };

  function moreButton() {
    return (
      <td>
        <Link
          className="d-flex justify-content-center"
          to="/contests/search"
          state={{ query: obj2str([{limit : ['limit', 8]}]) }}
        >
          <button
            className="btn btn-danger px-4"
            onClick={(e) => setSearchShow(false)}
          >
            View More Results
          </button>
        </Link>
      </td>
    );
  }

  function searchList() {
    if (searchShow) {
      return (
        <>
          {searchData.length > 0 ? (
            searchData.map((data) => {
              return (
                <tr key={data[keyval]}>
                  <td>
                    <Link to={"/contests/" + data[keyval]} state={{ contestID: data[keyval] }}>
                      {data[queryOn]}
                    </Link>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="text-center fw-light fst-italic text-muted">
                No contests to show
              </td>
            </tr>
          )}
        </>
      );
    }
  }

  return (
    <div className="container row mt-4 mb-3 px-0">
      <div className="col-3"></div>
      <div className="col-6 search-div">
        <input
          className="form-control me-2 text-center search-bar"
          type="search"
          placeholder={searchPlaceHolder}
          onBlur={(e) => {
            // setSearchShow(false);
            // e.target.value = "";
            // handleChange(e);
          }}
          onChange={handleChange}
        />

        <table className="table table-borderless table-hover search-table mb-2">
          <tbody>{searchList()}</tbody>
          <tbody>{searchShow && <tr>{moreButton()}</tr>}</tbody>
        </table>
      </div>
      <div className="col-3"></div>
    </div>
  );
};
