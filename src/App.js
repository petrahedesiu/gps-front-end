import React, {Component, useState} from 'react';
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';
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
        onValue (ref(db, "buses/" + 0), (snapshot) => {
            console.log('firebase', snapshot.val());
            this.state.busStations = [snapshot.val()];
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
        if (this.state.busStations)
        {
            console.log('aa', this.state.busStations);
            return this.state.busStations.map((busStation, index) => {
                return <Marker onClick={this.onMarkerClick} line={busStation.line} key={index} id={index} position={{
                    lat: busStation.lat,
                    lng: busStation.lng
                }}
                />
            })
        }
    }

    render() {

        this.dataBase();
        return (
            <CurrentLocation
                google={this.props.google}
            >
                {this.displayMarkers()}
                <Marker onClick={this.onMarkerClick} name={'Current Location'} position={this.state.currentLocation}/>
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
