import React from "react";
import { Link } from "react-router-dom";

export const ContestCard = ({ contest, col }) => {
  const redStyle = {
    color: "red",
    fontWeight: "bold",
  };
  const greenStyle = {
    color: "green",
    fontWeight: "bold",
  };

  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("en-us", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "[Date]";
  };

  const formatReg = () => {
    const today = new Date();
    const regEndDay = new Date(contest.registrationEndTime);
    return today > regEndDay ? (
      <span style={redStyle}>Closed</span>
    ) : (
      <span style={greenStyle}>Open</span>
    );
  };

  const getBadges = () => {
    const today = new Date();
    const endDay = new Date(contest.endTime);
    const regEndDay = new Date(contest.registrationEndTime);
    return (
      <>
        {/* contest types */}
        {contest.type === "Public" && (
          <span className="badge rounded-pill bg-success">Public</span>
        )}
        {contest.type === "Private" && (
          <span className="badge rounded-pill bg-danger ">Private</span>
        )}
        {contest.type === "Open" && (
          <span className="badge rounded-pill bg-info text-dark ">Open</span>
        )}

        {/* contest times */}
        {endDay < today && (
          <span className="badge rounded-pill bg-light text-dark ">
            Finished
          </span>
        )}
        {regEndDay <= today && today < endDay && (
          <span className="badge rounded-pill bg-warning text-dark ">
            Ongoing
          </span>
        )}
        {regEndDay > today && (
          <span className="badge rounded-pill bg-primary ">Upcoming</span>
        )}

        {/* anonymity */}
        {contest.voterAnonymity === 1 && (
          <span className="badge rounded-pill bg-secondary">Anonymous</span>
        )}
      </>
    );
  };

  const cardBody = () => {
    return (
      
      <Link to={"/contests/" + contest._id} state={{contestID : contest._id}}>
        <div className="card h-100 contest-card">
          <div className="card-body">
            <h5 className="fw-bold text-capitalize">{contest.title}</h5>
            <p className="card-text">
              {contest.objective} <br />
              {formatDate(contest.registrationEndTime)} -{" "}
              {formatDate(contest.endTime)} <br />
              Registration: {formatReg()}
            </p>
            <div className="badges">{getBadges()}</div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      {col === 12 ? (
        <div className="col-12 mb-3">{cardBody()}</div>
      ) : (
        <div className="col-6 mb-3">{cardBody()}</div>
      )}
    </>
  );
};
