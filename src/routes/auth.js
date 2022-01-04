const { Router } = require("express");
const { auth } = require("../controllers");
const { validate } = require("../middlewares");
const { auth: validator } = require("../validator");

const routes = Router();

routes.get("/", auth.welcomeText);

routes.post("/create-users-account",validate(validator.userRegistration), auth.userRegistration);

routes.post("/login",validate(validator.generalLogin), auth.generalLogin);

routes.post("/validate-user-token", validate(validator.validateUserToken),auth.validateUserToken);


routes.get("/get-all-users", validate(validator.getAllUsers), auth.getAllUsers);

routes.get("/get-user-by-id",validate(validator.getAUser),auth.getAUser);

routes.put("/update-user-data-by-id",validate(validator.updateUserData),auth.updateUserData);

routes.delete("/delete-user-by-id",validate(validator.deleteAUser),auth.deleteAUser);


routes.put("/update-password",validate(validator.updatePassword), auth.updatePassword);


routes.put("/update-phone-number",validate(validator.updatePhoneNumber), auth.updatePhoneNumber);

routes.put("/update-email-address",validate(validator.updateEmailAddress), auth.updateEmailAddress);

routes.put("/update-message-count",validate(validator.updateMessagesCount), auth.updateMessagesCount);

routes.put("/update-wallet",validate(validator.updateWallet), auth.updateWallet);

routes.post("/send-bulk-message",validate(validator.sendBulkMessage), auth.sendBulkMessage);


module.exports = routes; 
