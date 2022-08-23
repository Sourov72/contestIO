import React from "react";
import { ContestCard } from "./contestCard";
import { Link } from "react-router-dom";

export const ContestBox = ({ contests, boxTitle, q, col }) => {
  return (
    <div className="row py-2 mb-4 contest-box card-group">
      <h4 className="text-center fw-bold">{boxTitle}</h4>
      {contests.length > 0 ? (
        <>
          {/* {console.log("cotn", contests[0])} */}
          {contests.map((contest) => {
            {
              if (contest !== null) {
                return (
                  <ContestCard key={contest._id} contest={contest} col={col} />
                );
              }
            }
          })}
          {col == 12 && (
            <Link
              className="d-flex justify-content-center"
              to="/contests/search"
              state={{ query: q }}
            >
              <button className="btn btn-danger px-4">View More</button>
            </Link>
          )}
        </>
      ) : (
        <div className="text-center fw-light fst-italic text-muted">
          no contests to show
        </div>
      )}
    </div>
  );
};
