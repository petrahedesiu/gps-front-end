import React, {Component, useState} from 'react';
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react';
import { db } from './firebase';
import { ref, onValue } from 'firebase/database';

import {allowedLocation, CurrentLocation} from './Map';
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
            if (JSON.stringify(this.state.busesLocation) !== JSON.stringify(snapshot.val())) {
                this.setState({
                    busesLocation: snapshot.val(),
                })
            }
        });
        onValue (ref(db, "stations"), (snapshot) => {
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
        const stationIcon = { url: "https://i.im.ge/2022/09/27/1yWfsx.bus-station-marker.png", scaledSize: { width: 12, height: 12} };
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
            styles: mapStyle
        })
    }

    render() {
        const meIcon = {url: 'https://img.icons8.com/ios-glyphs/344/person-male.png', scaledSize: { width: 30, height: 30}};
        this.dataBase();
        return (
            <CurrentLocation
                google={this.props.google}
                onReady={(mapProps, map) => this._mapLoaded(mapProps, map)}
            >
                {this.displayBusMarkers()}
                {this.displayStationsMarkers()}

                {allowedLocation ? (
                    <Marker onClick={this.onMarkerClick} name={<h2>Me</h2>} icon={meIcon} animation />
                ):(
                    console.log('blocked location')
                )}

                {/*<Marker onClick={this.onMarkerClick} name={<h2>Me</h2>} icon={meIcon} animation position={this.state.currentLocation}/>*/}
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
