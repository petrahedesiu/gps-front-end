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
        busesLocation: [],
    };

    dataBase() {
        onValue (ref(db, "buses"), (snapshot) => {
            console.log('firebase', snapshot.val());
            if (JSON.stringify(this.state.busesLocation) !== JSON.stringify(snapshot.val())) {
                this.state.busesLocation = snapshot.val();
                this.setState({
                    showingInfoWindow: false,
                    activeMarker: {},
                    selectedPlace: {},
                    busesLocation: snapshot.val(),
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
            if (this.state.busesLocation) {
            console.log('displayMarkers', this.state.busesLocation);
            return this.state.busesLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} line={busLocation.line} key={index} id={index} position={{
                    lat: busLocation.lat,
                    lng: busLocation.lng
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
    apiKey: 'AIzaSyC56J8E-ThBd4SKgyw8DLipCEDAq2tTTjI'
})(MapContainer);
