import React from "react";
import PropTypes from "prop-types";

UnauthPage.propTypes = {};

function UnauthPage(props) {
  return (
    <h1
      style={{
        color: "rgb(192, 5, 0)",
        textAlign: "center",
        fontFamily: "Roboto",
        fontSize: "50px",
        fontWeight: "bold",
        marginTop: "60px",
      }}
    >
      Bu sayfaya giriş için yetkili değilsiniz
    </h1>
  );
}

export default UnauthPage;
