import React from "react";
import PropTypes from "prop-types";

UnauthPage.propTypes = {};

function UnauthPage(props) {
  return (
      <div className="d-flex w-100 flex-column gap-5 justify-content-center align-items-center" style={{ height: '90vh' }}>
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

          <a href="/anasayfa" className="default-a print-btn2 bg-danger">Anasayfaya Dön</a>
      </div>

  );
}

export default UnauthPage;
