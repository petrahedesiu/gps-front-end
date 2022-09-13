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
        if (this.state.busesLocation) {
            console.log('displayMarkers', this.state.busesLocation);
            return this.state.busesLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busLocation.line} name={<div><h1 color="grey">{busLocation.line}</h1>{busLocation.id}</div>} icon={busIcon} position={{
                    lat: busLocation.lat,
                    lng: busLocation.lng
                }}
                />
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
