import React, { Fragment } from "react";
import IndividualHelper from "../../components/individual/individualListing.js";

const IndividualPage = props => {
    return (
        <Fragment>
            <IndividualHelper props={props} />
        </Fragment>
    );
}
export default IndividualPage;