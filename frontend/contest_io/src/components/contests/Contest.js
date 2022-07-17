import React from 'react'
import {Routes, Route } from "react-router-dom";
import { Search } from "./search";
import {ContestHome} from './ContestHome'
import {ContestSearch} from './ContestSearch'

export const Contest = ({id}) => {
  return (
    <>
        <div className="container py-3">
          <Search
            apiURI={`/api/contests/query?`}
            searchPlaceHolder="Search for Contests..."
            queryOn="title"
            keyval="_id"
          />
          <Routes>
            <Route path="" element={<ContestHome id={id} />} />
            <Route path="search" element={<ContestSearch />} />
          </Routes>
        </div>
    </>
  )
}
