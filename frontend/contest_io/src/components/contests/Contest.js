import React from "react";
import { Outlet } from "react-router-dom";
import { Search } from "./search";
import { ContestHome } from "./ContestHome";
import { ContestSearch } from "./ContestSearch";

export const Contest = () => {
  return (
    <>
      {/* <Routes>
            <Route path="" element={<ContestHome id={id} />} />
            <Route path="search" element={<ContestSearch />} />
          </Routes> */}
      <Outlet />
    </>
  );
};
