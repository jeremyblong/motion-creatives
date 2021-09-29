import React, { Component, Fragment } from 'react';
import signature from "../../assets/images/signature.png";
import settings_icon from "../../assets/icons/settings.png";
import circle from "../../assets/icons/circle.png";
import slash from "../../assets/icons/slash.png";
import line from "../../assets/icons/line.png";
import "./style.css";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { darkModeSwitch } from "../../actions/dark_mode/mode.js";
import slash_two from "../../assets/icons/slash-two.png";
import circle_two from "../../assets/icons/circle-two.png";
import vertical_two from "../../assets/icons/vertical-two.png";
import signature_white from "../../assets/images/signature-white.png";
import logo from "../../assets/images/motion.png";
import dark_image from "../../assets/images/dark_image.png";

class SideNavigation extends Component {
constructor(props) {
    super(props);
    
}
    flipMode = () => {
        this.props.darkModeSwitch(!this.props.mode);
    }
    render() {
        return (
            <div>
                <div className={this.props.mode === true ? "side-navigation-full side-navigation-full-dark" : "side-navigation-full"}>
                    <div className="dark-mode-btns row">
                        {this.props.mode === true ? <Fragment>
                            <div onClick={this.flipMode}>
                            <img src={circle_two} className={"dark-mode-img"} />
                            </div>
                            <div onClick={this.flipMode}>
                                <img src={slash_two} className={"dark-mode-img"} />
                            </div>
                            <div onClick={this.flipMode}>
                                <img src={vertical_two} className={"dark-mode-img"} />
                            </div>
                        </Fragment> : <Fragment>
                            <div onClick={this.flipMode}>
                                <img src={circle} className={"dark-mode-img"} />
                            </div>
                            <div onClick={this.flipMode}>
                                <img src={slash} className={"dark-mode-img"} />
                            </div>
                            <div onClick={this.flipMode}>
                                <img src={line} className={"dark-mode-img"} />
                            </div>
                        </Fragment>}
                    </div> 
                    {this.props.mode === true ? <div onClick={() => {
                        this.props.history.push("/");
                    }}><img src={dark_image} className="absolute-image-sig-dark" /></div> : <div onClick={() => {
                        this.props.history.push("/");
                    }}><img src={logo} className="absolute-image-sig" /></div>}
                    <div onClick={() => {
                        this.props.history.push("/admin");
                    }} className="settings-icon"><img src={settings_icon} className="settings-icon" /></div>
                    <ul className="ul-menu-links">
                        <li onClick={() => {
                            this.props.history.push("/selected/work");
                        }}>SELECTED WORK</li>
                        <li onClick={() => {
                            this.props.history.push("/stills");
                        }}>STILLS</li>
                        <li id="bts-link-two" onClick={() => {
                            this.props.history.push("/bts/main");
                        }}>BTS</li>
                        <li style={{ marginTop: "100px" }} onClick={() => {
                            this.props.history.push("/about");
                        }}>ABOUT</li>
                        <li onClick={() => {
                            this.props.history.push("/contact");
                        }}>CONTACT</li>
                    </ul>
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
export default withRouter(connect(mapStateToProps, { darkModeSwitch })(SideNavigation));