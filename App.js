import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions, MapView } from 'expo';
import { Marker } from 'react-native-maps';

export default class App extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };

  render() {
    let text = 'Waiting..';
    let mylatitude = 0.0, mylongitude = 0.0

    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      mylatitude = this.state.location.coords.latitude
      mylongitude = this.state.location.coords.longitude
    }

    const LatLng = {
      latitude: -6.3026595,
      longitude: 106.6541868,
      }
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{text}</Text>
        {this.state.location && 
        <MapView
          style={{ height: 500, width: 500 }}
          initialRegion={{
            latitude: mylatitude,
            longitude: mylongitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            
          }}
            >
          <Marker
            coordinate={this.state.location.coords}
            title="Posisi saya"
            description="Saat ini saya berada disini"
          />
          <Marker
            coordinate={LatLng}
            title="Posisi saya 1"
            description="Saat ini saya berada disini"
          />
        </MapView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
});