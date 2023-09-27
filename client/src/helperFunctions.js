

export const getCityNameFromCoordinates = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
      const apiKey = 'AIzaSyD4wav1ju33YJcb_sz0K1m1q-jsBUC2hYA';
      const geocodingEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
      fetch(geocodingEndpoint)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'OK' && data.results.length > 0) {
            const addressComponents = data.results[0].address_components;
            const cityComponent = addressComponents.find((component) =>
              component.types.includes('locality')
            );
            if (cityComponent) {
              resolve(cityComponent.long_name);
            } else {
              reject('City not found in geocoding results.');
            }
          } else {
            reject('Location not found.');
          }
        })
        .catch((error) => {
          reject('Error fetching data from Google Maps API.');
        });
    });
  }

export const generateCircularPoints = (center, radius, numPoints) => {
    const points = [];
    const angleIncrement = (2 * Math.PI) / numPoints; 
  
    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleIncrement;
      const x = center.lat + radius * Math.cos(angle);
     
      const y = center.lng + radius * Math.sin(angle);
     
      points.push([x,y]);
    }
  
    return points;
  };

export const generateDataPointsIsrael = () => {
    // Define the bounding box for Israel
const minLat = 29.45;
const maxLat = 33.5;
const minLon = 34.25;
const maxLon = 35.9;

// Number of data points you want
const numPoints = 200;

// Create a list to store LatLng points
const dataPoints = [];

// Generate data points
for (let i = 0; i < numPoints; i++) {
    // Generate random coordinates within the bounding box
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lon = minLon + Math.random() * (maxLon - minLon);

    // Create a LatLng object and add it to the list
    const point = new window.google.maps.LatLng(lat, lon);
    dataPoints.push(point);
}

// Now, dataPoints contains 200 random LatLng points within the bounding box of Israel
console.log(dataPoints);
}