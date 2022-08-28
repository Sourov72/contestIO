import React, { useEffect, useState } from "react";
import axios from "axios";
import { Contentcard } from "../contents/contentcard";
import { Link } from "react-router-dom";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import Cookies from "universal-cookie";
const cookies = new Cookies();

export const ContestResult = (props) => {
  const token = cookies.get("TOKEN");
  const [select, setselect] = useState("all");
  const [category, setcategory] = useState({});
  const [results, setresult] = useState({});
  const [categories, setcategories] = useState({});
  useEffect(() => {
    setselect("all");

    getallcategories();
    // getcategorycontent(allcontent);
  }, []);

  function getCategoryResult(selectedCategory) {
    axios
      .get(
        "http://localhost:5000/api/votes/getResults/" + selectedCategory[0]._id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("category results: ", res.data);
        setresult(res.data);
        console.log("category results: ", results);
      });
  }

  function getallcategories() {
    // console.log("contestID: ", props.contestID);
    axios
      .get(
        "http://localhost:5000/api/contests/getcatogory/" + props.contestID,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setcategories(res.data);
      });
  }
  const categoryChange = (e) => {
    const { value } = e.target;

    if (value !== "all") {
      var selectedCategory = categories.filter((obj) => obj.title === value);
      setcategory(selectedCategory);
      getCategoryResult(selectedCategory);
      console.log("category selected: ", selectedCategory);
    }
  };
  function categoryList() {
    return (
      <>
        <select
          className="form-select "
          name="category"
          onChange={categoryChange}
          id="category"
        >
          <option value="all" selected disabled hidden>
            Please select category
          </option>
          {categories.length > 0 && (
            <>
              {categories.map((contestcat) => (
                <option key={contestcat._id}> {contestcat.title}</option>
              ))}
            </>
          )}
        </select>
      </>
    );
  }
  return (
    <>
      <div className="container my-3">
        <h4 className="fw-bold">Choose Category</h4>
        {categoryList()}
        <div className="row justify-content-around text-center my-3">
          {results.length === 0 && (
            <>
              <p>No votes were casted in this category</p>
            </>
          )}

          {results.length > 2 && (
            <>
              <div className={"mt-5 col-4"}>
                <h1 className="fw-bold mb-0">#3</h1>
                <h5>
                  {" "}
                  <b> Winner:</b> <br /> {results[2].username[0]}
                </h5>
                <Contentcard
                  key={results[2].contentid[0]}
                  userID={results[2].userid[0]}
                  contestID={props.contestID}
                  choiceID={results[2]._id}
                  categoryID={category._id}
                  contentID={results[2].contentid[0]}
                  link={decodeURIComponent(results[2].link[0])}
                  isResult={true}
                  col={12}
                  title={results[2].title[0]}
                  description={results[2].description[0]}
                />
              </div>
            </>
          )}
          {results.length > 0 && (
            <>
              <div className={"mt-1 col-4"}>
                <h1 className="fw-bold mb-0">#1</h1>
                <h5>
                  {" "}
                  <b> Winner:</b> <br /> {results[0].username[0]}
                </h5>
                <Contentcard
                  key={results[0].contentid[0]}
                  userID={results[0].userid[0]}
                  contestID={props.contestID}
                  choiceID={results[0]._id}
                  categoryID={category._id}
                  contentID={results[0].contentid[0]}
                  link={decodeURIComponent(results[0].link[0])}
                  isResult={true}
                  col={12}
                  title={results[0].title[0]}
                  description={results[0].description[0]}
                />
              </div>
            </>
          )}
          {results.length > 1 && (
            <>
              <div className={"mt-5 col-4"}>
                <h1 className="fw-bold mb-0">#2</h1>
                <h5>
                  {" "}
                  <b> Winner:</b> <br /> {results[1].username[0]}
                </h5>
                <Contentcard
                  key={results[1].contentid[0]}
                  userID={results[1].userid[0]}
                  contestID={props.contestID}
                  choiceID={results[1]._id}
                  categoryID={category._id}
                  contentID={results[1].contentid[0]}
                  link={decodeURIComponent(results[1].link[0])}
                  isResult={true}
                  col={12}
                  title={results[1].title[0]}
                  description={results[1].description[0]}
                />
              </div>
            </>
          )}
        </div>
        {/* {console.log("results, ", results)} */}
        {results.length > 0 && (
          <>
            <div className="container text-center">
              <h4 className="fw-bold mb-3 mt-4">
                Detailed Results (Top {Math.min(10, results.length)})
              </h4>
              <table className="table table-borderless other-search-table table-hover mb-2">
                <tbody>
                  <tr key="1">
                    <td className="fw-bold">Rank</td>
                    <td className="fw-bold">Content Title</td>
                    <td className="fw-bold">Uploader</td>
                    <td className="fw-bold">Total Votes</td>
                    <td className="fw-bold">Users Voted</td>
                  </tr>
                  {results
                    .slice(0, Math.min(10, results.length))
                    .map((result, index) => {
                      return (
                        <tr key={result._id}>
                          <td>#{index + 1}</td>
                          <td>
                            <PhotoProvider
                              maskOpacity={0.8}
                              bannerVisible={false}
                            >
                              <PhotoView key={result._id} src={decodeURIComponent(result.link[0])}>
                                <a>{result.title[0]}</a>
                              </PhotoView>
                            </PhotoProvider>
                          </td>
                          {/* <td>{result.title[0]}</td> */}
                          <td>
                            <Link
                              to={"/profile/" + result.userid[0]}
                              state={{ id: result.userid[0] }}
                            >
                              {result.username[0]}
                            </Link>
                          </td>
                          <td>{result.totalVote}</td>
                          <td>{result.votercount}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};
