import React, { Component } from 'react';
import "./style.css";
import signature from "../../assets/images/signature.png";
import settings_icon from "../../assets/icons/settings.png";
import { withRouter, Link } from "react-router-dom";
import SideNavigation from "../navigation/side.js";
import { slide as Menu } from 'react-burger-menu';
import { connect } from "react-redux";

class ContactHelper extends Component {
    render() {
        return (
            <div className={this.props.mode === true ? "dark-background-custom" : "white-custom-background"}>
                <SideNavigation />
                <div id="mobile-only">
                    <Menu right width="100vw" animation={"stack"}>
                        <Link id="home" className="menu-item" to="/">Home</Link>
                        <Link id="about" className="menu-item" to="/bts/main">BTS Page</Link>
                        <Link id="contact" className="menu-item" to="/stills">Stills</Link>
                        <Link className="menu-item" to="/selected/work">Selected Work</Link>
                    </Menu>
                </div>
                <div className="left-space" id="my-custom-left-space-background">
                    <div className="container">
                        <div style={{ paddingTop: "200px" }} className="row">
                            <div className="col-md-12 col-lg-6 col-xl-6 col-sm-12">
                                <p className="lead text-left text-white">US Location</p>
                                <br />
                                <br />
                                <p className="text-left fancy-helper">MOTIONCREATIV Los Angeles</p>
                              
                                <p className="text-left fancy-helper">225 E broadway Glendale, CA</p>
                          
                                <p className="text-left fancy"><a className={this.props.mode === true ? "fancy-helper-dark" : "fancy-helper"} href="/">+1 (951-234-4618)</a></p>
                                
                                <p className="text-left fancy"><a className={this.props.mode === true ? "fancy-helper-dark" : "fancy-helper"} href="mailto:support@motioncreativ.com">Support@MotionCreativ.com</a></p>
                              
                            </div>
                            <div className="col-md-12 col-lg-6 col-xl-6 col-sm-12 left-left">
                                <p className="lead text-left text-white">Sweden Location</p>
                                <br />
                                <br />
                                <p className="text-left fancy-helper">MOTIONCREATIV Sweden</p>
                   
                                <p className="text-left fancy-helper">Stora Kvarngatan 59 apt 764</p>
                          
                                <p className="text-left fancy"><a className={this.props.mode === true ? "fancy-helper-dark" : "fancy-helper"} href="/">221 29 malmo</a></p>
                                <p className="text-left fancy"><a className={this.props.mode === true ? "fancy-helper-dark" : "fancy-helper"} href="/">Sweden</a></p>
                                <p className="text-left fancy"><a className={this.props.mode === true ? "fancy-helper-dark" : "fancy-helper"} href="/">+0 -70-481-8455</a></p>
                                <p className="text-left fancy"><a className={this.props.mode === true ? "fancy-helper-dark" : "fancy-helper"} href="mailto:support@motioncreativ.com">Support@MotionCreativ.com</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        mode: state.mode.darkMode
    }
}
export default withRouter(connect(mapStateToProps, { })(ContactHelper));
