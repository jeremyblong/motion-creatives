import React, { Component } from 'react'
import HamburgerMenu from '../../navigation/hamburger';
import FloatingLabelInput from 'react-floating-label-input';
import "./style.css";
import ImageUploader from 'react-images-upload';
import Dropzone from 'react-dropzone';
import axios from "axios";
import io from 'socket.io-client';
import LoadingBar from 'react-top-loading-bar';
import { NotificationManager} from 'react-notifications';
import Switch from "react-switch";


const socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });

const EMAIL = process.env.REACT_APP_SECRET_EMAIL;

class CreateNewListingHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        title: "",
        clientName: "",
        producerName: "",
        mainDirector: "",
        directorPhotography: "",
        description: "",
        executive: "",
        production: "",
        productionCompany: "",
        editor: "",
        colorist: "",
        lab: "",
        pictures: [],
        selected: false,
        mainFiles: [],
        current: 0,
        currentLoad: 0,
        checked: false,
        videos: []
    }
}
    onDrop = (pictures) => {
        console.log("pictures");

        this.setState({
            pictures
        })
        // this.setState({
        //     pictures: []
        // }, () => {
        //     for (let index = 0; index < pictures.length; index++) {
        //         const picture = pictures[index];
                
        //         this.toBase64(picture);
        //     }
        // })
    }
    toBase64 = file => {
       
        this.setState({
            pictures: [...this.state.pictures, file]
        })
    };
    base64conversionDropZone = file => {
        this.setState({
            mainFiles: [...this.state.mainFiles, file]
        })
    };
    handleConversion = (files) => {
        this.setState({
            selected: true
        })

        for (let index = 0; index < files.length; index++) {
            const file = files[index];

            console.log("file!!!!", file);

            if (file.type === "video/mp4") {
                // const promise = new Promise((resolve, reject) => {
                //     const reader = new FileReader();
                //     reader.readAsDataURL(file);
                //     reader.onload = () => resolve(reader.result);
                //     reader.onerror = error => reject(error);
                // });
                // promise.then((value) => {
                //     this.setState({
                //         videos: [...this.state.videos, value]
                //     })
                // });
                this.base64conversionDropZone(file);
            } else {
                this.base64conversionDropZone(file);
            }
        }
    }
    renderSockets = () => {
        socket.on("progress", (data) => {

            console.log("websocket - progress data", data);

            const { total_load, current } = data;

            if (this.state.current !== current) {
                this.setState({
                    currentLoad: Math.round(Number((current / total_load) * 100)),
                    current: current
                }) 
            }
        })
    }
    handleSubmission = (e) => {
        e.preventDefault();

        const { mainFiles, title, clientName, producerName, mainDirector, directorPhotography, description, executive, production, productionCompany, editor, colorist, lab, pictures, checked } = this.state;

        let dataaa = new FormData();

        const promiseee = new Promise((resolveee, rejecttt) => {
            for (let index = 0; index < mainFiles.length; index++) {
                const mainFile = mainFiles[index];
    
                dataaa.append("pictures", mainFile);

                if ((mainFiles.length - 1) === index) {
                    resolveee();
                }
            }
        })
        promiseee.then((passed) => {
            // dataaa.append('images', mainFiles);
            dataaa.append('title', title);
            dataaa.append('clientName', clientName);
            dataaa.append('producerName', producerName);
            dataaa.append('mainDirector', mainDirector);
            dataaa.append('directorPhotography', directorPhotography);
            dataaa.append('description', description);
            dataaa.append('executive', executive);
            dataaa.append('production', production);
            dataaa.append('productionCompany', productionCompany);
            dataaa.append('editor', editor);
            dataaa.append('colorist', colorist);
            dataaa.append('lab', lab);
            dataaa.append('checked', checked);
            dataaa.append("email", EMAIL);
            dataaa.append("videos", this.state.videos);

            if (mainFiles.length > 0) {

                NotificationManager.info('Now processing your uploads, please be patient. You will be notified when completed. This may take a few minutes depending on how many files you are uploading.', "Loading...", 8000);

                this.setState({
                    title: "",
                    clientName: "",
                    producerName: "",
                    mainDirector: "",
                    directorPhotography: "",
                    description: "",
                    executive: "",
                    production: "",
                    productionCompany: "",
                    editor: "",
                    colorist: "",
                    lab: "",
                    selected: false,
                    checked: false
                })

                axios({
                    method: 'post',
                    url: '/post/new/item',
                    data: dataaa,
                    headers: {
                        'Content-Type': 'multipart/form-data' 
                    }
                }).then((res) => {
                    if (res.data.message === "Successfully posted your new item!") {
                        console.log(res.data);

                        NotificationManager.success('Successfully uploaded your new item!', 'SUCCESS!', 5000);
                    } else {
                        console.log("err", res.data);
                    }
                }).catch((err) => {
                    console.log(err);
                })
            } else {
                NotificationManager.error('You MUST have a least one picture in both thumbnails and the main pictures - drag n drop area!', 'ERROR!', 5000);
            }
        })
        
    }
    handleChangeToggle = (checked) => {
        this.setState({ checked });
    }
    render() {
        console.log("createListing", this.state);
        return (
            <div className="main">
                <HamburgerMenu />
                {this.renderSockets()}
                <LoadingBar
                    color='#0a9100'
                    progress={this.state.currentLoad} 
                    height={8}
                    onLoaderFinished={() => {
                        this.setState({
                            currentLoad: 0,
                            current: 0
                        })
                    }}
                />
                <div className="container custom-contain">
                    <div className="row justify-content-center inner-content">
                        <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                        <h2 style={{ paddingTop: "50px" }} className="h3 mb-4 page-title">Homepage Thumbnails + Individual Listing Content</h2>
                        <div className="my-4">
                            
                            <form enctype="multipart/form-data" autocomplete="off">
                                <div className="row mt-5 align-items-center">
                                   
                                    <div className="col">
                                    <div className="row align-items-center form-row-custom">
                                        <div className="col-md-12 col-sm-12">
                                        <h4 className="mb-1">Fill out whichever details are relevent and leave the rest blank.</h4>
                                        <p className="small mb-3"><span className="badge badge-dark">Item upload page</span></p>
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-12 col-sm-12">
                                        <p className="lead">
                                            You can include a title, description, thumbnail images (display on homepage) and content (images - videos). You should fill out each field that is relevant, it's better to include all the details for the user browsing the website.
                                        </p>
                                        </div>
                                        <div className="col">
                                        <h4 className="header-one">Required Fields</h4>
                                        <p className="small mb-0 lead">Thumbnail Images</p>
                                        <p className="small mb-0 lead">Content Images/Videos</p>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <hr className="my-4" />
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-12">
                                    <FloatingLabelInput 
                                        className="form-input-custom"
                                        id="input"
                                        label="Title"
                                        onBlur={null}
                                        onChange={(e) => {
                                            this.setState({
                                                title: e.target.value
                                            })
                                        }}
                                        onFocus={null}
                                        value={this.state.title}
                                    />
                                    </div>
                                    
                                </div>
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-12 col-sm-12">
                                        <textarea className="my-textarea form-control" rows={5} onChange={(e) => {
                                            this.setState({
                                                description: e.target.value
                                            })
                                        }} placeholder={"Enter a description for your new post..."} value={this.state.description} />
                                    </div>
                                </div>
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Client Name"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    clientName: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.clientName}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Producer - Credits"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    producerName: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.producerName}
                                        />
                                    </div>
                                </div>
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Executive Producer"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    executive: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.executive}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Production"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    production: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.production}
                                        />
                                    </div>
                                </div>
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Director of Photography"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    directorPhotography: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.directorPhotography}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Main Director"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    mainDirector: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.mainDirector}
                                        />
                                    </div>
                                </div>
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Production Co. Credits"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    productionCompany: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.productionCompany}
                                        />
                                    </div>
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Editor"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    editor: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.editor}
                                        />
                                    </div>
                                </div>
                                <div className="form-row form-row-custom">
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Colorist - Credits"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    colorist: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.colorist}
                                        />
                                    </div>
                                    
                                    <div className="form-group col-md-6 col-sm-12">
                                        <FloatingLabelInput 
                                            className="form-input-custom"
                                            id="input"
                                            label="Lab"
                                            onBlur={null}
                                            onChange={(e) => {
                                                this.setState({
                                                    lab: e.target.value
                                                })
                                            }}
                                            onFocus={null}
                                            value={this.state.lab}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                   <div className="mx-auto">
                                    <label>
                                            <span>Selected Project?</span> <hr className="my-4" />
                                            <Switch onChange={this.handleChangeToggle} checked={this.state.checked} />
                                        </label>
                                   </div>
                                </div>
                                {/* <div className="form-row form-row-custom">
                                    <div className="col-md-12 col-sm-12">
                                        {/* <ImageUploader   
                                            name="images"
                                            withPreview={true}
                                            withIcon={true}
                                            buttonText='Choose images to display on homepage'
                                            onChange={this.onDrop}
                                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                                            maxFileSize={999999999}
                                        /> 
                                        <input type="file" multiple name="images" onChange={(e) => {
                                            this.setState({
                                                pictures: e.target.files
                                            })
                                        }} />
                                    </div>
                                </div> */}
                                
                                <div className="form-row form-row-custom">
                                    <div className="col-md-12 col-sm-12">
                                    <Dropzone name="photos" accept={"image/jpg, image/jpeg, image/png, video/mp4"} maxFiles={20} multiple={true} onDrop={this.handleConversion}>
                                        {({getRootProps, getInputProps}) => (
                                        <section className="container">
                                            <div {...getRootProps({className: 'dropzone'})}>
                                            <input {...getInputProps()} />
                                                {this.state.selected === false ? <div class="alert alert-danger" role="alert">
                                                    <h4 class="alert-heading text-center">Please select the files you would like to upload...</h4>
                                                    <p>These files can be MP4 videos or images such as .PNG, .JPG, JPEG. Drag and drop as many as you'd like!</p>
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
export default CreateNewListingHelper;