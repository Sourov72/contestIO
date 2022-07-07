import React from "react";
import { ContestCard } from "./contestCard";

export const ContestBox = ({contests, boxTitle}) => {
  return (
    <div className="row">
      <h3>{boxTitle}</h3>
      {contests && contests.map((contest) => (
        <ContestCard key={contest._id} contest={contest} />
      ))}
    </div>
  );
};
