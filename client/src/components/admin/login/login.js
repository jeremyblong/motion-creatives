import React, { Component } from 'react';
import "./style.css";
import axios from "axios";
import { NotificationManager } from 'react-notifications';
import { authentication } from "../../../actions/auth/authenticate.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class AuthenticationHelper extends Component {
constructor(props) {
    super(props);
    
    this.state = {
        email: "",
        password: "",
        remember: false
    }
}
    onSubmission = (e) => {
        e.preventDefault();

        const { email, password, remember } = this.state;

        axios.post("/authenticate", {
            email,
            password,
            remember
        }).then((res) => {
            if (res.data.message === "Found the desired registered user!") {
                console.log(res.data);

                NotificationManager.success('Successfully authenticated!', 'We are logging you in...', 4000);

                // localStorage.setItem('authenticated', JSON.stringify(res.data.user));

                this.props.authentication(res.data.user);

            } else {
                console.log("err occurred...", res.data);

                NotificationManager.error(res.data.message, "ERROR", 5000);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    render() {
        console.log(this.state);
        return (
            <div className="background-custom">
                 <div class="container">
                    <div class="row">
                    <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div class="card card-signin my-5">
                        <div class="card-body">
                            <h5 class="card-title major-title text-center">Sign In</h5>
                            <form onSubmit={this.onSubmission} class="form-signin">
                                <label for="inputEmail">Email address</label>
                                <div class="form-label-group">
                                    
                                    <input onChange={(e) => {
                                        this.setState({
                                            email: e.target.value
                                        })
                                    }} type="email" id="inputEmail" class="form-control" placeholder="Email address" placeholder={"Enter your email..."} required autofocus />
                                
                                </div>
                                <label for="inputPassword">Password</label>
                                <div class="form-label-group">
                                    <input onChange={(e) => {
                                        this.setState({
                                            password: e.target.value
                                        })
                                    }} type="password" id="inputPassword" class="form-control"     placeholder={"Enter your password..."} required/>
                                     
                                </div>

                                <div class="custom-control custom-checkbox mb-3">
                                    <input onChange={() => {
                                        this.setState({
                                            remember: !this.state.remember
                                        })
                                    }} type="checkbox" checked={this.state.remember} class="custom-control-input" id="customCheck1"/>
                                    <label class="custom-control-label" for="customCheck1">Remember password</label>
                                </div>
                                <button class="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                                <hr class="my-4"/>
                                <button onClick={() => {
                                    this.props.history.push("/");
                                }} class="btn btn-lg btn-success btn-block text-uppercase">Return Home</button>
                            </form>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(connect(null, { authentication })(AuthenticationHelper));