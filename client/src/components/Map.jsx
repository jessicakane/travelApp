import React from 'react';
import { useState, useEffect, useMemo, useCallback, useRef, useContext } from "react";
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
import { getCityNameFromCoordinates, getLocationDetailsFromCoordinates, generateDataPointsIsrael } from '../helperFunctions';
import GetNews from './GetNews';
import { generateCircularPoints } from '../helperFunctions';
import Distance from './distance';
import { CrimeStatsContext } from './contexts/CrimeStatsContextProvider';
import './Map.css'


export const Map = () => {

  const [userLocation, setUserLocation] = useState(null);
  const [travelLoc, setTravelLoc] = useState(null);
  const [medicalFacilities, setMedicalFacilities] = useState([]);
  const [travelLocHeatmap, setTravelLocHeatmap] = useState([]);
  const [directions, setDirections] = useState();
  const [cityName, setCityName] = useState(false);
  const [safetyScore, setSafetyScore] = useState(0);
  const [gradient, setGradient] = useState(false);
  const [pointsForMap, setPointsForMap] = useState([]);
  const [cityStats, setCityStats] = useState(false);
  const [zoom, setZoom] = useState(8);

  const {fetchCitysStats} = useContext(CrimeStatsContext)

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
    updatePointsForMap();
  }, []);

  const updatePointsForMap = async() => {
    const dataPoints = [
      [32.0803161, 34.7699044],
      [31.75465609999999, 35.218185],
      [32.013186, 34.748019],
      [32.7940463, 34.989571],
      [32.0852999, 34.78176759999999],
      [31.768319, 35.21371],
      [32.7907886, 34.9862417],
      [32.084041, 34.887762],
      [31.9730015, 34.7925013],
      [32.015833, 34.787384],
      [31.892773, 34.811272],
      [31.890267, 35.010397],
      [31.747041, 34.988099],
      [32.4340458, 34.9196518],
      [31.069419, 35.033363],
      [31.423196, 34.595254],
      [31.804381, 34.655314],
      [31.6687885, 34.5742523],
      [31.951014, 34.888075],
      [31.252973, 34.791462],
      

    ];
    for (const dataPoint of dataPoints) { 
      const name = await getCityNameFromCoordinates(dataPoint[0], dataPoint[1]);
      // console.log(name);
      if (name) {
      const cityStats = await fetchCitysStats(name);
      // console.log(cityStats);
      if (cityStats) {
        const score = Math.round(cityStats.NormalizeScore*10)
        if (score) {
        dataPoint.push(`score${score}Gradient`);} else {
          dataPoint.push('score0Gradient');
        }
      }}
      if (dataPoint.length === 2) {
        dataPoint.push('score0Gradient')
      }
      let heatMapData = [];
      const targetLocationArray = generateCircularPoints([dataPoint[0], dataPoint[1]], 0.001, 20)
      // console.log(targetLocationArray)
      targetLocationArray.push([dataPoint[0], dataPoint[1]]);
      const miniArray = generateCircularPoints([dataPoint[0], dataPoint[1]], 0.0009, 20);
      for (const point of miniArray) {
        targetLocationArray.push(point);
      }
      for (const point of targetLocationArray) {
        heatMapData.push(new window.google.maps.LatLng(point[0], point[1]));
        
      }
      // console.log(heatMapData)
      dataPoint.push(heatMapData);
    }
    
    setPointsForMap(dataPoints)
    // console.log(dataPoints)
  }

  useEffect(() => {
    // console.log(pointsForMap)
  }, [pointsForMap])

  useEffect(() => {
    if (travelLoc) {
      console.log([travelLoc.lat, travelLoc.lng])
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
      setZoom(10);

      const targetLocationArray = generateCircularPoints([travelLoc.lat, travelLoc.lng], 0.001, 20)
      // console.log(targetLocationArray)
      targetLocationArray.push([travelLoc.lat, travelLoc.lng]);
      const miniArray = generateCircularPoints([travelLoc.lat, travelLoc.lng], 0.0009, 20);
      for (const point of miniArray) {
        targetLocationArray.push(point);
      }
      let heatMapData = [];
      for (const point of targetLocationArray) {
        heatMapData.push(new window.google.maps.LatLng(point[0], point[1]));
        
      }
      //create more circular function
      setTravelLocHeatmap(heatMapData);
      getCityNameFromCoordinates(travelLoc.lat, travelLoc.lng).then(name => setCityName(name)).catch(error => console.log(error))
    }

    }, [travelLoc]);

    useEffect(() => {
      getCitysScore(cityName);
    }, [cityName])

    useEffect(() => {
      if (getCitysScore(cityName)) {
      const gradientVariableName = `score${safetyScore}Gradient`;
      const selectedGradient = eval(gradientVariableName);
      setGradient(selectedGradient);}

    }, [safetyScore])

    const getCitysScore = async(cityName) => {
      const cityStats = await fetchCitysStats(cityName);
      console.log(cityStats)
      if (cityStats) {
        setCityStats(cityStats);
      setSafetyScore(Math.round(cityStats.NormalizeScore*10));
        return true
      }
      
      return false
    }

    const score1Gradient = [
      'rgba(0,0,0,0)',
      'rgba(0, 128, 0, 0.5)',   // Dark green
      'rgba(0, 255, 0, 1)'      // Light green
    ];

    const score0Gradient = [
      'rgba(0,0,0,0)',
      'rgba(0, 0, 0, 0)',   // Dark green
      'rgba(0, 0, 0, 0)'      // Light green
    ];



    const score2Gradient = [
      'rgba(0,0,0,0)',
      'rgba(0, 255, 0, 0.5)',      // Light green
      'rgba(144, 238, 144, 1)'    // Lighter green
    ];

    const score3Gradient = [
      'rgba(0,0,0,0)',
      'rgba(173, 255, 47, 0.5)',  // Lighter green
      'rgba(255, 255, 0, 1)'  // Yellow
    ];

    const score4Gradient = [
      'rgba(0,0,0,0)',
      'rgba(255, 128, 0, 0.5)',  // Orange
      'rgba(255, 0, 127, 1)'    // Yellow
    ];

    const score5Gradient = [
      'rgba(0,0,0,0)',
    'rgba(255, 0, 127, 0.5)',  // Pink
    'rgba(255, 64, 64, 1)'   // Darker yellow
    ];

    const score6Gradient = [
      'rgba(0,0,0,0)',
    'rgba(255, 64, 64, 0.5)',  // Light Red
    'rgba(255, 0, 0, 1)'   // Orange
    ];
  
    const score7Gradient = [
      'rgba(0,0,0,0)',
    'rgba(255, 0, 0, 0.5)',  // Red
    'rgba(139, 0, 0, 1)'    // Pink
    ];

  const score8Gradient = [
    'rgba(0,0,0,0)',
    'rgba(255, 0, 0, 0.5)',  // Red
    'rgba(139, 0, 0, 1)'   // Light Red
  ];
  const score9Gradient = [
    'rgba(0,0,0,0)',
    'rgba(255, 0, 0, 0.5)',  // Red
    'rgba(139, 0, 0, 1)'     // Slightly Darker Red
  ];

  const score10Gradient = [
    'rgba(0,0,0,0)',
    'rgba(255, 0, 0, 0.5)',  // Red
    'rgba(139, 0, 0, 1)'    // Darker Red
  ];

  

  return (
    <div className='container'>
      <div className = 'controls'>
        <h1>SafePassage</h1>
        <Places setGradient = {setGradient} score0Gradient = {score0Gradient} setTravelLoc = {(position) => {
          setTravelLoc(position);
          mapRef.current?.panTo(position)}} />
      

          {pointsForMap.length === 0 && <div className = 'mapColorLoader'>Please wait while we color your map...</div>}
          {pointsForMap.length > 0 && <><div className = 'gradientBackgroundDiv'></div><div className = 'keyContainer'><div className = 'danger'>Dangerous</div><div className = 'safe'>Safe</div></div></>}
          {directions && <Distance leg={directions.routes[0].legs[0]} />}
          <div className = 'staySafe'>
          <div><strong>Stay Safe </strong>in Israel:</div>
          <p>
          <strong>Emergency Numbers</strong><br/>
          100 - Police 👮‍♀️<br/>
          101 - Ambulance 🚑<br/>
          102 - Fire 🧯 
          </p>  
          <GetNews />  
        </div>
        </div>
      <div className = 'map'>
      {cityStats && <div className = 'displayStats'>{cityName} <br/><strong>Theft score:</strong> {' ' + cityStats.theft_score}<br/> <strong>Assault score: </strong>{cityStats.assault_score} <br/> <strong>Medical facilities</strong>: {medicalFacilities.length}</div>}
      
        <GoogleMap options = {options} mapContainerClassName = 'map-container' zoom = {zoom} center = {userLocation || { lat: 0, lng: 0 }} onLoad={onLoad}> 

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
        {pointsForMap.length > 0 && pointsForMap.map(point => <HeatmapLayer data = {point[3]} options = {{radius: 10, gradient: eval(point[2])}} />)}
        <HeatmapLayer data = {travelLocHeatmap} options = {{radius: 30, gradient: gradient}} />
        </GoogleMap>
        {/* <GetNews />   */}
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