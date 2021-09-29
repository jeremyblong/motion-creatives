import React, { Fragment } from "react";
import SelectedWorkHelper from "../../components/selected-work/selectedWork.js";

const SelectedWorkPage = props => {
    return (
        <Fragment>
            <SelectedWorkHelper props={props} />
        </Fragment>
    );
}
export default SelectedWorkPage;