import {ContestContext } from "../contexts/contest.context";
import { useContext } from "react";

export const useContestContext = () => {
    const context = useContext(ContestContext)

    if(!context) {
        throw Error('useContestContext must be used inside a ContestsContextProvider')
    }

    return context 
}