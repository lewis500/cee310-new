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

// @ts-ignore
import Negin from "./img/negin-cropped.jpg";
// @ts-ignore
import Lewis from "./img/lewis-cropped.jpeg";
//@ts-ignore
import Jesus from "./img/jesus.png";

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
        background: "none",
      },
    },
    imgContainer: {
      alignSelf: "center",
      display: "flex",
      justifyContent: "center",
      "& img": {
        width: "200px",
        boxShadow: `1px 1px 2px ${colors.grey[400]}`,
        marginRight: "20px",
      },
    },
    person: {
      display: "flex",
      marginBottom: "20px",
    },
  });
  return () => {
    const classes = useStyles({});
    return (
      <div className={classes.about}>
        <div style={{ fontSize: "24px", marginBottom: "20px" }}>Vision</div>
        <div>
          Transportation engineering is all about vehicles in motion, but
          transportation engineers and academics typically work with static
          diagrams. This site is an experiment in the idea that students learn
          the subject better when they can interact with moving representations.
          The course CEE 310 is taught every semester, so the page will be
          updated with new interactives as time goes on.
        </div>
        <hr />
        {/* <hr /> */}
        <div
          style={{ fontSize: "24px", marginBottom: "20px", marginTop: "20px" }}
        >
          Team
        </div>
        <div className={classes.person}>
          <div className={classes.imgContainer}>
            <img src={Lewis} width="200px" />
          </div>
          <div>
            Since Fall 2018, Lewis Lehe has been assistant professor in the
            transportation systems group of the Department of Civil and
            Environmental Engineering at UIUC. He earned a PhD and MS in CEE at
            UC Berkeley and an MA in Transport Economics at University of Leeds.
            His research focuses on the economics of downtown traffic. In a
            previous life, he made visualizations with{" "}
            <a href="https://www.google.com/search?client=firefox-b-1-d&q=vicapow">
              @vicapow
            </a>{" "}
            under the <a href="http://setosa.io">Setosa</a> name.
            <br />
            <a href="http://lewislehe.com">Home page</a> (includes other
            visualizations)
          </div>
        </div>
        <div className={classes.person}>
          <div className={classes.imgContainer}>
            <img src={Negin} width="200px" />
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
        <div className={classes.person}>
          <div className={classes.imgContainer}>
            <img src={Jesus} width="200px" />
          </div>
          <div>
            Jesus holds an M.S. in Civil engineering and is currently pursuing
            Ph.D. in the Department of Civil and Environmental Engineering at
            the University of Illinois, Urbana-Champaign (UIUC). He is working
            as a research assistant in projects related to transportation
            systems evaluation, transit networks, intelligent transportation
            systems, highway safety, and previously traffic safety related to
            the application of Vision Zero principles. He attended to Valparaiso
            University prior to joining UIUC in 2017.
          </div>
        </div>
        <div
          style={{
            fontSize: "24px",
            margin: "20px auto",
          }}
        >
          Tools
        </div>
        <div style={{ marginBottom: "24px" }}>
          The site was created using React, d3, Material UI, TypeScript,
          Webpack, babel and Netlify.
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
        {/* <Link to={"construction-zone"}>
          <MenuItem onClick={handleClose}>Construction Zone</MenuItem>
        </Link> */}
        {/* <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
      </Menu>
    </div>
  );
};

const useStyles = makeStyles({
  "@global": {
    body: {
      margin: "0 !important",
      padding: "0 !important",
      fontFamily: " 'Puritan', sans-serif",
      color: colors.grey["800"],
      fontSize: "18px",
    },
    ".katex": {
      // fontSize: "1.2em"
      fontSize: "15px",
    },
    text: {
      fontFamily: "Puritan, san-serif",
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
