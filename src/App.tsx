import React from "react";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ConstructionZone from "src/interactives/ConstructionZone";
import DilemmaZone from "src/interactives/DilemmaZone";
import Horizontal from "src/interactives/Horizontal";
import FundamentalDiagrams from 'src/interactives/FundamentalDiagrams';
import TrafficVariables from "./interactives/TrafficVariables";

const list = [
  ["Dilemma Zones", "dilemma-zone"],
  ["Construction Zone", "construction-zone"],
  ["Three Fundamental Diagrams", "fundamental-diagrams"],
  ["Horizontal Curves", "horizontal"],
  ["Flow and Density", "flow-and-density"],
  // ["Triangular Fundamental Diagram", "triangular"],
  // ["Traffic Lights", "traffic-states"]
];

const Home = () => (
  <div style={{ maxWidth: "700px", margin: "0 auto" }}>
    <div>
      Welcome to the homepage for the course{" "}
      <em>CEE 310: Transportation Engineering</em> at University of Illinois at
      Urbana-Champaign. This site links to interactive visualizations that help
      students understand key concepts from the course. This semester (Fall
      2020) is the first time we're incorporating the visualizations, so it's a
      rough draft.
    </div>
    <div>
      <ul>
        {list.map(d => (
          <Link to={d[1]} key={d[1]}>
            <li>{d[0]}</li>
          </Link>
        ))}
      </ul>
    </div>
  </div>
);

const About = () => (
  <div>
    <div>About page</div>
    <div>going to fill this in later</div>
  </div>
);
const titleLink = { paddingRight: "15px" };

export default () => {
  const classes = useStyles({});
  return (
    <Router>
      <div className={classes.title}>
          <Link to="/">CEE 310: Transportation Engineering</Link>
        <div style={{ flex: "1 1 auto" }}></div>
        <div style={titleLink}>
          <Link to="/">home</Link>
        </div>
        <div>
          <Link to="/about">about</Link>
        </div>
      </div>
      <div className={classes.main}>
        <Switch>
          <Route path="/about" component={About} />
          <Route path="/construction-zone" component={ConstructionZone} />
          <Route path="/dilemma-zone" component={DilemmaZone} />
          <Route path="/horizontal" component={Horizontal} />
          <Route path="/fundamental-diagrams" component={FundamentalDiagrams} />
          <Route path="/flow-and-density" component={TrafficVariables} />
          <Route path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
};

const useStyles = makeStyles({
  "@global": {
    body: {
      margin: "0 !important",
      padding: "0 !important",
      fontFamily: " 'Puritan', sans-serif",
      color: colors.grey["800"],
      fontSize: "18px"
    }
  },
  title: {
    backgroundColor: colors.lightBlue["A700"],
    color: "white",
    width: "100%",
    height: "70px",
    display: "flex",
    fontFamily: "Helvetica",
    boxShadow: " 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
    marginBottom: "15px",
    alignItems: "center",
    padding: "5px 30px",
    fontSize: "22px",
    boxSizing: "border-box",
    "& a": {
      color: "white",
      textDecoration: "none"
    },
    "& a:hover": {
      color: colors.pink["100"],
      cursor: "pointer"
    }
  },
  main: {
    color: colors.grey["800"],
    lineHeight: "1.5em",
    margin: "0 auto",
    marginTop: "50px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  }
});