import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

function decodeJwtToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function cookies() {
  const token = Cookies.get("token");
  let decodedToken;

  if (token) {
    decodedToken = decodeJwtToken(token);
  }

  return {
    username: Cookies.get("username"),
    token: token,
    branch: Cookies.get("branch"),
    valid:
      decodedToken &&
      decodedToken.username.toLowerCase() ===
        Cookies.get("username").toLowerCase(),
  };
}
