import { createContext, useReducer } from "react";

export const ContestContext = createContext()

export const contestsReducer = (state, action) => {
    switch(action.type) {
        case 'SET_CONTESTS':
            return {
                contests : action.payload
            }
        case 'CREATE_CONTEST' :
            return {
                contests : [action.payload, ...state.contests]
            }
        case 'DELETE_CONTEST' :
            return {
                contests : state.contests.filter((contest) => contest._id !== action.payload._id)
            }
        default:
            return state
    }
}

export const ContestContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(contestsReducer, {
        contests : null
    })

    return (
        <ContestContext.Provider value={{...state, dispatch}}>
            {children}
        </ContestContext.Provider>
    )
}