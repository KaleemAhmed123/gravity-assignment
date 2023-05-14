import React, { useState, useEffect, useMemo } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./Home.scss";
import Navbar from "../../components/navbar/Navbar";
import icon from "/location.png";
import map from "/map.jpg";

const containerStyle = {
  width: "600px",
  height: "600px",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Home = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [waypoints, setWaypoints] = useState([""]);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);

  const libs = useMemo(() => ["places", "directions"], []);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAYBivEevsC3sXYWfY6n9803tvASqB0TUI",
    libraries: libs,
  });

  const handleDirectionsRequest = () => {
    const directionsService = new window.google.maps.DirectionsService();

    if (origin && destination) {
      const waypointsList = waypoints.map((waypoint) => ({
        location: waypoint,
        stopover: true,
      }));

      directionsService.route(
        {
          origin,
          destination,
          waypoints: waypointsList,
          travelMode: "DRIVING",
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
            const route = result.routes[0];
            let totalDistance = 0;
            for (let i = 0; i < route.legs.length; i++) {
              totalDistance += route.legs[i].distance.value;
            }
            setDistance(totalDistance / 1000); //convert to km
          }
        }
      );
    }
  };

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleAddWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const handleWaypointChange = (index, value) => {
    setWaypoints((prevWaypoints) => {
      const newWaypoints = [...prevWaypoints];
      newWaypoints[index] = value;
      return newWaypoints;
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="home">
      <Navbar />
      {/* <Input /> */}
      <div className="map-container">
        <h2>Lets calculate distance from google map</h2>
        <div className="main">
          <div className="left">
            <label>Origin</label>
            <Autocomplete>
              <input type="text" value={origin} onChange={handleOriginChange} />
            </Autocomplete>

            <label>Destination</label>
            <Autocomplete>
              <input
                type="text"
                value={destination}
                onChange={handleDestinationChange}
              />
            </Autocomplete>

            {waypoints?.map((waypoint, index) => (
              <div key={index}>
                <label>Waypoint {index + 1}</label>
                <Autocomplete>
                  <input
                    type="text"
                    value={waypoint}
                    onChange={(event) =>
                      handleWaypointChange(index, event.target.value)
                    }
                  />
                </Autocomplete>
              </div>
            ))}

            <button className="addway" onClick={handleAddWaypoint}>
              ➕ Add another stop
            </button>

            <button className="btn-cta" onClick={handleDirectionsRequest}>
              Get Directions
            </button>

            {directions && (
              <div className="distance-box">
                <div className="distance">
                  <h2>Distance: </h2>
                  <h2 className="value">{distance} km</h2>
                </div>

                <p className="para">
                  The distance between {origin} and {destination} via the
                  seleted route is {distance} kms.
                </p>
              </div>
            )}
          </div>

          <div className="right">
            {/* {!directions && <img src={map} alt="" />} */}
            {directions && (
              <div>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={directions.routes[0].legs[0].start_location}
                  zoom={7}
                  options={mapOptions}
                >
                  <DirectionsService
                    options={{
                      origin,
                      destination,
                      waypoints,
                      travelMode: "DRIVING",
                    }}
                    callback={(response) => setDirections(response)}
                  />
                  <DirectionsRenderer directions={directions} />
                </GoogleMap>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
