import { useJsApiLoader } from "@react-google-maps/api";
import React, { Component, Fragment } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import useScript from 'react-script-hook';


class LocationSearchInput extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: ""
    };
    
  }
  

  handleChange = (address: any) => {
    this.setState({ address });
  };

  handleSelect = (address: any) => {
    geocodeByAddress(address)
      .then((results: any[]) => getLatLng(results[0]))
      .then((latLng: any) => console.log('Success', latLng))
      .catch((error: any) => console.error('Error', error));
  };


  render() {
    return (

      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }

}

export default React.memo(LocationSearchInput);


// import { useEffect } from "react";
// import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";

// export default () => {
//   const {
//     placesService,
//     placePredictions,
//     getPlacePredictions,
//     isPlacePredictionsLoading,
//   } = usePlacesService({
//     apiKey: process.env.REACT_APP_GOOGLE,
//   });

//   useEffect(() => {
//     // fetch place details for the first element in placePredictions array
//     if (placePredictions.length)
//       service.placesService?.getDetails(
//         {
//           placeId: placePredictions[0].place_id,
//         },
//         (placeDetails) => savePlaceDetailsToState(placeDetails)
//       );
//   }, [placePredictions]);

//   return (
//     <>
//       <Input
//         placeholder="Debounce 500 ms"
//         onChange={(evt) => {
//           getPlacePredictions({ input: evt.target.value });
//         }}
//         loading={isPlacePredictionsLoading}
//       />
//       {placePredictions.map((item) => renderItem(item))}
//     </>
//   );
// };