import React, {useEffect} from 'react'
import { ContestBox } from './contestBox'

// hooks
import { useContestContext } from "../../hooks/useContestContext";

export const ContestHome = () => {
  // contest stuff
  const {contests, dispatch} = useContestContext() 

  // fires when the function is called
  useEffect(() => {
    const fetchContests = async ()=> {
    const response = await fetch('/api/contests')
    const json = await response.json()

    if(response.ok) {
        dispatch({type : 'SET_CONTESTS', payload : json})
    }
  }

  fetchContests()
}, [dispatch])


  return (
    <div className="container">
        <div className="row">
          <div className="col-4 ">
            <ContestBox contests={contests} boxTitle="Ongoing Contests"/>
          </div>
          <div className="col-4 ">
            <ContestBox contests={contests} boxTitle="Upcoming Contests"/>
          </div>
          <div className="col-4 ">
            <ContestBox contests={contests} boxTitle="My Contests"/>
            <ContestBox contests={contests} boxTitle="Past Contests"/>
          </div>
        </div>
      </div>
  )
}

