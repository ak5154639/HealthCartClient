import React, { Fragment } from "react";
import moment from "moment";

const AdminFooter = (props) => {
  return (
    <Fragment>
      <footer
        style={{ background: "#303031", color: "#87898A" }}
        className="z-10 py-3 px-4 md:px-12 text-center"
      >
        Develop & Design <a href="https://aniket.online">Aniket Kumar Sharma</a> © Copyright {moment().format("YYYY")}
      </footer>
    </Fragment>
  );
};

export default AdminFooter;
