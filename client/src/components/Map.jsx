import React from 'react';
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
  HeatmapLayer,
  useLoadScript, 
} from "@react-google-maps/api";
import {Places} from './Places'
import { getCityNameFromCoordinates } from '../helperFunctions';
import GetNews from './GetNews';
import { generateCircularPoints } from '../helperFunctions';
import Distance from './distance';


export const Map = () => {

  const [userLocation, setUserLocation] = useState(null);
  const [travelLoc, setTravelLoc] = useState(null);
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  const [travelLocHeatmap, setTravelLocHeatmap] = useState([]);
  const [directions, setDirections] = useState();

  const mapRef = useRef();

  const onLoad = useCallback(map => {(mapRef.current = map)
  }, []);

  const options = useMemo(() => ({
    disableDefaultUI: true,
    clickableIcons: false,
    mapId: '9b2fc300a91ad9ae'
  }), [])

  const fetchDirections = (position) => {
    if (!travelLoc) return;

    const service = new window.google.maps.DirectionsService();
    service.route({
      origin: travelLoc,
      destination: position,
      travelMode: window.google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === "OK" && result) {
        setDirections(result)
      }
    })
  }

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
          //Has the facility data in a array after the user searches an area
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
      //create more circular function
      setTravelLocHeatmap(targetLocationArray);
      getCityNameFromCoordinates(travelLoc.lat, travelLoc.lng).then(name => console.log(name)).catch(error => console.log(error))
    }

    }, [travelLoc]);

    const score10Gradient = [
      'rgba(0,0,0,0)',
      'rgba(0, 128, 0, 0.5)',   // Dark green
      'rgba(0, 255, 0, 1)'      // Light green
    ];

    const score9Gradient = [
      'rgba(0,0,0,0)',
      'rgba(0, 255, 0, 0.5)',      // Light green
      'rgba(144, 238, 144, 1)'    // Lighter green
    ];

    const score8Gradient = [
      'rgba(0,0,0,0)',
      'rgba(0, 255, 0, 0.5)',  // Light green
      'rgba(255, 255, 0, 1)'  // Yellow
    ];

    const score7Gradient = [
      'rgba(0,0,0,0)',
      'rgba(173, 255, 47, 0.5)',  // Lighter green
      'rgba(255, 255, 0, 1)'    // Yellow
    ];

    const score6Gradient = [
      'rgba(0,0,0,0)',
      'rgba(255, 255, 0, 0.5)',  // Yellow
      'rgba(255, 204, 0, 1)'    // Darker yellow
    ];

    const score5Gradient = [
      'rgba(0,0,0,0)',
      'rgba(255, 204, 0, 0.5)',  // Dark yellow
      'rgba(255, 128, 0, 1)'    // Orange
    ];
  
    const score4Gradient = [
      'rgba(0,0,0,0)',
      'rgba(255, 128, 0, 0.5)',  // Orange
      'rgba(255, 0, 127, 1)'    // Pink
    ];

  const score3Gradient = [
    'rgba(0,0,0,0)',
    'rgba(255, 0, 127, 0.5)',  // Pink
    'rgba(255, 64, 64, 1)'    // Light Red
  ];
  const score2Gradient = [
    'rgba(0,0,0,0)',
    'rgba(255, 64, 64, 0.5)',  // Light Red
    'rgba(255, 0, 0, 1)'      // Slightly Darker Red
  ];

  const score1Gradient = [
    'rgba(0,0,0,0)',
    'rgba(255, 0, 0, 0.5)',  // Red
    'rgba(139, 0, 0, 1)'    // Darker Red
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
          {/* <GetNews /> */}

          {!travelLoc && <p>City of Interest</p>}
          {directions && <Distance leg={directions.routes[0].legs[0]} />}

        </div>
      <div className = 'map'>
      
        <GoogleMap options = {options} mapContainerClassName = 'map-container' zoom = {10} center = {userLocation || { lat: 0, lng: 0 }} onLoad={onLoad}> 

        {directions && <DirectionsRenderer directions={directions} options={{
          polylineOptions: {
          zIndex: 50,
          strokeColor: "#1976D2", 
          strokeWeight: 5,
          },
        }} />}

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
              url: facility.icon, 
              scaledSize: new window.google.maps.Size(20, 20),
            }} 
            onClick={(() => {
              fetchDirections({
                lat: facility.geometry.location.lat(),
                lng: facility.geometry.location.lng(),
              })
            })} /> ))}
        
        </>)}
        <HeatmapLayer data = {travelLocHeatmap} options = {{radius: 30, gradient: score10Gradient}} />
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