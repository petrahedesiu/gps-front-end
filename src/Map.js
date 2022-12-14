import React from 'react';
import ReactDOM from 'react-dom';
import mapStyle from './style';
import {Map} from "google-maps-react";


var allowedLocation = 0;

export class CurrentLocation extends React.Component {
    constructor(props) {
        super(props);
        const {lat, lng} = this.props.initialCenter;
        this.state = {
            currentLocation: {
                lat: lat,
                lng: lng
            }
        };
    }
    componentDidUpdate(prevProps, prevState)
    {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMap();
        }
    }
    recenterMap()
    {
        const map = this.map;
        const current = this.state.currentLocation;
        const google = this.props.google;
        const maps = google.maps;

        if (map) {
            let center = new maps.LatLng(current.lat, current.lng);
            map.panTo(center);
        }
    }
    componentDidMount()
    {
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                const coords = pos.coords;
                allowedLocation = 1;
                this.setState({
                    currentLocation: {
                        lat: coords.latitude,
                        lng: coords.longitude
                    }
                });
                console.log(pos.coords)
            });
        }
        else {
            allowedLocation = 0;
            this.setState({
                currentLocation: {
                    lat: 46.75137,
                    lng: 23.57586
                },
            });
        }
        this.recenterMap();
        this.loadMap();
    }
    loadMap()
    {
        if (this.props && this.props.google) {
            // checks if google is available
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;

            // reference to the actual DOM element
            const node = ReactDOM.findDOMNode(mapRef);

            let {zoom} = this.props;
            const {lat, lng} = this.state.currentLocation;
            const center = new maps.LatLng(lat, lng);

            const mapConfig = Object.assign(
                {},
                {
                    center: center,
                    zoom: zoom,
                    // mapContainerStyle: mapStyle,
                }
            );

            // maps.Map() is constructor that instantiates the map
            this.map = new maps.Map(node, mapConfig);
        }
    }
    renderChildren()
    {
        const {children} = this.props;

        if (!children) return;

        return React.Children.map(children, c => {
            if (!c) return;

            return React.cloneElement(c, {
                map: this.map,
                google: this.props.google,
                mapCenter: this.state.currentLocation
            });
        });
    }

    render()
    {
        // const style = Object.assign({}, mapStyle.map);
        return (
            <Map /* id="mymap"*/
                google={this.props.google}
                styles={mapStyle}
                zoomControl={false}
                mapTypeControl={false}
                streetViewControl={false}
                routeControl={false}
                scaleControl={false}
                fullscreenControl={false}
                initialCenter={{
                    lat: this.state.currentLocation.lat,
                    lng: this.state.currentLocation.lng
                }}
            >
                <div  ref="map">
                    Loading map...
                </div>
                {this.renderChildren()}
            </Map>
        );
    }

}
CurrentLocation.defaultProps = {
    zoom: 10,
    initialCenter: {
        lat: 46.75137,
        lng: 23.57586
    },
    visible: true
};
export default CurrentLocation;
export {allowedLocation};
