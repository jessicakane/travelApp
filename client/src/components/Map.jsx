import React from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  HeatmapLayer,
  useLoadScript
} from "@react-google-maps/api";
import {Places} from './Places'
import { getCityNameFromCoordinates } from '../helperFunctions';

export const Map = () => {

  const [userLocation, setUserLocation] = useState(null);
  const [travelLoc, setTravelLoc] = useState(null);
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  const [travelLocHeatmap, setTravelLocHeatmap] = useState([]);

  const mapRef = useRef();

  const onLoad = useCallback(map => {(mapRef.current = map)
  }, []);

  const options = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: '9b2fc300a91ad9ae'
  }), [])

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(userLocation);
      });
    } else {
      console.error('Geolocation is not available in this browser.');
    }
    
  }, []);

  useEffect(() => {
    if (travelLoc) {
      const targetLocation = new window.google.maps.LatLng(
        travelLoc.lat,
        travelLoc.lng
      );

      const request = {
        location: targetLocation,
        radius: 25000, 
        keyword: "medical facility", 
        type: ["hospital", "clinic", "medical"], 
      };

      const service = new window.google.maps.places.PlacesService(mapRef.current);

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setMedicalFacilities(results);
        } else {
          console.error("Nearby Search request failed with status:", status);
        }
      });

      let targetLocationArray = [];
      for (let i = 0; i <0.009; i = i + 0.001) {
        targetLocationArray.push(new window.google.maps.LatLng(travelLoc.lat + i, travelLoc.lng + i));
        if (i>0) {
        targetLocationArray.push(new window.google.maps.LatLng(travelLoc.lat -i, travelLoc.lng - i));
        }
      }
      setTravelLocHeatmap(targetLocationArray);
      getCityNameFromCoordinates(travelLoc.lat, travelLoc.lng).then(name => console.log(name)).catch(error => console.log(error))
    }

    }, [travelLoc]);

  const mediumSafetyGradientArray = [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 182, 193, 0.5)', 
    'rgba(255, 105, 180, 1)'        
  ];

  const HighSafetyGradientArray = [
    'rgba(0, 0, 0, 0)',
    'rgba(0, 128, 0, 0.5)', 
    'rgba(0, 255, 0, 1)'    
  ];

  const LowSafetyGradientArray = [
    'rgba(0, 0, 0, 0)',
    'rgba(139, 0, 0, 0.5)', 
    'rgba(255, 0, 0, 1)'
  ]

  return (
    <div className='container'>
      <div className = 'controls'>
        <h1>SafePassage</h1>
        <Places setTravelLoc = {(position) => {
          setTravelLoc(position);
          mapRef.current?.panTo(position)}} />
          {travelLoc && (
            <>
            <div> There are {medicalFacilities.length} medical facilities within 25 km of your travel destination.</div>
            </>
          )}
        </div>
      <div className = 'map'>
      
        <GoogleMap options = {options} mapContainerClassName = 'map-container' zoom = {10} center = {userLocation || { lat: 0, lng: 0 }} onLoad={onLoad}> 
        {travelLoc && (
        <>
        <Marker position = {travelLoc} />
        <Circle center = {travelLoc} radius = {7000} options = {closeOptions}/>
        <Circle center = {travelLoc} radius = {15000} options = {middleOptions}/>
        <Circle center = {travelLoc} radius = {25000} options = {farOptions}/>
        {medicalFacilities.map((facility, index) => (
          <Marker
            key={`medical-facility-${index}`}
            position={{
              lat: facility.geometry.location.lat(),
              lng: facility.geometry.location.lng(),
            }}
            icon={{
              url: facility.icon, // Use the icon URL provided in the medicalFacilities array
              scaledSize: new window.google.maps.Size(20, 20),
            }} /> ))}
        
        </>)}
        <HeatmapLayer data = {travelLocHeatmap} options = {{radius: 30, gradient: HighSafetyGradientArray}} />
        </GoogleMap>
      
      </div>
    </div>
  )
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};