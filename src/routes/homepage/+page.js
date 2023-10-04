import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getUserId } from "../../utils/auth.js"

export async function load({ fetch }) {
	const resp = await fetch(
		PUBLIC_BACKEND_BASE_URL + '/expenses/users/' + getUserId() 
	);
	const res = await resp.json();
	if (resp.ok) {
		const expenses = res.sort((a, b) => {
			const dateA = new Date(a.date);
			const dateB = new Date(b.date);
			return dateA - dateB;
		  });
		  
		return {
			expenses: res
		};
	} else {
		return {
			expenses: []
		};
	}
}