import React from "react";
import { ContestCard } from "./contestCard";

export const ContestBox = ({contests, boxTitle}) => {
  return (
    <div className="row py-2 mb-4 contest-box">
      <h3 className="text-center fw-bold">{boxTitle}</h3>
      {contests.length > 0 ? 
        contests.map((contest) => (
        <ContestCard key={contest._id} contest={contest} />
        ))
        : <div className="text-center fw-light fst-italic text-muted">no contests to show</div>}
    </div>
  );
};
