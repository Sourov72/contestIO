import React, {useEffect, useState} from 'react'
import { ContestBox } from './contestBox'
import {Search} from './search'

import {obj2qstr, arr2str} from '../helperFunctions'

// hooks
import { useContestContext } from "../../hooks/useContestContext";



export const ContestHome = ({id}) => {
  // contest stuff
  const [ongoingContests, setOngoing] = useState([]) 
  const [upcomingContests, setUpcoming] = useState([]) 
  const [myContests, setMy] = useState([]) 
  const [pastContests, setPast] = useState([]) 

  // fires when the function is called
  useEffect(() => {
    const fetchContests = async (query, func)=> {
    const response = await fetch(`/api/contests/query?${query}`)
    const json = await response.json()

    if(response.ok) {
        func(json)
    }
  }
  const today = new Date()
  fetchContests(obj2qstr({
    endTime: arr2str(['gt', today.toJSON()]),
    limit: arr2str(['limit', 3])
  }), setOngoing)
  fetchContests(obj2qstr({
    startTime: arr2str(['gt', today.toJSON()]),
    limit: arr2str(['limit', 3])
  }), setUpcoming)
  fetchContests(obj2qstr({
    hostID: arr2str(['eq', 2]),
    limit: arr2str(['limit', 2])
  }), setMy)
  fetchContests(obj2qstr({
    endTime: arr2str(['lt', today.toJSON()]),
    limit: arr2str(['limit', 3])
  }), setPast)
}, [])


  return (
    <div className="container py-3">
        <Search apiURI={`/api/contests/query?`} searchPlaceHolder="Search for Contests..." queryOn="title" keyval="contestID" />
        <div className="row">
          <div className="col-4 ">
            <ContestBox contests={ongoingContests} boxTitle="Ongoing Contests"/>
          </div>
          <div className="col-4 ">
            <ContestBox contests={upcomingContests} boxTitle="Upcoming Contests"/>
          </div>
          <div className="col-4">
            <ContestBox contests={myContests} boxTitle="My Contests"/>
            <ContestBox contests={pastContests} boxTitle="Past Contests"/>
          </div>
        </div>
      </div>
  )
}

