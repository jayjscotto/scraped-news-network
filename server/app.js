require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");


const userRouter = require("./routes/user-routes");
const apiRouter = require("./routes/api");
const facilityRouter = require("./routes/facility-routes");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
//register moment helper
exphbs.registerHelper("moment", require("helper-moment"));
exphbs.registerHelper("formatDateTime", function(date, format) {
  var date = moment(date, "H").format("h:mm a");
  return date;
});

app.set("view engine", "hbs");
app.set("view options", { layout: "layout" });
exphbs.registerPartials(__dirname + '/views/partials');

// app.engine('hbs', engines.hbs);
//middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

app.use("/", router);


module.exports = app;
