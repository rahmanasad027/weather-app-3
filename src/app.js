const { hasSubscribers } = require("diagnostics_channel");
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();

//  port number is provided by heroku if it exists. if not it will use 3000
const port = process.env.PORT || 4000;

const geoCode = require("./utils/geoCode");
const forecast = require("./utils/forecast");
//  setting up hbs library (handleBars) with name of view engine to set up dynamic templating like
//  seting header and footer for all application
//  that template is created in templates folder
const viewsPath = path.join(__dirname, "../templates/views");
//  to get the index.html path
const publicDirectoryPath = path.join(__dirname, "../public");
//  changed
//  to get the partials folder inside of templates where single template can be created for whole application
const partialsPath = path.join(__dirname, "../templates/partials");

//  configure handleBars
app.set("view engine", "hbs");
app.set("views", viewsPath);
//  to work with partials path
hbs.registerPartials(partialsPath);
//  to customise the server. the base url is now loading index.html file
app.use(express.static(publicDirectoryPath));

//  this is used to render the index file in view directory which is a template of handlebars
//  and data is sent to that template dynamically
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Asad",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About",
    name: "Asad",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "help",
    name: "Asad",
    helpText: "help me please",
  });
});

//  sending data to browser. first argument is the url which is home in this case. the data in this app.get is overwritten by index.html file
// app.get("", (req, res) => {
//   res.send("Hello handsom!");
// });

//  about page
// const publicDirectoryPathAbout = path.join(__dirname, "../public/about.html");
// app.use(express.static(publicDirectoryPathAbout));
//  help page
// const publicDirectoryPathHelp = path.join(__dirname, "../public/help.html");
// app.use(express.static(publicDirectoryPathHelp));

//  help page
// app.get("/help", (req, res) => {
//   res.send("<h1>help page</h1>");
// });

//  about page
// app.get("/about", (req, res) => {
//   res.send("<h1>about page</h1>");
// });
//  weather page
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "address must be provided",
    });
  }

  geoCode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          error: error,
        });
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({
            error: error,
          });
        }
        // console.log(location);
        // console.log(forecastData);
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

//  error bad help route
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Asad",
    errorMessage: "Help article not found",
  });
});

//  practice query string endpoint operation
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "please provide a search term",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

//  error route
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Asad",
    errorMessage: "Page not found",
  });
});
//  at which port our app is loaded
app.listen(port, () => {
  console.log("app is up and running on port" + port);
});
