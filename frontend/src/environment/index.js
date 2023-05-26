

const local = {
  apiUrl: "http://localhost:3008/api/v1",
  apiKey: "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
  googleApiKey: "AIzaSyAi11lLDJCDlCM3iLi8O-TZgWkKbWLtORc",
  homeUrl: "/dashboard"
};

const production = {
  apiUrl: "https://api.weeknds.com/api/v1",
  apiKey: "GCMUDiuY5a7WvyUNt9n3QztToSHzK7Uj",
  googleApiKey: "AIzaSyAi11lLDJCDlCM3iLi8O-TZgWkKbWLtORc",
  homeUrl: "/dashboard"
};


if (process.env.NODE_ENV === 'production') {
  module.exports = production;
} else {
  module.exports = local;
}
