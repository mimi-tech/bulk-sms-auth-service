const jwt = require("jsonwebtoken");
const { response } = require("../helpers");
const { auth } = require("../services");


//creates a list of non restricted endpoints
const nonRestrictedEndPoints = [
"/", 
"/create-users-account",
"/login",
"/validate-user-token",

"/update-password",

];

//creates list of authorized endpoints
const restrictedEndPoints = [
  "/update-phone-number",
  "/delete-user-by-id",
  "/get-all-users",
  "/get-user-by-id",
  "/update-user-data-by-id",
  "/update-email-address",
  "/update-message-count",
  "/update-wallet",
  "/send-bulk-message",
  "/transfer-fund",
  "/update-wallet-for-sms",
]




module.exports = async (req, res, next) => {

  //forwards request without validation if is not restricted
  if (nonRestrictedEndPoints.includes(req.path)) {


    next();
  } else if (restrictedEndPoints.includes(req.path)) {

   
    //validates request if is restricted
    const token = req.headers.authorization;

    const body = { token: token }

    const data = await auth.validateUserToken(body);

    if (data.status === false) {
      return response(res, { status: false, message: "Unauthorized Access" }, 401);
    }

    next();
  }

  else {
    const t = jwt.sign({}, process.env.SECRET)
    console.log(t);
    try {
      jwt.verify(req.headers["x-access-token"], process.env.SECRET);
    } catch (error) {
      return response(res, { status: false, message: "Unauthorized Access!  " }, 401);
    }

    next();
  }







};
