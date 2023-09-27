import { useLoadScript } from "@react-google-maps/api";
import { Map } from "../Map";
import React from 'react'

export const MapPage = () => {

    const {isLoaded} = useLoadScript({
        googleMapsApiKey: "AIzaSyCbuKTPq31wT2ZjUAldR3_oDPgb29Ccdp4",
        //put in .env
        libraries: ["places", 'visualization']
});
if (!isLoaded) { return <>Loading...</>}
    
  return (
    <div>
        <Map/>
    </div>
  )
}
