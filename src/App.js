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
        busMarker: {}
    };

    dataBase() {
<<<<<<< Updated upstream
        onValue (ref(db, "buses/" + 0), (snapshot) => {
            console.log('firebase', snapshot.val());
            this.state.busStations = [snapshot.val()];
=======
        onValue (ref(db, "buses/" + 1), (snapshot) => {
            if (JSON.stringify(this.state.busesLocation) !== JSON.stringify([snapshot.val()])) {
                this.state.busesLocation = [snapshot.val()];
                this.setState({
                    showingInfoWindow: false,
                    activeMarker: {},
                    selectedPlace: {},
                    busesLocation: [snapshot.val()],
                    busesLocationInitialised: true,
                })
            }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        if (this.state.busStations)
        {
            console.log('aa', this.state.busStations);
            return this.state.busStations.map((busStation, index) => {
                return <Marker onClick={this.onMarkerClick} line={busStation.line} key={index} id={index} position={{
                    lat: busStation.lat,
                    lng: busStation.lng
=======
        const busIcon = { url: 'https://img.icons8.com/material-outlined/344/bus.png', scaledSize: { width: 30, height: 30} };
        if (this.state.busesLocation) {
            console.log('displayMarkers', this.state.busesLocation);
            return this.state.busesLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busLocation.line} name={<div><h1 color="grey">{busLocation.line}</h1>{busLocation.id}</div>} icon={busIcon} position={{
                    lat: busLocation.lat,
                    lng: busLocation.lng
>>>>>>> Stashed changes
                }}
                />
        })
        }
    }

    render() {
<<<<<<< Updated upstream

=======
        const meIcon = { url: 'https://img.icons8.com/ios-glyphs/344/person-male.png', scaledSize: { width: 30, height: 30} };
>>>>>>> Stashed changes
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
