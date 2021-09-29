import React, { Component } from 'react';
import SideNavigation from "../navigation/side.js";
import "./style.css";

class TeamHelper extends Component {
constructor(props) {
    super(props);


}
    render() {
        return (
            <div>
                <SideNavigation props={this.props} />
                <div className={this.props.mode === true ? "container max-width left-space left-mobile masonry-dark" : "container max-width left-space left-mobile masonry"}>
                <div className="container-fluid">
                    <h1 className="text-center">TEAM</h1>
                    <div className="row" id="team">
          
                       
                     
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default TeamHelper;