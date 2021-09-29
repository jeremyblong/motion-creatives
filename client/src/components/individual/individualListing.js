import React, { Component, Fragment } from 'react';
import axios from "axios";
import signature from "../../assets/images/signature.png";
import settings_icon from "../../assets/icons/settings.png";
import logo from "../../assets/images/motion.png";
import "./style.css";
import { withRouter, Link } from "react-router-dom";
import ReactPlayer from 'react-player';
import { slide as Menu } from 'react-burger-menu';
import { Modal } from 'react-responsive-modal';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { NotificationManager} from 'react-notifications';
import circle from "../../assets/icons/circle.png";
import slash from "../../assets/icons/slash.png";
import line from "../../assets/icons/line.png";
import { darkModeSwitch } from "../../actions/dark_mode/mode.js";
import slash_two from "../../assets/icons/slash-two.png";
import circle_two from "../../assets/icons/circle-two.png";
import vertical_two from "../../assets/icons/vertical-two.png";
import { connect } from "react-redux";
import signature_white from "../../assets/images/signature-white.png";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import dark_image from "../../assets/images/dark_image.png";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

class IndividualHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        post: null,
        open: false,
        gallery: [],
        ready: false,
        videos: [],
        posted_content: []
    }
}
    componentDidMount() {
        axios.post("/gather/unique/listing", {
            id: this.props.props.match.params.id
        }).then((res) => {
            if (res.data.message === "Successfully gathered the unique listing!") {
                console.log(res.data);

                const { post, posted_content } = res.data;

                for (let index = 0; index < post.main_images.length; index++) {
                    const image = post.main_images[index];
                    
                    if (image.type !== "video") {
                        this.setState({
                            gallery: [...this.state.gallery, {
                                original: `${process.env.REACT_APP_IMAGE_URL}/${image.image}`,
                                thumbnail: `${process.env.REACT_APP_IMAGE_URL}/${image.image}`,
                            }],
                            posted_content
                        })
                    } else {
                        this.setState({
                            videos: [...this.state.videos, `${process.env.REACT_APP_IMAGE_URL}/${image.image}`],
                            posted_content
                        })
                    }
                    if (post.main_images.length - 1 === index) {
                        this.setState({
                            ready: true
                        })
                    }
                }

                this.setState({
                    post
                })
            } else {
                console.log("Err", res.data)
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    handleErr = (err) => {
        console.log(err);
    }
    renderContent = () => {
        const { post } = this.state;

        return post.main_images.map((file, index) => {
            if (file.type === "video") {
                return (
                    <Fragment>
                        <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 nopadding thicker">
                            <ReactPlayer controls={true} url={`${process.env.REACT_APP_IMAGE_URL}/${file.image}`} className="long-width-short" />
                        </div>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <div onClick={() => {
                            this.setState({
                                open: true
                            })
                        }} className="col-md-6 col-lg-6 col-sm-12 col-xs-12 nopadding thicker">
                            <LazyLoadImage 
                                effect={"blur"}
                                height={"100%"}
                                src={`${process.env.REACT_APP_IMAGE_URL}/${file.image}`}
                                width={"100%"}  
                                className={"long-width-short"}
                            />
                        </div>
                    </Fragment>
                );
            }
        })
    }
    renderInfo = () => {
        const { post } = this.state;

        if (typeof post !== "undefined" && post !== null) {
            return (
                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                    <ul id="special-list">
                        {typeof post.client_name !== "undefined" && post.client_name.length > 0 ? <li className="li-px"><strong>Client Name</strong>: {post.client_name}</li> : null}
                        {typeof post.producer_name !== "undefined" && post.producer_name.length > 0 ? <li className="li-px"><strong>Producer Name</strong>: {post.producer_name}</li> : null}
                        {typeof post.main_director !== "undefined" && post.main_director.length > 0 ? <li className="li-px"><strong>Director:</strong> {post.main_director}</li> : null}
                        {typeof post.director_photography !== "undefined" && post.director_photography.length > 0 ? <li className="li-px"><strong>Director of photography</strong>: {post.director_photography}</li> : null}
                        {typeof post.executive !== "undefined" && post.executive.length > 0 ? <li className="li-px"><strong>Executive</strong>: {post.executive}</li> : null}
                        {typeof post.production !== "undefined" && post.production.length > 0 ? <li className="li-px"><strong>Production</strong>: {post.production}</li> : null}
                        {typeof post.production_co !== "undefined" && post.production_co.length > 0 ? <li className="li-px"><strong>Production Company</strong>: {post.production_co}</li> : null}
                        {typeof post.editor !== "undefined" && post.editor.length > 0 ? <li className="li-px"><strong>Editor</strong>: {post.editor}</li> : null}
                        {typeof post.colorist !== "undefined" && post.colorist.length > 0 ? <li className="li-px"><strong>Colorist</strong>: {post.colorist}</li> : null}
                        {typeof post.lab !== "undefined" && post.lab.length > 0 ? <li className="li-px"><strong>Lab</strong>: {post.lab}</li> : null}
                        {typeof post.description !== "undefined" && post.description.length > 0 ? <li className="li-px"><strong>Description: </strong>: {post.description}</li> : null}
                    </ul>
                </div>
            );
        }
    }
    nextProject = () => {
        console.log("nextProject");

        const { posted_content } = this.state;

        for (let index = 0; index < posted_content.length; index++) {
            const post = posted_content[index];
            
            if (post.id === this.state.post.id) {
                if (typeof posted_content[index + 1] !== "undefined") {
                    this.props.history.push(`/listing/individual/${posted_content[index + 1].id}`);

                    setTimeout(() => {
                        window.location.reload();
                    },  1000);
                } else {
                    NotificationManager.warning('There are no other projects, please select previous project to view more projects!', 'WARNING!', 5000);
                }
            }
        }
    }
    flipMode = () => {
        this.props.darkModeSwitch(!this.props.mode);
    }
    previousProject = () => {
        console.log("previousProject");

        const { posted_content } = this.state;

        for (let index = 0; index < posted_content.length; index++) {
            const post = posted_content[index];
            
            if (post.id === this.state.post.id) {
                if (typeof posted_content[index - 1] !== "undefined") {
                    this.props.history.push(`/listing/individual/${posted_content[index - 1].id}`);

                    setTimeout(() => {
                        window.location.reload();
                    },  1000);
                } else {
                    NotificationManager.warning('There are no other projects, please select "next project" to view more projects!', 'WARNING!', 5000);
                }
            }
        }
    }
    render() {
        console.log(this.state);
        const { post, ready, videos } = this.state;
        return (
            <div style={{ paddingBottom: "150px" }} className={this.props.mode === true ? "all-black" : "white"}>
                {ready === true ? <Modal onOverlayClick={() => {
                    this.setState({
                        open: false
                    })
                }} closeOnOverlayClick={true} styles={{ modal: { zIndex: "9999999999999" }, overlay: { zIndex: "9999999999999" } }} id="main-modal" open={this.state.open} onClose={() => {
                    this.setState({
                        open: false
                    })
                }} center>
                    <div className="modal-modal">
                        <ImageGallery items={this.state.gallery} />
                    </div>
                </Modal> : null}
                <div id="mobile-only">
                    <Menu right width="100vw" animation={"stack"}>
                        <Link id="home" className="menu-item" to="/">Home</Link>
                        <Link id="about" className="menu-item" to="/bts/main">BTS Page</Link>
                        <Link id="contact" className="menu-item" to="/stills">Stills</Link>
                        <Link className="menu-item" to="/selected/work">Selected Work</Link>
                    </Menu>
                </div>
                <div className="mobile-strip-custom mx-auto">
                    <img src={signature} className="absolute-image-sig-two" />
                </div>
                <div className={this.props.mode === true ? "side-navigation-full-dark side-navigation-full" : "side-navigation-full"}>
                   <div onClick={() => {
                       this.props.history.push("/");
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
                        <li onClick={() => {
                            this.props.history.push("/bts/main");
                        }}>BTS</li>
                        <li style={{ marginTop: "75px" }} onClick={() => {
                            this.props.history.push("/about");
                        }}>ABOUT</li>
                        <li onClick={() => {
                            this.props.history.push("/contact");
                        }}>CONTACT</li>
                    </ul>
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
                </div>
                <div className="left-space">
                    <div className={this.props.mode === true ? "container container-class dark-container-class" : "container container-class"}>
                        <div className="row lower-margin" style={{ paddingTop: "40px" }}>
                            <h6 className="left pointer pointer-one" onClick={this.previousProject}><i>PREVIOUS PROJECT</i></h6>
                            <h6 className="center">{typeof post !== "undefined" && post !== null ? post.title.slice(0, 20) : null}{typeof post !== "undefined" && post !== null && post.title.length > 20 ? "..." : ""}</h6>
                            <h6 className="right pointer pointer-two" onClick={this.nextProject}><i>NEXT PROJECT</i></h6>
                        </div>
                        <div className="row">
                            {typeof videos !== "undefined" && videos.length > 0 ? <div id="video-con"><ReactPlayer width={"100%"} controls={true} url={videos[0]} className="big-video" /></div> : null}
                        </div>
                        {this.state.post !== null && this.state.post.title.trim() === "Ready 2 Race" ? <iframe src="https://player.vimeo.com/video/489712110" width="100%" height="500" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe> : null}
                        <hr className="black-line" />
                        <div style={{ paddingTop: "20px" }} className="row">
                            {typeof post !== "undefined" && post !== null ? this.renderInfo() : null}
                        </div>
                        <div className="row">
                        
                         {typeof post !== "undefined" && post !== null ? this.renderContent() : null}
                        </div>
                        {/* <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">

                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                            
                        </div> */}
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
export default withRouter(connect(mapStateToProps, { darkModeSwitch })(IndividualHelper));