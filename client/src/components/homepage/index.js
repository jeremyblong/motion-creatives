import React, { Component, Fragment } from 'react';
import "./style.css";
import { withRouter, Link } from "react-router-dom";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import signature from "../../assets/images/signature.png";
import logo from "../../assets/images/motion.png";
import signature_white from "../../assets/images/signature-white.png";
import settings_icon from "../../assets/icons/settings.png";
import axios from "axios";
import { connect } from "react-redux";
import { receiveContent } from "../../actions/posts/homepage.js";
import { slide as Menu } from 'react-burger-menu';
import circle from "../../assets/icons/circle.png";
import slash from "../../assets/icons/slash.png";
import line from "../../assets/icons/line.png";
import { darkModeSwitch } from "../../actions/dark_mode/mode.js";
import slash_two from "../../assets/icons/slash-two.png";
import circle_two from "../../assets/icons/circle-two.png";
import vertical_two from "../../assets/icons/vertical-two.png";
import 'react-lazy-load-image-component/src/effects/blur.css';
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


const URL = process.env.REACT_APP_IMAGE_URL;

class HomepageHelper extends Component {
constructor(props) {
    super(props);

    this.state = {
        selected: null,
        posts: [],
        current: "",
        isOpen: false,
        ready: false,
        showAll: true,
        showNav: false
    }
    this.selected = React.createRef();
}
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    flipMode = () => {
        this.props.darkModeSwitch(!this.props.mode);
    }
    mouseEnter = (value) => {
        console.log("value", value);
        
        this.setState({
            showAll: false
        }, () => {
            this.selected = value.id;

            this.forceUpdate();
        })
    }
    handleRedirect = (post) => {
        this.props.history.push(`/listing/individual/${post.id}`);
    }
    componentDidMount() {

        axios.get("/gather/thumbnails/all").then((res) => {
            if (res.data.message === "Successfully gathered posts!") {

                const { posts } = res.data;

                const content_arr = [];

                const newPromise = new Promise((resolve, reject) => {
                    for (let index = 0; index < posts.length; index++) {
                        const post = posts[index];
                        
                        if (post.thumbnail_images) {
                            for (let indexx = 0; indexx < post.thumbnail_images.length; indexx++) {

                                const thumbnail = post.thumbnail_images[indexx];

                                content_arr.push({
                                    id: post.id,
                                    thumbnail: `${URL}/${thumbnail}`,
                                    title: post.title
                                });

                                
                            }
                        }
                        if (index === (posts.length - 1)) {
                            resolve(content_arr);
                        }
                    }
                })

                newPromise.then((passedValues) => {
                    const shuffled = this.shuffleArray(passedValues);

                    this.props.receiveContent(shuffled);

                    this.setState({
                        ready: true
                    })
                })
                console.log(res.data);
            } else {
                console.log("Err", res.data)
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    shuffleArray = (a) => {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    render() {

        console.log("this.state.homepage", this.state);
        const { posts } = this.props;
        return (
        <Fragment>
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
            <div className={this.props.mode === true ? "mobile-strip mx-auto dark-settings" : "mobile-strip mx-auto"}>
                <img src={logo} className="absolute-image-sig-two" />
            </div>
            <div className={this.props.mode === true ? "container-fluid dark-background" : "container-fluid background"}>
                <div onMouseEnter={() => {
                    this.setState({
                        showAll: true
                    })
                }} id="side-nav-homepage" className={this.props.mode === true ? "side-navigation side-nav-dark" : "side-navigation"}>
                    <img src={this.props.mode === true ? dark_image : logo} className={this.props.mode === true ?  "absolute-image-sig absolute-image-sig-dark" : "absolute-image-sig"}/>
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
                        <li id="bts-link" onClick={() => {
                            this.props.history.push("/bts/main");
                        }}>BTS</li>
                        <li onClick={() => {
                            this.props.history.push("/about");
                        }} className="bridge">ABOUT</li>
                        <li onClick={() => {
                            this.props.history.push("/contact");
                        }} className="bridge-two">CONTACT</li>
                    </ul>
                    <div className="dark-mode-btns-left row">
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
                
                <div className="row custom-row no-padding">
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(0, 4).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                   
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(5, 9).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(10, 15).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(16, 21).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(22, 28).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(29, 34).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(35, 40).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(41, 46).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(47, 52).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                    {typeof posts !== "undefined" && posts.length > 0 && this.state.ready === true ? posts.slice(53, 60).map((post, index) => {
                        console.log("post", post);
                        if (this.selected === post.id || this.state.showAll === true) {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item hovered-state"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image"}
                                        />
                                        <span className="special-hover-state">
                                            {this.state.showAll === false ? <p className="lead text-white">{post.title.slice(0, 13)}{typeof post.title !== "undefined" && post.title.length > 13 ? "..." : ""}</p> : null}
                                        </span>
                                    </div>
                                </Fragment>
                            );
                        } else {
                            return (
                                <Fragment key={index}>
                                    <div ref={this.selected} onMouseOver={(e) => {
                                        this.mouseEnter(post);
                                    }} onClick={() => {
                                        this.handleRedirect(post);
                                    }} className={"col-md-6 col-lg-3 col-xl-3 col-sm-6 col-sx-12 item-one list-item nopadding un-hovered"}>
                                        <LazyLoadImage 
                                            effect={"blur"}
                                            height={"100%"}
                                            src={post.thumbnail} // use normal <img> attributes as props
                                            width={"100%"}  
                                            className={"image image-hovered"}
                                        />
                                    </div>
                                </Fragment>
                            );
                        }
                        
                    }) : null}
                </div>
            </div>
        </Fragment>
        )
    }
}
const mapStateToProps = (state) => {
    console.log("state", state);
    if (typeof state.posts.posts !== "undefined") {
        if (Object.keys(state.posts.posts).length === 0) {
            return {
                posts: [],
                mode: false
            }
        } else {
            return {
                posts: state.posts.posts,
                mode: state.mode.darkMode
            }
        } 
    }
}
export default withRouter(connect(mapStateToProps, { receiveContent, darkModeSwitch })(HomepageHelper));