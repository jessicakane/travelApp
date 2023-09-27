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
    // Check if geolocation is available in the user's browser
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
    // Perform Nearby Search for medical facilities when travelLoc is available
    if (travelLoc) {
      const targetLocation = new window.google.maps.LatLng(
        travelLoc.lat,
        travelLoc.lng
      );

      const request = {
        location: targetLocation,
        radius: 25000, // 15 km radius
        keyword: "medical facility", // Keyword to search for medical facilities
        type: ["hospital", "clinic", "medical"], // Specify the types you want
      };

      const service = new window.google.maps.places.PlacesService(mapRef.current);

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Set the found medical facilities
          setMedicalFacilities(results);
        } else {
          console.error("Nearby Search request failed with status:", status);
        }
      });
    }
    if (travelLoc) {
      // Create an array containing the user's searched location
      const userSearchedLocation = [new window.google.maps.LatLng(
        travelLoc.lat,
        travelLoc.lng
      )];

      for (let i = 0.001; i <0.009; i = i + 0.001) {
        userSearchedLocation.push(new window.google.maps.LatLng(travelLoc.lat + i, travelLoc.lng + i));
        userSearchedLocation.push(new window.google.maps.LatLng(travelLoc.lat -i, travelLoc.lng - i));
      }
  
  
      // Set the updated heatmap data in state 
      setTravelLocHeatmap(userSearchedLocation);
      getCityNameFromCoordinates(travelLoc.lat, travelLoc.lng).then(name => console.log(name)).catch(error => console.log(error))
    }
    console.log(travelLoc)
    
  }, [travelLoc]);

  const lighterPinkGradientArray = [
    'rgba(255, 255, 255, 0)',
    'rgba(255, 182, 193, 0.5)', // Light Pink
    'rgba(255, 105, 180, 1)'        // Red
  ];

  const greenGradientArray = [
    'rgba(0, 0, 0, 0)',
    'rgba(0, 128, 0, 0.5)', // Green
    'rgba(0, 255, 0, 1)'    // Bright Green
  ];

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
        <HeatmapLayer data = {travelLocHeatmap} options = {{radius: 30, gradient: lighterPinkGradientArray}} />
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

//const generateHouses = (position: google.maps.LatLngLiteral) => {
//  const _houses: Array<google.maps.LatLngLiteral> = [];
//  for (let i = 0; i < 100; i++) {
//    const direction = Math.random() < 0.5 ? -2 : 2;
//    _houses.push({
//      lat: position.lat + Math.random() / direction,
//      lng: position.lng + Math.random() / direction,
//    });
//  }
//  return _houses;
//};

const findMedicalFacilities = (location, radius) => {
  const request = {
    location: location,
    radius: 15000, // 15 km radius (in meters)
    keyword: 'medical facility', // Keyword to search for medical facilities
    type: ['hospital', 'clinic'], // Specify the types you want (you can add more if needed)
  };
  
}
