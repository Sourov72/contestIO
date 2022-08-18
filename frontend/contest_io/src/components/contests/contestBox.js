import React from "react";
import { ContestCard } from "./contestCard";
import { Link } from "react-router-dom";

export const ContestBox = ({contests, boxTitle, q, col}) => {
  var fol=1;
  function myfollowClick(){
    fol=1-fol;
  }
  return (
    
    <div className="row py-2 mb-4 contest-box card-group">
      <h4 className="text-center fw-bold">{boxTitle}</h4>
      {contests.length > 0 ? 
        <>
        {contests.map((contest) => (
        <div>
          <ContestCard key={contest._id} contest={contest} col={col}  />
          {fol > 0 ? 
              <>
               <button onClick={myfollowClick()} type="button" class="btn btn-success btn-sm">Follow</button>
              </>

              : <button onClick={myfollowClick()} type="button" class="btn btn-danger btn-sm">Unfollow</button>}
              <br></br>
              <br></br>
        </div>
        ))
        }
        {col === 12 && 
        <Link className="d-flex justify-content-center" to="/contests/search" state={{query : q}}>
          <button className="btn btn-danger px-4">View More</button>
        </Link>}
        </>

        : <div className="text-center fw-light fst-italic text-muted">no contests to show</div>}
    </div>
  );
};
