import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import HomepagePage from "./pages/homepage/index.js";
import AdminHomepagePage from "./pages/admin/index.js";
import AuthenticationPage from "./pages/admin/login/login.js";
import CreateNewListingPage from "./pages/admin/create-listing/createListing.js";
import { NotificationContainer } from 'react-notifications';
import SelectedWorkPage from "./pages/selected-work/selectedWork.js";
import IndividualPage from "./pages/individual/individualListing.js";
import { connect } from "react-redux";
import StillsPage from "./pages/stills/index.js";
import BTSPage from "./pages/bts/main.js";
import BTSCreateContentPage from "./pages/admin/BTSCreate/create.js";
import StillsCreatePage from "./pages/admin/stillsCreate/create.js";
import AboutPage from "./pages/about/index.js";
import ContactPage from "./pages/contact/index.js";
import axios from "axios";
import EditPageHomepagePage from "./pages/admin/individual/individual.js";
import { darkModeSwitch } from "./actions/dark_mode/mode.js";
import TeamPage from "./pages/team/index.js";

const EMAIL = process.env.REACT_APP_SECRET_EMAIL;

class App extends Component {
constructor(props) {
  super(props);
  
  this.state = {
    status: null
  }
}
componentDidMount() {

  // setTimeout(() => {
  //   this.props.darkModeSwitch(true);
  // }, 500)

  if (typeof window !== 'undefined') {
      this.setState({
        status: localStorage.getItem('authenticated') ? true : false
      })

      window.addEventListener('storage', this.localStorageUpdated)
  }

  axios.post("/update/page/count/homepage", {
    email: process.env.REACT_APP_SECRET_EMAIL
  }).then((res) => {
      if (res.data.message === "Successfully added to count!") {
          console.log(res.data);
      } else {
          console.log("Err", res.data);
      }
  }).catch((err) => {
      console.log(err);
  })
}
localStorageUpdated = () => {
  if (!localStorage.getItem('authenticated')) {
      this.updateState(false)
  } 
  else if (!this.state.status) {
      this.updateState(true)
  }
}
updateState = (value) => { 
  this.setState({
    status: value
  })
}
componentWillUnmount(){
  if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.localStorageUpdated)
  }
}
render () {
  console.log("this.state :", this.state);
    return (
      <div className="App">
        <NotificationContainer />
        <BrowserRouter>
          <Route exact path="/" component={HomepagePage} />
          <Route exact path="/admin" component={this.props.email === EMAIL ? AdminHomepagePage : AuthenticationPage} />
          <Route exact path="/create/listing/restricted" component={this.props.email === EMAIL ? CreateNewListingPage : AuthenticationPage} />
          <Route exact path="/selected/work" component={SelectedWorkPage} />
          <Route exact path="/listing/individual/:id" component={IndividualPage} />
          <Route exact path="/stills" component={StillsPage} />
          <Route exact path="/bts/main" component={BTSPage} />
          <Route exact path="/create/bts" component={this.props.email === EMAIL ? BTSCreateContentPage : AuthenticationPage} />
          <Route exact path="/stills/create" component={this.props.email === EMAIL ? StillsCreatePage : AuthenticationPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/contact" component={ContactPage} />
          <Route exact path="/individual/listing/:id" component={EditPageHomepagePage} />
          <Route exact path="/team" component={TeamPage} />
        </BrowserRouter>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
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
export default connect(mapStateToProps, { darkModeSwitch })(App);
