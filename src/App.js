import React, {Component, useState} from 'react';
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

import {CurrentLocation} from './Map';
import mapStyle from "./style";

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
        const busIcon = { url: 'https://img.icons8.com/material-outlined/344/bus.png', scaledSize: { width: 30, height: 30} };
        if (this.state.busesLocation) {
            console.log('displayMarkers', this.state.busesLocation);
            return this.state.busesLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busLocation.line} name={<div><h1 color="grey">{busLocation.line}</h1>id:{busLocation.id}</div>} icon={busIcon} position={{
                    lat: busLocation.lat,
                    lng: busLocation.lng
                }}
                />
            })
        }
    }

    _mapLoaded(mapProps, map) {
        map.setOptions({
            styles: mapStyle
        })
    }
    render() {
        const meIcon = {url: 'https://img.icons8.com/ios-glyphs/344/person-male.png', scaledSize: { width: 30, height: 30}};
        this.dataBase();
        console.log('selectedPLace name', this.state.selectedPlace.name);
        return (
            <CurrentLocation
                google={this.props.google}
                onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
            >
                {this.displayMarkers()}
                {/*<Marker onClick={this.onMarkerClick} name={'Current Location'} position={this.state.currentLocation}/>*/}
                <Marker onClick={this.onMarkerClick} name={<h2>Me</h2>} icon={meIcon} animation position={this.props.currentLocation}/>
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
