import React, { Component, Fragment } from 'react';
import { withRouter, Link } from "react-router-dom";
import { slide as Menu } from 'react-burger-menu';
import signature from "../../assets/images/signature.png";
import settings_icon from "../../assets/icons/settings.png";
import "./style.css";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import axios from "axios";
import { connect } from "react-redux";
import Skeleton from 'react-loading-skeleton';
import circle from "../../assets/icons/circle.png";
import slash from "../../assets/icons/slash.png";
import line from "../../assets/icons/line.png";
import { darkModeSwitch } from "../../actions/dark_mode/mode.js";
import slash_two from "../../assets/icons/slash-two.png";
import circle_two from "../../assets/icons/circle-two.png";
import vertical_two from "../../assets/icons/vertical-two.png";
import signature_white from "../../assets/images/signature-white.png";
import logo from "../../assets/images/motion.png";
import dark_image from "../../assets/images/dark_image.png";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';


const EMAIL = process.env.REACT_APP_SECRET_EMAIL;

class BTSHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        images: [],
        showNav: false
    }
}

    componentDidMount() {
        setTimeout(() => {
            axios.post("/gather/bts/pictures", {
                email: EMAIL
            }).then((res) => {
                if (res.data.message === "Successfully gathered images!") {
                    console.log(res.data);
    
                    const { images } = res.data;
    
                    this.setState({
                        images
                    })
                } else {
                    console.log("ERR", res.data);
                }
            }).catch((err) => {
                console.log(err);
            })
        },  500);
    }
    flipMode = () => {
        this.props.darkModeSwitch(!this.props.mode);
    }
    renderGridItems = () => {
        const { images } = this.state;
        if (typeof images !== "undefined" && images.length > 0) {
            return (
                <ResponsiveMasonry 
                    columnsCountBreakPoints={{350: 1, 550: 2, 800: 3, 900: 4}}
                >
                    <Masonry columnsCount={4}>
                            {images.map((image, index) => {
                                return (
                                    <div className="item">
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            src={`${process.env.REACT_APP_IMAGE_URL}/${image}`} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"img-fluid"}
                                        />
                                    </div>
                                );
                            })}
                    </Masonry>
                </ResponsiveMasonry>
            );
        } else {
            return (
                <Fragment>
                    <Skeleton width={"100vw"} height={30} count={40}/>
                </Fragment>
            );
        }
    }
    render() {
        const { images } = this.state;
        return (
            <div className={this.props.mode === true ? "all-black" : "white"}>
                <div id="mobile-only">
                    <Navbar color="light" light expand="md">
                        <NavbarBrand href="/">Motion Creatives</NavbarBrand>
                            <NavbarToggler onClick={() => {
                                this.setState({
                                    showNav: !this.state.showNav
                                })
                            }} />
                            <Collapse isOpen={this.state.showNav} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink><Link style={{ color: "black" }} to={"/admin"}>Settings</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink><Link style={{ color: "black" }} to={"/bts/main"}>BTS Page</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink><Link style={{ color: "black" }} to={"/stills"}>Stills</Link></NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink><Link style={{ color: "black" }} to={"/selected/work"}>Selected Work</Link></NavLink>
                                </NavItem>
                            </Nav>
                            </Collapse>
                    </Navbar>
                    
                </div>
                <div className="mobile-strip-custom mx-auto">
                    <img src={signature} className="absolute-image-sig-two" />
                </div>
                <div className={this.props.mode === true ? "side-navigation-full stills-side-nav stills-side-nav-dark" : "side-navigation-full stills-side-nav"}>
                    <div className="dark-mode-btns-top row">
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
                    <div onClick={() => {
                       this.props.history.push("/");
                       // custom-img-width
                    }}><img src={this.props.mode === true ? dark_image : logo} className={this.props.mode === true ? "absolute-image-sig-dark" : "absolute-image-sig"} /></div>
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
                        <li style={{ marginTop: "50px" }} onClick={() => {
                            this.props.history.push("/about");
                        }} style={this.props.mode === true ? { marginTop: "145px" } : { marginTop: "95px" }}>ABOUT</li>
                        <li onClick={() => {
                            this.props.history.push("/contact");
                        }}>CONTACT</li>
                    </ul>
                </div>
                <div className={this.props.mode === true ? "max-width cover-all left-space left-mobile masonry-dark" : "cover-all max-width left-space left-mobile masonry"}>
                    {this.renderGridItems()}
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
export default withRouter(connect(mapStateToProps, { darkModeSwitch })(BTSHelper));