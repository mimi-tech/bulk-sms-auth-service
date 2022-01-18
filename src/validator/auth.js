const Joi = require("joi");

module.exports = {
  generalLogin: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  userRegistration: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    fullName: Joi.string(),
    phoneNumber: Joi.string().required(),
   
  },


  

  getAUser:{
    authId: Joi.string().uuid().required(),
  },


  getAllUsers:{
    page: Joi.number().required(),
  },

  

 

  updateUserData:{
    authId: Joi.string().uuid().required(),
   fullName: Joi.string().required(),
    
    
   
  },


  
  deleteAUser:{
    authId: Joi.string().uuid().required(),
  },
  
  validateUserToken: {
    token: Joi.string().required(),
  },

  

  

  updatePassword: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },

  
  updatePhoneNumber: { 
    phoneNumber: Joi.string().required(),
    authId: Joi.string().uuid().required(),
  },



  updateMessagesCount:{
    authId: Joi.string().uuid().required(),
    recieversCountNumber: Joi.number().required(),
  },

  

  
  updateEmailAddress:{
    email: Joi.string().required(),
    authId: Joi.string().uuid().required(),

  },

  updateWallet:{
    amount: Joi.number().required(),
    authId: Joi.string().uuid().required(),

  },

  sendBulkMessage: {
    authId: Joi.string().uuid().required(),
    from: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    message: Joi.string().required(),
   
  },
  
  transferFund: {
    senderAuthId: Joi.string().uuid().required(),
    receiverEmail: Joi.string().required(),
    amount: Joi.number().required(),
   
  },
}