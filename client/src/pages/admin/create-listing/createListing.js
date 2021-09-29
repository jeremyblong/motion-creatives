import React, { Component } from 'react';
import CreateNewListingHelper from "../../../components/admin/create-listing/createListing.js";

const CreateNewListingPage = (props) => {
    return (
        <div>
            <CreateNewListingHelper props={props} />
        </div>
    )
}
export default CreateNewListingPage;