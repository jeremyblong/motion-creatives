import { CONTENT } from "../types.js";

export const receiveContent = (item) => {
	return {
		type: "CONTENT",
		payload: item
	}
}