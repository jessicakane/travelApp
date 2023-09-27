import React from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";


export const Places = ({setTravelLoc, setGradient, score0Gradient}) => {

  const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();

  const handleSelect = async(location) => {
    setGradient(score0Gradient);
    setValue(location, false);
    clearSuggestions();
    const results = await getGeocode({address: location});
    const {lat, lng} = await getLatLng(results[0]);
    setTravelLoc({lat, lng});
  }

  return (
    <Combobox onSelect = {handleSelect}>
      <ComboboxInput value = {value} onChange = {e => setValue(e.target.value)} className = 'combobox-input' placeholder='Travel Destination'/>
      <ComboboxPopover>
        <ComboboxList>
          {status === 'OK' && data.map(({place_id, description}) => <ComboboxOption place_id = {place_id} value = {description}/>)}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  )
}
