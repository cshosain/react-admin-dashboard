import axios from "axios";
export function setAuthenticationHeader(token: string) {
  if (token) {
    axios.defaults.headers.common["authorization"] = `bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["authorization"];
  }
}
