const { auth } = require("../services");
const { response } = require("../helpers");



const welcomeText = async (req, res) => {
    const data = await auth.welcomeText(req.form);
    return response(res, data);
  };

  const userRegistration = async (req, res) => {
    const data = await auth.userRegistration(req.form);
    return response(res, data);
  };

  const generalLogin = async (req, res) => {
    const data = await auth.generalLogin(req.form);
    return response(res, data);
  };

  
  const validateUserToken = async (req, res) => {
    const data = await auth.validateUserToken(req.form);
    return response(res, data);
  };


  const getAllUsers = async (req, res) => {
    const data = await auth.getAllUsers(req.form);
    return response(res, data);
  };

  const getAUser = async (req, res) => {
    const data = await auth.getAUser(req.form);
    return response(res, data);
  };

  const updateUserData = async (req, res) => {
    const data = await auth.updateUserData(req.form);
    return response(res, data);
  };

 

  const deleteAUser = async (req, res) => {
    const data = await auth.deleteAUser(req.form);
    return response(res, data);
  };

 
  const updatePassword = async (req, res) => {
    const data = await auth.updatePassword(req.form);
    return response(res, data);
  };


  const updatePhoneNumber= async (req, res) => {
    const data = await auth.updatePhoneNumber(req.form);
    return response(res, data);
  };


  const updateEmailAddress= async (req, res) => {
    const data = await auth.updateEmailAddress(req.form);
    return response(res, data);
  };

  const updateMessagesCount= async (req, res) => {
    const data = await auth.updateMessagesCount(req.form);
    return response(res, data);
  };
  
  const updateWallet= async (req, res) => {
    const data = await auth.updateWallet(req.form);
    return response(res, data);
  };

const sendBulkMessage= async (req, res) => {
    const data = await auth.sendBulkMessage(req.form);
    return response(res, data);
  };

  const transferFund= async (req, res) => {
    const data = await auth.transferFund(req.form);
    return response(res, data);
  };
   const updateWalletForSendSms= async (req, res) => {
    const data = await auth.updateWalletForSendSms(req.form);
    return response(res, data);
  };

  



  module.exports = {
    welcomeText,
    generalLogin,
    validateUserToken,
    userRegistration,
    getAUser,
    getAllUsers,
    updateUserData,
    deleteAUser,
    updateEmailAddress,
    updateMessagesCount,
    updatePassword,
    
    updatePhoneNumber,
    updateWallet,
    sendBulkMessage,
    transferFund,
    updateWalletForSendSms
    
}