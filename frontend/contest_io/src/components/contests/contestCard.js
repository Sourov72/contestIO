import React from 'react'

export const ContestCard = ({contest}) => {
  return (
    <div className="col-12 mt-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{contest.title}</h5>
            <p className="card-text">
              contest id: {contest.contestID} <br/>
              host id: {contest.hostID} <br/>
              objective: {contest.objective} <br/>
            </p>
            <button className="btn btn-primary">{contest.type}</button>
          </div>
        </div>
      </div>
  )
}