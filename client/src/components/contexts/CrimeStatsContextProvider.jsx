import axios from 'axios';
import { useEffect, createContext, useContext, useState } from "react";

const CrimeStatsContext = createContext();

export const CrimeStatsContextProvider = ({children}) => {

    

    const fetchCitysStats = async(cityName) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/crimestats?cityName=${cityName}`);
            const citysStats = res.data;
            
            return citysStats;
        } catch(error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchCitysStats('Tel Aviv');
    }, [])

    
    return (
        <CrimeStatsContext.Provider value={
            {
                fetchCitysStats
            }
        }>
            {children} </CrimeStatsContext.Provider>
    )
}

export {
    CrimeStatsContext
};
