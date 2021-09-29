import React, { Component } from 'react'
import HamburgerMenu from '../../navigation/hamburger';
import "./style.css";
import Dropzone from 'react-dropzone';
import axios from "axios";
import { NotificationManager} from 'react-notifications';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class BTSCreateContent extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        pictures: [],
        selected: false
    }
}
    base64conversionDropZone = file => {
        const promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        promise.then((value) => {
            this.setState({
                pictures: [...this.state.pictures, value]
            })
        });
    };
    handleConversion = (files) => {
        this.setState({
            selected: true,
            pictures: []
        }, () => {
            for (let index = 0; index < files.length; index++) {
                const file = files[index];
                
                this.base64conversionDropZone(file);
            }
        })
        
    }
    handleSubmission = (e) => {
        e.preventDefault();
        
        console.log("handleSubmission");

        const { pictures } = this.state;

        NotificationManager.info('Uploading your images now, you will get a notification when the process is complete.', 'Processing!', 5000);

        axios.post("/upload/bts/content", {
            pictures,
            email: this.props.email 
        }).then((res) => {
            if (res.data.message === "Successfully updated your photos to the BTS page!") {
                console.log(res.data);

                NotificationManager.success('Successfully added your new photos to the BTS page!', 'SUCCESS!', 5000);
            } else {
                console.log("Err", res.data);
            }
        }).catch((err) => {
            console.log(err);
        })
    }
    render() {
        console.log("create BTS state...", this.state);
        return (
            <div className="main">
                <HamburgerMenu />
          
                
                <div className="container custom-contain-two">
                    <div className="row justify-content-center inner-content">
                        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                        <h2 style={{ paddingTop: "50px" }} className="h3 mb-4 page-title">BTS - Create Content</h2>
                        <div className="my-4">
                            
                            <form autocomplete="off">
                                <div className="row mt-5 align-items-center">
                                   
                                    <div className="col">
                                    <div className="row align-items-center form-row-custom">
                                        <div className="col-md-12 col-sm-12">
                                        <h4 className="mb-1">Select at least one photo before uploading...</h4>
                                        <p className="small mb-3"><span className="badge badge-dark">Item upload page</span></p>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-12 col-sm-12">
                                        <p className="lead">
                                            You can choose JPG's, PNG's, or JPEG's for the uploads on the BTS content page. Tall images will fit appropriately similarily to the smaller horizontal pictures.
                                        </p>
                                        </div>
                                        <div className="col">
                                        <h4 className="header-one">Required Fields</h4>
                                        <p className="small mb-0 lead">At least ONE image</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <hr className="my-4" />

                                <div className="form-row form-row-custom">
                                    <div className="col-md-12 col-sm-12">
                                    <Dropzone accept={"image/jpg, image/jpeg, image/png"} maxFiles={20} multiple={true} onDrop={this.handleConversion}>
                                        {({getRootProps, getInputProps}) => (
                                        <section className="container">
                                            <div {...getRootProps({className: 'dropzone'})}>
                                            <input {...getInputProps()} />
                                                {this.state.selected === false ? <div class="alert alert-danger" role="alert">
                                                    <h4 class="alert-heading text-center">Please select the files you would like to upload...</h4>
                                                    <p>These files can be images such as .PNG, .JPG, JPEG. Drag and drop as many as you'd like!</p>
                                                    <hr className="my-4" />
                                                    <p class="mb-0">Try to limit the upload count to roughly 20 items total per listing.</p>
                                                </div> : <div class="alert alert-success" role="alert">
                                                    <h4 class="alert-heading text-center">Please select the files you would like to upload...</h4>
                                                    <p>These files can be MP4 videos or images such as .PNG, .JPG, JPEG. Drag and drop as many as you'd like!</p>
                                                    <hr className="my-4" />
                                                    <p class="mb-0">Try to limit the upload count to roughly 20 items total per listing.</p>
                                                </div>}
                                            </div>
                                        </section>
                                        )}
                                    </Dropzone>
                                    
                                    </div>
                                </div>
                                
                                <button onClick={this.handleSubmission} type="submit" className="btn btn-success" style={{ width: "100%" }}>Upload Changes</button>
                            </form>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    console.log("state", state);
    if (typeof state.authenticated.authenticated !== "undefined") {
        if (Object.keys(state.authenticated.authenticated).length === 0) {
            return {
                email: null
            }
        } else {
            return {
                email: state.authenticated.authenticated.email
            }
        } 
    }
}
export default withRouter(connect(mapStateToProps, { })(BTSCreateContent));