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

Starbucks Sample Data
```javascript
  const data = [
     {
       "position": {
         "lat": 61.21759217,
         "lng": -149.8935557
       },
       "name": "Starbucks - AK - Anchorage  00001",
       "address": "601 West Street_601 West 5th Avenue_Anchorage, Alaska 99501",
       "phone": "907-277-2477"
     }
  ];
```

Starbuck Sample Load
```javascript
  const putPointInputs = data.map((location) => ({
    RangeKeyValue: { S: uuid.v4() }, // Use this to ensure uniqueness of the hash/range pairs.
    GeoPoint: {
      latitude: location.position.lat,
      longitude: location.position.lng,
    },
    PutItemInput: {
      Item: {
        name: { S: location.name }, // Specify attribute values using { type: value } objects, like the DynamoDB API.
        address: { S: location.address },
      },
    },
  }));


  myGeoTableManager.batchWritePoints(putPointInputs).promise()
```
