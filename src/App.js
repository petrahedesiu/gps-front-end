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
        busStations: [],
    };

    dataBase() {
        onValue (ref(db, "buses"), (snapshot) => {
            console.log('firebase buses', snapshot.val());
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
        onValue (ref(db, "stations"), (snapshot) => {
            console.log('firebase stations', snapshot.val());
            if (JSON.stringify(this.state.busStations) !== JSON.stringify(snapshot.val())) {
                this.setState({
                    busStations: snapshot.val(),
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
    displayBusMarkers = () => {
        const busIcon = { url: 'https://img.icons8.com/material-outlined/344/bus.png', scaledSize: { width: 30, height: 30} };
        if (this.state.busesLocation) {
            console.log('displayBusMarkers', this.state.busesLocation);
            return this.state.busesLocation.map((busLocation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busLocation.line} name={<div><h1 color="grey">{busLocation.line}</h1>id:{busLocation.id}</div>} icon={busIcon} position={{
                    lat: busLocation.lat,
                    lng: busLocation.lng
                }}
                />
            })
        }
    }

    displayStationsMarkers = () => {
        const stationIcon = { url: 'data:image/png;base64,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',
            scaledSize: { width: 15, height: 15} };
        if (this.state.busStations) {
            return this.state.busStations.map((busStation, index) => {
                return <Marker onClick={this.onMarkerClick} title={busStation.name} name={<div><h1 color="grey">{busStation.name}</h1></div>} icon={stationIcon} position={{
                    lat: busStation.lat,
                    lng: busStation.lng
                }}
                />
            })
        }
    }

    _mapLoaded(mapProps, map) {
        map.setOptions({
            // disableDefaultUI: false, // a way to quickly hide all controls
            // mapTypeControl: false,
            // scaleControl: false,
            // zoomControl: false,
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
                {this.displayBusMarkers()}
                {this.displayStationsMarkers()}
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
