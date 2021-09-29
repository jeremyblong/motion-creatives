import React, { Component, Fragment } from 'react';
import signature from "../../assets/images/signature.png";
import settings_icon from "../../assets/icons/settings.png";
import "./style.css";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import { slide as Menu } from 'react-burger-menu';
import SideNavigation from "../navigation/side.js";
import { connect } from "react-redux";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';


const EMAIL = process.env.REACT_APP_SECRET_EMAIL;

class SelectedWorkHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        content: null,
        showNav: false
    }
    this.selected = React.createRef();
}
    componentDidMount() {
        axios.post("/gather/selected/work", {
            email: EMAIL
        }).then((res) => {
            if (res.data.message === "Successfully gathered selected work!") {
                console.log(res.data);

                const { content } = res.data;

                this.setState({
                    content
                })
            } else {
                console.log('err', res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    mouseEntered = (value) => {
        console.log("mouseEntered....", value);

        this.selected = value.id;

        this.forceUpdate();
    }
    handleRedirect = (post) => {
        this.props.history.push(`/listing/individual/${post.id}`);
    }
    renderContent = () => {
        if (this.state.content !== null) {
            return this.state.content.map((item, index) => {
                if (this.selected === item.id) {
                    return (
                        <Fragment>
                            <div ref={this.selected} onMouseEnter={() => {
                                this.mouseEntered(item);
                            }} onClick={() => {
                                this.handleRedirect(item);
                            }} className="col-md-6 col-lg-6 col-sm-12 col-xs-12 nopadding hovered-state-two">
                                <LazyLoadImage 
                                    effect={"blur"}
                                    src={`${process.env.REACT_APP_IMAGE_URL}/${item.thumbnail_images[0]}`} // use normal <img> attributes as props
                                    width={"100%"}  
                                    className={"long-width-short-two"}
                                />
                            </div>
                        </Fragment>
                    );    
                } else {
                    return (
                        <Fragment>
                            <div ref={this.selected} onMouseEnter={() => {
                                this.mouseEntered(item);
                            }} onClick={() => {
                                this.handleRedirect(item);
                            }} className="col-md-6 col-lg-6 col-sm-12 col-xs-12 nopadding hovered-state-two">
                                <LazyLoadImage 
                                    effect={"blur"}
                                    src={`${process.env.REACT_APP_IMAGE_URL}/${item.thumbnail_images[0]}`} // use normal <img> attributes as props
                                    width={"100%"}  
                                    className={"long-width-short-two"}
                                />
                            </div>
                        </Fragment>
                    );  
                }
                
            });
        } 
    }
    render() {
        return (
            <div>
                <SideNavigation />
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
                <div style={this.props.mode === true ? { backgroundColor: "black", minHeight: "100vh" } : { backgroundColor: "white", minHeight: "100vh" }} className="left-space">
                    <div className="container" id="max">
                        <div className="row">
                            {this.renderContent()}
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
export default withRouter(connect(mapStateToProps, { })(SelectedWorkHelper));
