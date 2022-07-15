import React, { useState } from "react";
import { obj2qstr, arr2str } from "../helperFunctions";

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
      const response = await fetch(apiURI + obj2qstr(obj));
      const json = await response.json();

      if (response.ok) {
        setsearchField(json);
      }
    }
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

  function searchList() {
    if (searchShow) {
      return searchData.length > 0
        && searchData.map((data) => {
            return (
              <tr key={data[keyval]}>
                <td>{data[queryOn]}</td>
              </tr>
            );
          })
        ;
    }
  }

  return (
    <div className="container row mt-4 mb-3">
      <div className="col-3"></div>
      <div className="col-6">
        <input
          className="form-control me-2 text-center search-bar"
          type="search"
          placeholder={searchPlaceHolder}
          onChange={handleChange}
        />
        

        <table className="table table-borderless table-hover mb-2">
          <tbody>{searchList()}</tbody>
        </table>
      </div>
      <div className="col-3"></div>
    </div>
  );
};
