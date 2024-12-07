const checkLogin = () => {
  let loggedIn = false;
  let userType = false;

  const expiry = localStorage.getItem("tokenExpiry");
  const type = localStorage.getItem("userType");

  if (expiry) {
    const currentTime = Date.now() / 1000; // Convert to seconds
    const expiryTime = expiry - currentTime;

    console.log("Token expiring In:", expiryTime);
    if (expiryTime > 0) {
      loggedIn = true;
    } else {
      loggedIn = false;
    }
  } else {
    console.log("logged out");
    loggedIn = false;
  }

  if (type) {
    if (type == "user") {
      userType = "user";
    } else if (type == "seller") {
      userType = "seller";
    } else {
      userType = false;
    }
  } else {
    userType = false;
  }

  return { loggedIn, userType };
};

export default checkLogin;
