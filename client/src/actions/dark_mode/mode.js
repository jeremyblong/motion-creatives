import { MODE } from "../types.js";

export const darkModeSwitch = (item) => {
	return {
		type: "MODE",
		payload: item
	}
}