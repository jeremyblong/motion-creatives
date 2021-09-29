import React, { Component, Fragment } from 'react';
import HamburgerMenu from "../navigation/hamburger.js";
import "./style.css";
import { withRouter } from "react-router-dom";
import axios from "axios";
import SimpleImageSlider from "react-simple-image-slider";


class AdminHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        count: 0,
        total_listings: 0,
        posted_content: []
    }
}

  componentDidMount() {
      axios.get("/gather/info/dashboard", {
          params: {
              email: process.env.REACT_APP_SECRET_EMAIL
          }
      }).then((res) => {
          if (res.data.message === "Gathered info!") {
                console.log(res.data);

                const { count, total_listings, user } = res.data;

                this.setState({
                    count,
                    total_listings,
                    posted_content: user.posted_content
                })
            }
      }).catch((err) => {
          console.log(err);
      })
  }
  render() {
    console.log("this.state admin index.js- --- -- - -  :", this.state);

    const { posted_content } = this.state;

    return (
      <Fragment>
          <HamburgerMenu />
          <div className="container">
              <div style={{ paddingTop: "40px" }} className="row">
                  <div className="col-md-12 col-lg-12 col-sm-12 mx-auto">
                      <h1 className="text-center top-text">Welcome to your admin portal.</h1>
                  </div>
              </div>
          </div>
          <div className="container">
            <div className="row">
                <div className="col-md-6 col-xl-6">
                <div className="card card-two bg-c-blue order-card">
                    <div className="card-block">
                    <h6 className="m-b-20">Total Items</h6>
                    <h2 className="text-right"><i className="fa fa-cart-plus f-left" /><span>{this.state.total_listings}</span></h2>
                    {/* <p className="m-b-0">Completed Orders<span className="f-right">651</span></p> */}
                    </div>
                </div>
                </div>
                <div className="col-md-6 col-xl-6">
                <div className="card card-two bg-c-green order-card">
                    <div className="card-block">
                    <h6 className="m-b-20">Page Views</h6>
                    <h2 className="text-right"><i className="fa fa-rocket f-left" /><span>{this.state.count.toString()}</span></h2>
                    {/* <p className="m-b-0">Completed Orders<span className="f-right">351</span></p> */}
                    </div>
                </div>
                </div>
                {/* <div className="col-md-4 col-xl-3">
                <div className="card card-two bg-c-yellow order-card">
                    <div className="card-block">
                    <h6 className="m-b-20">Orders Received</h6>
                    <h2 className="text-right"><i className="fa fa-refresh f-left" /><span>486</span></h2>
                    <p className="m-b-0">Completed Orders<span className="f-right">351</span></p>
                    </div>
                </div>
                </div>
                <div className="col-md-4 col-xl-3">
                <div className="card card-two bg-c-pink order-card">
                    <div className="card-block">
                    <h6 className="m-b-20">Orders Received</h6>
                    <h2 className="text-right"><i className="fa fa-credit-card f-left" /><span>486</span></h2>
                    <p className="m-b-0">Completed Orders<span className="f-right">351</span></p>
                    </div>
                </div>
                </div> */}
            </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <button className="btn black-btn" style={{ width: "100%" }} onClick={() => {
                            this.props.history.push("/create/listing/restricted");
                        }}>Submit New Homepage Listings</button>
                    </div>
                </div>
                <div style={{ marginTop: "35px" }} className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <button className="btn btn-success" style={{ width: "100%" }} onClick={() => {
                            this.props.history.push("/create/bts");
                        }}>Create BTS Content</button>
                    </div>
                </div>
                <div style={{ marginTop: "35px" }} className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <button className="btn btn-info" style={{ width: "100%" }} onClick={() => {
                            this.props.history.push("/stills/create");
                        }}>Create Still's Content</button>
                    </div>
                </div>
                <div style={{ marginTop: "35px", marginBottom: "30px" }} className="row">
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <button className="btn btn-danger" style={{ width: "100%" }} onClick={() => {
                            this.props.history.push("/");
                        }}>Go Back To Homepage</button>
                    </div>
                </div>
            </div>
            <section className="section-custom gray-bg" id="blog">
                <div className="container">
                    <div className="row justify-content-center">
                    <div className="col-lg-7 text-center">
                        <div className="section-title">
                        <h2>Homepage Projects</h2>
                        <p>Edit + Manage your homepage projects...</p>
                        </div>
                    </div>
                    </div>
                    <div className="row">
                        {typeof posted_content !== "undefined" && posted_content.length > 0 ? posted_content.map((content, index) => {
                            console.log("content", content);
                            return (
                                <Fragment>
                                    <div className="col-lg-4">
                                        <div className="blog-grid">
                                            <div className="blog-img">
                                                <div className="date">{content.date}</div>
                                                <a onClick={() => {
                                                    this.props.history.push(`/individual/listing/${content.id}`);
                                                }}>
                                                    <img id="thumbnail-img" src={`${process.env.REACT_APP_IMAGE_URL}/${content.thumbnail_images[Math.floor(Math.random() * content.thumbnail_images.length)]}`} title alt="" />
                                                </a>
                                            </div>
                                            <div className="blog-info">
                                                <h5><a onClick={() => {
                                                    this.props.history.push(`/individual/listing/${content.id}`);
                                                }}>{content.title}</a></h5>
                                                <p onClick={() => {
                                                    this.props.history.push(`/individual/listing/${content.id}`);
                                                }}>{content.description.slice(0, 130)}{typeof content.description !== "undefined" && content.description.length > 130 ? "..." : ""}</p>
                                                <div className="btn-bar">
                                                <a onClick={() => {
                                                    this.props.history.push(`/individual/listing/${content.id}`);
                                                }} className="px-btn-arrow">
                                                    <span>EDIT</span>
                                                    <i className="arrow" />
                                                </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            );
                        }) : null}
                    </div>
                </div>
                </section>
      </Fragment>
    );
  }
}
export default withRouter(AdminHelper);