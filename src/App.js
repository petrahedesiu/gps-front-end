import React, {Component} from 'react';
import { GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

import {CurrentLocation} from './Map';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
<<<<<<< Updated upstream
        busMarker: {}
    };

    dataBase() {
        onValue (ref(db, "buses/" + 1), (snapshot) => {
            if (JSON.stringify(this.state.busesLocation) !== JSON.stringify([snapshot.val()])) {
                this.state.busesLocation = [snapshot.val()];
=======
        busLocation: [],
        busStation: [],
    };

    dataBase() {
        onValue (ref(db, "buses"), (snapshot) => {
            console.log('firebaseBUSES', snapshot.val());
            if (JSON.stringify(this.busLocation) !== JSON.stringify(snapshot.val())) {
>>>>>>> Stashed changes
                this.setState({
                    showingInfoWindow: false,
                    activeMarker: {},
                    selectedPlace: {},
<<<<<<< Updated upstream
                    busesLocation: [snapshot.val()],
                    busesLocationInitialised: true,
=======
                    busLocation: snapshot.val(),
                    busStation: [],
>>>>>>> Stashed changes
                })
            }
        });

        onValue (ref(db, "stations"), (snapshot) => {
            console.log('firebaseSTATIONS', snapshot.val());
            //if (JSON.stringify(this.busStation) !== JSON.stringify(snapshot.val())) {
                this.setState({
                    showingInfoWindow: false,
                    activeMarker: {},
                    selectedPlace: {},
                    busLocation: [],
                    busStation: snapshot.val(),
                })
            //}
            console.log("STAIONS STATE", this.busStation)
        });
    }

    onMarkerClick = (props, marker) =>
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    onClose = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            });
        }
    };

    displayMarkers = () => {
        const busIcon = { url: 'https://img.icons8.com/material-outlined/344/bus.png', scaledSize: { width: 30, height: 30} };
<<<<<<< Updated upstream
        if (this.state.busesLocation) {
            console.log('displayMarkers', this.state.busesLocation);
            return this.state.busesLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busLocation.line} name={<div><h1 color="grey">{busLocation.line}</h1>{busLocation.id}</div>} icon={busIcon} position={{
=======
        if (this.state.busLocation) {
            console.log('displayBusMarkers', this.state.busLocation);
            return this.state.busLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busLocation.line} name={<div><h1 color="grey">{busLocation.line}</h1>id:{busLocation.id}</div>} icon={busIcon} position={{
>>>>>>> Stashed changes
                    lat: busLocation.lat,
                    lng: busLocation.lng
                }}
                />
<<<<<<< Updated upstream
=======
            })
        }
    }

    displayStationsMarkers = () => {
        const stationIcon = { url: "https://i.im.ge/2022/09/27/1yWfsx.bus-station-marker.png", scaledSize: { width: 10, height: 10} };
        return this.state.busStations.map((busStation, index) => {
            return <Marker onClick={this.onMarkerClick} title={busStation.name} name={<div><h1 color="grey">{busStation.name}</h1></div>} icon={stationIcon} position={{
                lat: busStation.lat,
                lng: busStation.lng
            }}
            />
>>>>>>> Stashed changes
        })
        }
    }

    render() {
        const meIcon = { url: 'https://img.icons8.com/ios-glyphs/344/person-male.png', scaledSize: { width: 30, height: 30} };
        this.dataBase();
        return (
            <CurrentLocation
                google={this.props.google}
            >
                {this.displayMarkers()}
                <Marker onClick={this.onMarkerClick} name={'Current Location'} icon={meIcon} animation position={this.state.currentLocation}/>
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
                >
                    <div>
                        <h4>{this.state.selectedPlace.name}</h4>
                    </div>
                </InfoWindow>
            </CurrentLocation>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: 'API-KEY-GOES-HERE'
})(MapContainer);
