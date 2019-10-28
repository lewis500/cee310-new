import React from "react";
import * as colors from "@material-ui/core/colors";
import makeStyles from "@material-ui/styles/makeStyles";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import ConstructionZone from "src/interactives/ConstructionZone";
import DilemmaZone from "src/interactives/DilemmaZone";
import Horizontal from "src/interactives/Horizontal";
import FundamentalDiagrams from "src/interactives/FundamentalDiagrams";
import TrafficVariables from "./interactives/TrafficVariables";
import Divider from "@material-ui/core/Divider";

// @ts-ignore
import Negin from "./img/negin-cropped.jpg";
// @ts-ignore
import Lewis from "./img/lewis.jpg";

const map: { [key: string]: string } = {
    "/": "CEE 310: Transportation Engineering",
    "dilemma-zone": "Dilemma Zones",
    "construction-zone": "Construction Zone",
    "fundamental-diagrams": "Three Fundamental Diagrams",
    horizontal: "Horizontal Curves",
    "flow-and-density": "Flow and Density"
  },
  list = Object.entries(map).slice(1);

const Home = () => (
  <div style={{ maxWidth: "700px", margin: "0 auto", lineHeight: "1.5em" }}>
    <div>
      Welcome to the homepage for the course{" "}
      <em>CEE 310: Transportation Engineering</em> at University of Illinois at
      Urbana-Champaign. This site links to interactive visualizations that help
      students understand key concepts from the course. Each visualization has a
      short video that you can toggle to explain what's going on. This semester
      (Fall 2020) is the first time we're incorporating the visualizations, so
      it's a rough draft.
    </div>
    <div>
      <ul>
        {list.map(d => (
          <Link to={d[0]} key={d[0]}>
            <li>{d[1]}</li>
          </Link>
        ))}
      </ul>
    </div>
  </div>
);

const About = (() => {
  const useStyles = makeStyles({
    about: {
      maxWidth: "700px",
      fontSize: "16px",
      lineHeight: "1.5em",
      display: "flex",
      flexDirection: "column",
      margin: "0 auto",
      alignItems: "center",
      "& hr": {
        borderTop: "1px solid " + colors.grey["400"],
        width: "100%",
        margin: "10px 0px",
        background: "none"
      }
    },
    imgContainer: {
      alignSelf: "center",
      display: "flex",
      justifyContent: "center",
      "& img": {
        width: "200px",
        boxShadow: `1px 1px 2px ${colors.grey[400]}`,
        marginRight: "20px"
      }
    },
    person: {
      display: "flex"
      // marginBottom: "10px"
    }
  });
  return () => {
    const classes = useStyles({});
    return (
      <div className={classes.about}>
        <div className={classes.person}>
          <div className={classes.imgContainer}>
            <img src={Lewis} />
          </div>
          <div>
            Since Fall 2018, Lewis Lehe has been assistant professor in the
            transportation systems group of the Department of Civil and
            Environmental Engineering at UIUC. He earned a PhD and MS in CEE at
            UC Berkeley and an MA in Transport Economics at University of Leeds.
            His research focuses on the economics of downtown traffic.
            <br />
            <a href="https://lewislehe.com">Home page</a>
          </div>
        </div>
        <hr />
        <div className={classes.person}>
          <div className={classes.imgContainer}>
            <img src={Negin} />
          </div>
          <div>
            In Summer 2019, Negin Alemazkoor earned her PhD in Civil Engineering
            from UIUC. She is currently a Postdoctoral Research Associate in the
            Purdue School of Industrial Engineering. Her research mainly
            concerns developing computational tools for fast and reliable
            analysis of smart and resilient infrastructure systems with a focus
            on power and transportation systems.
            <br />
            <a href="https://nalemazkoor.wixsite.com/negin">Home page</a>
          </div>
        </div>
      </div>
    );
  };
})();
const titleLink = { paddingRight: "15px" };
const getTitle = () => {
  const location = useLocation().pathname.slice(1);
  if (map.hasOwnProperty(location)) return map[location];
  return map["/"];
};

const App = () => {
  const classes = useStyles({});
  return (
    <>
      <div className={classes.title}>
        <div>{getTitle()}</div>
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
    </>
  );
};

export default () => (
  <Router>
    <App />
  </Router>
);

const useStyles = makeStyles({
  "@global": {
    body: {
      margin: "0 !important",
      padding: "0 !important",
      fontFamily: " 'Puritan', sans-serif",
      color: colors.grey["800"],
      fontSize: "18px"
    },
    ".katex": {
      fontSize: "1em"
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
    // lineHeight: "1.5em",
    margin: "0 auto",
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  }
});
