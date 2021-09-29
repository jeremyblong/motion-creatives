import React, { Component } from 'react';
import "./style.css";
import SideNavigation from "../navigation/side.js";
import { withRouter, Link } from "react-router-dom";
import camera_man from "../../assets/images/camera.jpg";
import { slide as Menu } from 'react-burger-menu';
import { connect } from "react-redux";


class AboutHelper extends Component {
constructor(props) {
    super(props);
    
}
    render() {
        return (
            <div>
                <SideNavigation />
                <div id="mobile-only">
                    <Menu right width="100vw" animation={"stack"}>
                        <Link id="home" className="menu-item" to="/">Home</Link>
                        <Link id="about" className="menu-item" to="/bts/main">BTS Page</Link>
                        <Link id="contact" className="menu-item" to="/stills">Stills</Link>
                        <Link className="menu-item" to="/selected/work">Selected Work</Link>
                    </Menu>
                </div>
                <div className="left-space">
                    <div style={{ paddingTop: "75px" }} className={this.props.mode === true ? "container my-container" : "container"} id="max">
                        <div className="row">
                            <div className="col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12">
                                <div className="float-right">
                                    <img src={camera_man} className="medium-img" />
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-6 col-xl-6 col-sm-12 col-xs-12 shift-left">
                                <p className="lead-small" id="top-text">
                                    <strong>Josua Stäbler. Director of Photography based in Stuttgart, Germany.</strong> Working as a cinematographer (DOP) on commercials, documentaries and passion projects internationally.
                                </p>
                                <p className="lead-small">
                                    <strong>I believe in the power of film.</strong> <br />
                                    I love to craft real tangible things and shoot analog 16mm and 35mm film by choice. <br />
                                    While travelling the world I have gained a big interest in faraway places and lost cultures. <br />
                                </p>
                                <p style={{ paddingTop: "45px" }} className="lead-small">
                                    <strong>I’m in love with grain, get goose bumps from beautiful lens-flare and like nothing more than light touching human skin.</strong>
                                </p>
                                <p style={{ paddingTop: "60px" }} className="lead-small">
                                    Selected Clients: <br />
                                    BMW / MERCEDES BENZ / CISCO / NOVARTIS / VAILLANT, LIDL / VOLKSWAGEN/ CENTURION/ MERIDA / UNIVERSAL MUSIC GROUP / ..
                                </p>
                            </div>
                        </div>
                        <div style={{ marginTop: "70px" }} className="row">
                            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                                <p className="lead-small hover-text text-right">RESUME</p>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                                <p className="lead-small hover-text text-center">AWARDS</p>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-4 col-xs-4">
                                <p className="lead-small hover-text text-left"><Link style={{ color: "white" }} to="contact">CONTACT</Link></p>
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
export default withRouter(connect(mapStateToProps, { })(AboutHelper));