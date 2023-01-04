const request = require("request");
const geoCode = (address, callback) => {
  const url =
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
    encodeURIComponent(address) +
    ".json?access_token=pk.eyJ1IjoibXVoYW1tYWQyMTIiLCJhIjoiY2w5eTF3OG93MDBuNjNyazZ0bnRxNDVtaCJ9.VwwgRaoTbkjFzifGsDKD6A&limit=1";
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("unable to connect to service location!", undefined);
    } else if (body.features.length === 0) {
      callback("type in another location", undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
};

module.exports = geoCode;
