import React, { Fragment } from "react";
import AboutHelper from "../../components/about/index.js";

const AboutPage = props => {
    return (
        <Fragment>
            <AboutHelper props={props} />
        </Fragment>
    );
}
export default AboutPage;