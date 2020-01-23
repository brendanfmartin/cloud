# Cloud

## Node
express, socket.io

Runs on [http://localhost:3000]
```$xslt
cd node-app
npm start
```

## UI
Angular app

Runs on [http://localhost:4200]
```$xslt
cd ui-app
npm start
```


## Contracts

### UI
[MDN Geoposition](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition)


```json
{
  "coords": {
    "latitude": double,
    "longitude": double
    "altitude": double | null
    "accuracy": double in meters
    "altitudeAccuracy": double in meters
    "heading": double, degrees, 0 = north
    "speed": double, velocity m/s
  },
  "timestamp": DOMTimeStamp, milliseconds
}
```

### Node 
[Dynamo Query](https://github.com/rh389/dynamodb-geo.js/blob/master/src/GeoDataManager.ts#L229)
```javascript
myGeoTableManager.queryRadius({
  RadiusInMeter: 1000,
  CenterPoint: {
    latitude: 40.7769099,
    longitude: -73.9822532,
  },
});
```
