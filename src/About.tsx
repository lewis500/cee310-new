import React from "react";
import makeStyles from "@mui/styles/makeStyles";
// @ts-ignore
import Negin from "./img/negin-cropped.jpg";
// @ts-ignore
import Lewis from "./img/lewis-cropped.jpeg";
//@ts-ignore
import Jesus from "./img/jesus.png";
import grey from "@mui/material/colors/grey";
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
      borderTop: "1px solid " +grey["400"],
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
      boxShadow: `1px 1px 2px ${grey[400]}`,
      marginRight: "20px",
    },
  },
  person: {
    display: "flex",
    marginBottom: "20px",
  },
});
export default () => {
  const classes = useStyles({});
  return (
    <div className={classes.about}>
      <div style={{ fontSize: "24px", marginBottom: "20px" }}>Vision</div>
      <div>
        Transportation engineering is all about vehicles in motion, but
        transportation engineers and academics typically work with static
        diagrams. This site is an experiment in the idea that students learn the
        subject better when they can interact with moving representations. The
        course CEE 310 is taught every semester, so the page will be updated
        with new interactives as time goes on.
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
          Environmental Engineering at UIUC. He earned a PhD and MS in CEE at UC
          Berkeley and an MA in Transport Economics at University of Leeds. His
          research focuses on the economics of downtown traffic. In a previous
          life, he made visualizations with{" "}
          <a href="https://www.google.com/search?client=firefox-b-1-d&q=vicapow">
            @vicapow
          </a>{" "}
          under the <a href="http://setosa.io">Setosa</a> name.
          <br />
          <a href="https://lewislehe.com">Home page</a> (includes other
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
          Purdue School of Industrial Engineering. Her research mainly concerns
          developing computational tools for fast and reliable analysis of smart
          and resilient infrastructure systems with a focus on power and
          transportation systems.
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
          Ph.D. in the Department of Civil and Environmental Engineering at the
          University of Illinois, Urbana-Champaign (UIUC). He is working as a
          research assistant in projects related to transportation systems
          evaluation, transit networks, intelligent transportation systems,
          highway safety, and previously traffic safety related to the
          application of Vision Zero principles. He attended to Valparaiso
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
        The site was created using React, d3, Material UI, TypeScript, Webpack,
        babel and Netlify.
      </div>
    </div>
  );
};
