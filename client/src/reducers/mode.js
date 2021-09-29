import { MODE } from "../actions/types.js";

const initialState = {
	darkMode: true
};
 
export default (state = initialState, action) => {
	switch (action.type) {
		case MODE: 
			return {
				...state,
				darkMode: action.payload
			}
		default: 
			return state;
	}
}