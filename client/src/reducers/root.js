import { combineReducers } from "redux";
import auth from "./auth.js";
import posts from "./posts.js";
import mode from "./mode.js";

export default combineReducers({
    authenticated: auth,
    posts,
    mode
});