import { CONTENT } from "../actions/types.js";

const initialState = {};
 
export default (state = initialState, action) => {
	switch (action.type) {
		case CONTENT: 
			return {
				...state,
				posts: action.payload
			}
		default: 
			return state;
	}
}