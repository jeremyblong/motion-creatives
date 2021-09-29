import React, { Fragment } from "react";
import ContactHelper from "../../components/contact/index.js";

const ContactPage = props => {
    return (
        <Fragment>
            <ContactHelper props={props} />
        </Fragment>
    );
}
export default ContactPage;