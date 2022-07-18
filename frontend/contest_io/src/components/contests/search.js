import React, { useState } from "react";
import { Link } from "react-router-dom";
import { obj2qstr, arr2str, objarr2str } from "../helperFunctions";

export const Search = ({ apiURI, searchPlaceHolder, queryOn, keyval }) => {
  const [searchData, setsearchField] = useState([]);
  const [searchShow, setSearchShow] = useState(false);

  const handleChange = async (e) => {
    // setsearchField(e.target.value);
    if (e.target.value === "") {
      setSearchShow(false);
    } else {
      setSearchShow(true);
      var obj = {};
      obj[queryOn] = arr2str(["regex", e.target.value]);
      obj["limit"] = arr2str(["limit", 3]);
      // console.log('query: ', obj)
      const q = obj2qstr(obj);
      // console.log('cq: ', q)
      const response = await fetch(apiURI + q);
      const json = await response.json();

      if (response.ok) {
        setsearchField(json.contests);
      }
    }
  };

  function moreButton() {
    return (
      <td>
        <Link
          className="d-flex justify-content-center"
          to="/contests/search"
          state={{ query: objarr2str({limit : ['limit', 8]}) }}
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
                    <Link to="/contestshow" state={{ contestID: data[keyval] }}>
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
            e.target.value = "";
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
