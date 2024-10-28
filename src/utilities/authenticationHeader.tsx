import axios from "axios";
export function setAuthenticationHeader(token: string) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `barier ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}
