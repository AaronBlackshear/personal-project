/* eslint-disable no-undef */
import React, { Component } from "react";
import LoginNav from "../../Nav/LoginNav/LoginNav";
import { connect } from "react-redux";
import Error from "../../Error/Error";
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer
} from "react-google-maps";
import { getCompany, setDirections } from "../../../ducks/company";
import { locationError, updateLocation } from "../../../ducks/users";
import "./GoogleDirections.css";

class GoogleDirections extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {
    console.log("component did mount was hit");
    this.props.getCompany(this.props.user_id);
    // this.props.locationErrors ||
    !this.props.userLat || !this.props.userLong
      ? navigator.geolocation.getCurrentPosition(
          position => {
            this.props.updateLocation(
              position.coords.latitude,
              position.coords.longitude
            );
            console.log(
              `LATITUDE : => ${position.coords.latitude}, LONGITUDE : => ${
                position.coords.longitude
              }`
            );
          },
          error => {
            console.log("ERROR HIT");
            this.props.locationError();
          },
          {
            enableHighAccuracy: false,
            timeout: 300000,
            maximumAge: 0
          }
        )
      : null;
  }
  render() {
    console.log(this.props);
    let {
      userLat,
      userLong,
      currentCompanyLatitude,
      currentCompanyLongitude
    } = this.props;
    const Directions = compose(
      withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${
          process.env.REACT_APP_GOOGLE_MAP_KEY
        }`,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `800px`, width: "800px" }} />,
        mapElement: <div style={{ height: `100%`, width: "100%" }} />
      }),
      withScriptjs,
      withGoogleMap,
      lifecycle({
        componentDidMount() {
          const DirectionsService = new google.maps.DirectionsService();

          DirectionsService.route(
            {
              origin: new google.maps.LatLng(userLat, userLong),
              destination: new google.maps.LatLng(
                +currentCompanyLatitude,
                +currentCompanyLongitude
              ),
              travelMode: google.maps.TravelMode.DRIVING
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                this.setState({ directions: result });
              } else {
                console.error(`error fetching directions ${result}`);
              }
            }
          );
        }
      })
    )(props => (
      <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(41.85073, -87.65126)}
      >
        <DirectionsRenderer directions={props.directions} />
      </GoogleMap>
    ));
    <Directions />;
    let mapCompany = this.props.companys.map((e, i) => {
      return (
        <div onClick={() => this.props.setDirections(e.company_id)} key={i}>
          <h3>{e.name}</h3>
          <h3>Location: {e.location}</h3>
        </div>
      );
    });
    return (
      <div>
        <LoginNav />
        {!this.props.companys.length && this.props.currentUser[0] ? (
          <div>
            <h3>you have no business</h3>
          </div>
        ) : this.props.currentUser[0] && userLat && userLong ? (
          <div>
            <h3>Directions</h3>
            <div className="GoogleDirections">
              <Directions />
              <div className="mappedDirectionCompany">
                <h3 className="directionstitle">Jobs</h3>
                {mapCompany}
              </div>
            </div>
          </div>
        ) : this.props.currentUser[0] && !userLat && !userLong ? (
          <div>
            <h3>Loading...</h3>
          </div>
        ) : (
          <Error />
        )}
      </div>
    );
  }
}
let mapStateToProps = state => {
  return { ...state.users, ...state.company };
};
export default connect(mapStateToProps, {
  getCompany,
  setDirections,
  locationError,
  updateLocation
})(GoogleDirections);
