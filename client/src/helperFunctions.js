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