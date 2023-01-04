const request = require("request");
const forecast = (latitude, longitude, callback) => {
  const url =
    "http://api.weatherstack.com/current?access_key=98e82522dfbf2086ea10095a9b136a64&query=" +
    longitude +
    "," +
    latitude +
    "&units=f";
  //  destructured {body} from response
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("unable to connect to weather service", undefined);
    } else if (body.error) {
      callback("unable to find location", undefined);
    } else {
      callback(
        undefined,
        "currently the temperature is " +
          body.current.temperature +
          " and the chances of rain is " +
          body.current.feelslike +
          "%"
      );
    }
  });
};

module.exports = forecast;
