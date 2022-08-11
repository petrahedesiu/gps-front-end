//markers + current location shown on map
import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';

import {CurrentLocation} from './Map';

export class MapContainer extends Component {
    state = {
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {}
    };

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
        this.state.busStations = [
            {latitude: 46.7673, longitude: 23.6016, name:"Statia Piata Cipariu Sud"},
            {latitude: 46.7728, longitude: 23.5890, name:"Statia Mihai Viteazu Est"},
            {latitude: 46.7717, longitude: 23.5920, name:"Statia Sora"},
            {latitude: 46.7696, longitude: 23.5871, name:"Statia Memorandumului"},
            {latitude: 46.7712664, longitude: 23.6261106, name:"Statia Iulius Mall Est"},
            {latitude: 46.7732, longitude: 23.5973, name:"Statia Regionala CFR"}
        ]
        return this.state.busStations.map((busStation, index) => {
            return <Marker onClick={this.onMarkerClick} name={busStation.name} key={index} id={index} position={{
                lat: busStation.latitude,
                lng: busStation.longitude
            }}
            />
        })
    }
    render() {
        return (
            <CurrentLocation
                centerAroundCurrentLocation
                google={this.props.google}
            >
                <Marker onClick={this.onMarkerClick} name={'Current Location'} />
                {this.displayMarkers()}
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
    apiKey: 'AIzaSyC56J8E-ThBd4SKgyw8DLipCEDAq2tTTjI'
})(MapContainer);