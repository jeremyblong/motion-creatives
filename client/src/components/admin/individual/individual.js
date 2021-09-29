import React, { Component } from 'react';
import axios from "axios";
import HamburgerMenu from "../../navigation/hamburger.js";
import ImageGallery from 'react-image-gallery';
import "./style.css";
import { withRouter } from "react-router-dom";

class EditPageHomepageHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        item: null,
        pictures: [],
        ready: false
    }
}

    componentDidMount() {
        axios.get("/gather/listing/unique", {
            params: {
                id: this.props.props.match.params.id
            }
        }).then((res) => {
            if (res.data.message === "Successfully gathered listing!") {
                console.log(res.data);

                const { item } = res.data;

                if (item.thumbnail_images.length > 0) {
                    for (let index = 0; index < item.thumbnail_images.length; index++) {
                        const image = item.thumbnail_images[index];
    
                        this.setState({
                            item,
                            pictures: [...this.state.pictures, {
                                original: `${process.env.REACT_APP_IMAGE_URL}/${image}`,
                                thumbnail: `${process.env.REACT_APP_IMAGE_URL}/${image}`
                            }]
                        })
    
                        if ((item.thumbnail_images.length - 1) === index) {
                            this.setState({
                                ready: true
                            })
                        }
                    }
                } else {
                    this.setState({
                        item,
                        ready: true
                    })
                }
            } else {
                console.log("err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    handleDeletion = () => {
        console.log("handleDeletion");

        axios.post("/delete/homepage/item", {
            id: this.props.props.match.params.id
        }).then((res) => {
            if (res.data.message === "Successfully deleted the selected item!") {
                this.props.history.push("/admin");
            } else {
                console.log("err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    render() {
        console.log("this.props.: ", this.props);

        const { pictures, ready, item } = this.state;
        return (
            <div>
                <HamburgerMenu />
                <p style={{ paddingTop: "100px" }} className="text-center bold">Below are thumbnail images from the homepage (not the images in the actual post) - those are different images - This is just to identify the post...</p>
                {ready === true ? <ImageGallery items={pictures} /> : null}
                <div className="container">
                    <button onClick={this.handleDeletion} className="btn btn-danger" style={{ width: "100%", marginTop: "40px" }}>Delete Post</button>
                </div>
                {item !== null ? <div style={{ paddingTop: "50px" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                <h6 className="card-title">Timeline</h6>
                                <div id="content">
                                    <ul className="timeline">
                                    <li className="event" data-date="Title">
                                        <h3>Title</h3>
                                        <p>{item.title}</p>
                                    </li>
                                    <li className="event" data-date="Description">
                                        <h3>Description</h3>
                                        <p>{item.description}</p>
                                    </li>
                                    {item.client_name.length > 0 ? <li className="event" data-date="Client Name">
                                        <h3>Client Name</h3>
                                        <p>{item.client_name}</p>
                                    </li> : null}
                                    {item.colorist.length > 0 ? <li className="event" data-date="Colorist">
                                        <h3>Colorist</h3>
                                        <p>{item.colorist}</p>
                                    </li> : null}
                                    {item.director_photography.length > 0 ? <li className="event" data-date="Director Of Photography">
                                        <h3>Director of Photography</h3>
                                        <p>{item.director_photography}</p>
                                    </li> : null}
                                    {item.executive.length > 0 ? <li className="event" data-date="Executive">
                                        <h3>Executive</h3>
                                        <p>{item.executive}</p>
                                    </li> : null}
                                    {item.lab.length > 0 ? <li className="event" data-date="Lab">
                                        <h3>Lab</h3>
                                        <p>{item.lab}</p>
                                    </li> : null}
                                    {item.main_director.length > 0 ? <li className="event" data-date="Main Director">
                                        <h3>Main Director</h3>
                                        <p>{item.main_director}</p>
                                    </li> : null}
                                    {item.producer_name.length > 0 ? <li className="event" data-date="Producer Name">
                                        <h3>Producer Name</h3>
                                        <p>{item.producer_name}</p>
                                    </li> : null}
                                    {item.production.length > 0 ? <li className="event" data-date="Production">
                                        <h3>Production</h3>
                                        <p>{item.production}</p>
                                    </li> : null}
                                    {item.production_co.length > 0 ? <li className="event" data-date="Production Co.">
                                        <h3>Production Co.</h3>
                                        <p>{item.production_co}</p>
                                    </li> : null}
                                    
                                    </ul>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div> : null}
            </div>
        )
    }
}
export default withRouter(EditPageHomepageHelper);