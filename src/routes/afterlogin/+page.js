import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getUserId } from "../../utils/auth.js";

export async function load({ fetch }) {
  const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/expenses/users/1',{// need to change this back to get from users instead hardcode it
    method: 'GET',
    mode: 'cors',
    header: {
      'Content-Type': 'application/json'
    }
  });

  const res = await resp.json();
  console.log(res)
  if (resp.status == 200) {
    return {
      expenses: res
    }
  } else {
    return {
      expenses: []
    }
  }
}
