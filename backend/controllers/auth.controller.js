const jwt = require("jsonwebtoken");

const basicAuth = async (request, response, next) => {
  // console.log("entering basic auth")
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];
      // console.log("token is:", token)

    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, "login-token");

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    // pass the user down to the endpoints here
    request.user = user;

    // pass down functionality to the endpoint
    next();
  } catch (error) {
    // console.log("no token fo??und")
    response.status(400).json({
      error: "Invalid request!",
      message: "Don't have sufficient permissions to view this page",
    });
  }
};

const optionalAuth = async (request, response, next) => {
  // console.log("entering optional auth, ", request.headers)
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];
      // console.log("token is:", token)

    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, "login-token");

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    // pass the user down to the endpoints here
    request.user = user;

    // pass down functionality to the endpoint
    next();
  } catch (error) {
    // console.log("no token found")
    next();
  }
};

const selfAuth = async (request, response, next) => {

  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];
    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, "login-token");
    
    // retrieve the user details of the logged in user
    const user = await decodedToken;

    // pass the user down to the endpoints here
    request.user = user;

    const { id } = request.params;

    if (user.userID !== id) {
      return response.status(400).json({
        error: new Error("Invalid request!"),
        message: "Don't have sufficient permissions to access this api",
      });
    }

    // pass down functionality to the endpoint
    next();
  } catch (error) {
    response.status(400).json({
      error: new Error("Invalid request!"),
      message: "Don't have sufficient permissions to access this api",
    });
  }
};

module.exports = {
  basicAuth,
  selfAuth,
  optionalAuth,
};
