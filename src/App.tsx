import React, { useState } from "react";
import * as colors from "@mui/material/colors";
import makeStyles from "@mui/styles/makeStyles";
import {
  BrowserRouter,
  Route,
  Link,
  useLocation,
  Outlet,
  Routes,
} from "react-router-dom";
import ConstructionZone from "src/interactives/ConstructionZone";
import DilemmaZone from "src/interactives/DilemmaZone";
import Horizontal from "src/interactives/Horizontal";
import FundamentalDiagrams from "src/interactives/FundamentalDiagrams";
import TrafficVariables from "./interactives/TrafficVariables";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SpaceMeanSpeed from "./interactives/SpaceMeanSpeed";
import Triangular from "./interactives/Triangular";
import Tri2 from "./interactives/Tri2";
import Pressure from "./interactives/Pressure";
import About from "./About";

const map: { [key: string]: string } = {
    "/": "Traffic Vis",
    "dilemma-zone": "Dilemma Zones",
    "construction-zone": "Construction Zone",
    "space-mean": "Space vs. Time Mean Speed",
    "fundamental-diagram": "Fundamental Diagram",
    "fundamental-diagrams": "Three Fundamental Diagrams",
    // horizontal: "Horizontal Curves",
    // "flow-and-density": "Flow and Density",
  },
  list = Object.entries(map).slice(1);

const Home = () => (
  <div style={{ maxWidth: "700px", margin: "0 auto", lineHeight: "1.5em" }}>
    <div>
      Welcome! This site hosts interactive visualizations that help students
      understand concepts from <em>CEE 310: Transportation Engineering,</em> an
      introductory course at University of Illinois at Urbana-Champaign. Each
      visualization has a short video that you can toggle to explain what's
      going on. If you teach transportation engineering, feel free to use the
      interactives in your class.
    </div>
    <div>
      <ul>
        {list.map((d) => (
          <Link to={d[0]} key={d[0]}>
            <li>{d[1]}</li>
          </Link>
        ))}
      </ul>
    </div>
    <div>
      These are created by{" "}
      <a href="https://lewislehe.com" target="__blank">
        Dr. Lewis Lehe
      </a>
      . Check out the{" "}
      <a href="https://lehelab.com">Urban Traffic and Economics Lab</a> to learn
      more about his group's research.
    </div>
  </div>
);

const titleLink = { paddingRight: "15px" };
const getTitle = () => {
  const location = useLocation().pathname.slice(1);
  if (map.hasOwnProperty(location)) return map[location];

  return map["/"];
};

const Layout = () => {
  const classes = useStyles({});
  return (
    <>
      <div className={classes.title}>
        {/* <div>{useLocation().pathname.slice(1)}</div> */}
        <div style={{ flex: "1 1 auto" }} />
        <div style={titleLink}>
          <Link to="/">home</Link>
        </div>
        <div style={titleLink}>
          <SimpleMenu />
        </div>
        <div style={titleLink}>
          <Link to="/about">about</Link>
        </div>
      </div>
      <div className={classes.main}>
        <Outlet />
      </div>
    </>
  );
};

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/construction-zone" element={<ConstructionZone />} />
          <Route path="/dilemma-zone" element={<DilemmaZone />} />
          <Route path="/space-mean" element={<SpaceMeanSpeed />} />
          <Route path="/horizontal" element={<Horizontal />} />
          <Route path="/pressure" element={<Pressure />} />
          <Route path="/fundamental-diagram" element={<Triangular />} />
          <Route
            path="/fundamental-diagrams"
            element={<FundamentalDiagrams />}
          />
          <Route path="/flow-and-density" element={<TrafficVariables />} />
          <Route path="/triangular2" element={<Tri2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const SimpleMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        menu
      </div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {list.map((d) => (
          <Link to={d[0]} key={d[0]}>
            <MenuItem onClick={handleClose}> {d[1]}</MenuItem>
          </Link>
        ))}
      </Menu>
    </div>
  );
};

const useStyles = makeStyles({
  "@global": {
    body: {
      margin: "0 !important",
      padding: "0 !important",
      fontFamily: " 'Roboto', sans-serif",
      fontSize: "16px",
    },
    ".katex": {
      fontSize: "15px",
    },
    text: {
      fontFamily: "'Roboto', san-serif",
      fontSize: "13px",
    },
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
      textDecoration: "none",
    },
    "& a:hover": {
      color: colors.pink["100"],
      cursor: "pointer",
    },
  },
  main: {
    // lineHeight: "1.5em",
    margin: "0 auto",
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
});
