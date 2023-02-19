/* eslint-disable no-unreachable */
const { v4: uuid } = require("uuid");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    Op: { or, and },

} = require("sequelize");

const { constants } = require("../configs");
const { SendSmsUsers } = require("../models")
const { generalHelperFunctions } = require("../helpers")

const { SmsService } = require("../helpers/emailService");


  
/**
 * Display welcome text
 * @param {Object} params  no params.
 * @returns {Promise<Object>} Contains status, and returns message 
 */
const welcomeText = async () => {
    try {
        return {
            status: true,
            message: "welcome to church app authentication service",
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: constants.SERVER_ERROR("WELCOME TEXT"),
        };
    }
}


/**
 * login any in app user
 * @param {Object} params  contains email, password and accountTypes.
 * @returns {Promise<Object>} Contains status, and returns message 
 */
const generalLogin = async (params) => {
    try {
        const { email, password } = params;
        //check if user exit via user email.
        const userExist = await SendSmsUsers.findOne({ where: { email: email } })
        if (!userExist) {
            return {
                status: false,
                message: "incorrect credentials!",
            };
        }
        //extract and store existing encrypted user password
        const existingUserPassword = userExist.dataValues.password

        //validate incoming user password with existing password
        const isPasswordCorrect = await bcrypt.compare(password, existingUserPassword);


        if (!isPasswordCorrect) {
            return {
                status: false,
                message: "incorrect credentials",
            };
        }


        // eslint-disable-next-line no-unused-vars
        //const { password:epassword, emailCode,levelOneAccess,levelTwoAccess,levelThreeAccess, ...publicUserData } = userExist.dataValues;

        const publicUserData = await generalHelperFunctions.formatRegistrationResult(userExist.dataValues);


       

       

        const { email: _email, id } = publicUserData

        const serializeUserDetails = {  _email, id };

        const accessToken = jwt.sign(serializeUserDetails, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

       
   

        return {
            status: true,
            message: "succes",
            token: accessToken,
            data: publicUserData
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: constants.SERVER_ERROR("LOGIN"),
        };
    }
}


/**
 * validates user token 
 * @param {Object} params  contains email, password and roles.
 * @returns {Promise<Object>} Contains status, and returns message 
 */
const validateUserToken = async (params) => {
    try {
        const { token } = params;

        let loggedInUser;

        //verify jwt token
        const check = jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log(err);
                return {
                    status: false,
                };
            }

            loggedInUser = user;

            return {
                status: true,
            };

        })

        if (!check.status) {
            return {
                status: false,
                message: "Invalid Token",
            };
        }




        //fetch loggedinuser details
        const _user = await SendSmsUsers.findOne({ where: { email: loggedInUser._email } })


        const userDetails = await generalHelperFunctions.formatRegistrationResult( _user.dataValues);


        return {
            status: true,
            message: "succes",
            data: userDetails
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: constants.SERVER_ERROR("TOKEN VERIFICATION"),
        };
    }
}




/**
 * for creating account for a church admin
 * @param {Object} params email, password, username, profileImageUrl.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

const userRegistration = async (params) => {
    try {

        const { 
             email,
             password, 
             phoneNumber,
             fullName,
             
            
            
            } = params;

        
        //check if  account is already registered
        const ussrAccount = await SendSmsUsers.findOne({
            where: {
                email: email
            },
        });

        if (ussrAccount) {
            return {
                status: false,
                message: "account already exist",
            };

        }

        //check if phone number is already registered

        const phoneNumberInUse = await SendSmsUsers.findOne({
            where: {
                
                     phoneNumber: phoneNumber ,
                   
                 },
        });

        if (phoneNumberInUse) {
            return {
                status: false,
                message: "This phone number is in use already",
            };

        }

        //encrypt password 
        const hashedPassword = await bcrypt.hash(password, 10)
        

        //create account
        const newPersonalAccount = await SendSmsUsers.create({
            id: uuid(),
            email: email,
            password: hashedPassword,
            phoneNumber: phoneNumber,
            fullName: fullName,
            
              })

        
       

        //format registration details 
        const userDetails = await generalHelperFunctions.formatRegistrationResult( newPersonalAccount.dataValues);

        return {
            status: true,
            message: "Account created successfully",
            data: userDetails,
        };




    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: constants.SERVER_ERROR("CREATING USERS ACCOUNT"),
        };
    }
}



/**
 * for fetching all church members
 * @param {Object} params  No params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */
const getAllUsers = async (params) => {
    try {

        const { page } = params;

        const pageCount = 15;

        const allChurchUsers = await SendSmsUsers.findAll({


            attributes: {
                exclude: [
                    "createdAt",
                    "password",
                    
                ],
            },
            limit: pageCount,
            offset: pageCount * (page - 1),
        });


        return {
            status: true,
            data: allChurchUsers
        };
    } catch (e) {
        console.log(e);
        return {
            status: false,
            message: constants.SERVER_ERROR("ALL USERS"),
        };
    }
}



/**
 * for fetching a user 
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */


const getAUser = async (params) => {

    const { authId } = params
    try {
        const user = await SendSmsUsers.findOne({
            where: {
                id: authId
            }
        })

        if (!user) {
            return {
                status: false,
                message: "User not found"
            };
        }

        //format  details 
        const userDetails = await generalHelperFunctions.formatRegistrationResult( user.dataValues);

        return {
            status: true,
            data: userDetails
        };
    } catch (e) {
        console.log(e);
        return {
            status: false,
            message: constants.SERVER_ERROR("GETTING A USER"),
        };
    }
}


/**
 * for updating church account details
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

const updateUserData = async (params) => {
    try {
        const { 
            authId, 
            fullName,
            
            } = params

        //check if auth id exist
        const checkIfAccountExist = await SendSmsUsers.findOne({
            where: {
                id: authId
            }
        })

        if (!checkIfAccountExist) {
            return {
                status: false,
                message: "invalid auth Id"
            };
        }

    

        await SendSmsUsers.update({ 
                
            fullName: fullName,
            
        
        },
           
           
            {
                where: { id: authId }
            });


        return {
            status: true,
            message: "user's asccount updated successfully"
        };


    } catch (e) {
        console.log(e);
        return {
            status: false,
            message: constants.SERVER_ERROR("UPDATE USERS ACCOUNT"),
        };
    }
}







/**
 * for deleting an account either church admin or member using the users ID
 * @param {Object} params  user id {authId} params needed.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

const deleteAUser = async (params) => {
    try {
        const { authId } = params

        //check if the user is already existing
        const user = await SendSmsUsers.findOne({
            where: {
                id: authId

            }
        })

        if (!user) {
            return {
                status: false,
                message: "User does not exist"
            };
        }



        //go ahead and delete the account
        await SendSmsUsers.destroy({
            where: {
                id: authId
            }
        })

        return {
            status: true,
            message: "account deleted successfully"
        };
    } catch (e) {
        console.log(e);
        return {
            status: false,
            message: constants.SERVER_ERROR("DELETING CHURCH APP ACCOUNT"),
        };
    }
}






/**
 * Update churches members count endpoint
 * @param {Object} params auth and memberCount
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

 const updateMessagesCount= async (params) => {
    try {
        const {authId, recieversCountNumber} = params;

         //check if user is existing

         const getAUser = await SendSmsUsers.findOne({ 
            
                where: { id: authId }
            });
        


         if (!getAUser) {
             return {
                 status: false,
                 message: "No record found"
             };
         }

         //get the existing member count for this church
         let existingCount = 0;
         let count;
         existingCount = getAUser.dataValues.messageCount;
         count = existingCount + 1;

           //get the existing member count for this church
           let c = 0;
           let reciversCount;
           c = getAUser.dataValues.recievers;
           reciversCount = c + recieversCountNumber;

 //update users church joined


 await SendSmsUsers.update({ messageCount:count, recievers:reciversCount },
    {
        where: { id: authId }
    });

 

 


return {
    status: true,
    message: "count updated successfully",
};


    }catch (error) {
        console.log(error);
        return {
            status: false,
            message: constants.SERVER_ERROR("COUNT UPDATE"),
        };
 }
 }




/**
 * Update password endpoint
 * @param {Object} params email and password.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */
 const updatePassword = async (params) => {
    try {
        const { email, password } = params


        const getAUser = await SendSmsUsers.findOne({ 
            where: {
                email: email

            }
        })

        


        if (!getAUser) {
            return {
                status: false,
                message: "No record found"
            };
        }

         //encrypt password 
         const hashedPassword = await bcrypt.hash(password, 10)


        //update password
        await SendSmsUsers.update({ password: hashedPassword },
            {
                where: { email: email }
            });
               console.log(email)
            return {
                status: true,
                message: "Password updated successfully. You may now login",
            };


    } catch (e) {
        console.log(e);
        return {
            status: false,
            message: constants.SERVER_ERROR("UPDATE PASSWORD VERIFICATION ENDPOINT"),
        };
    }
}


/**
 * Update phone number endpoint
 * @param {Object} params email and phone number.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

const updatePhoneNumber = async (params) => {
    try {
        const {phoneNumber, authId} = params;

       
          //check if phone number exist in the database

          const isPhoneNumberExisting =  await SendSmsUsers.findOne({ 
            where: {
                phoneNumber: phoneNumber
            }, 
           })

           if (isPhoneNumberExisting) {
            return {
                status: false,
                message: "Phone number is existing."
            };
        }
       

        //update date users phone number
        await SendSmsUsers.update({ phoneNumber: phoneNumber },
            {
                where: { id: authId }
            });


        return {
            status: true,
            message: "Phone number updated successfully",
        };

    } catch (error) {
        
        return {
            status: false,
            message: constants.SERVER_ERROR("UPDATE PHONE NUMBER"),
        };

 }
}







/**
 * Update users email address
 * @param {Object} params email, authId.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

 const updateEmailAddress = async (params) => {
    try {
        const { authId, email } = params;

       
          //check if user exist in the database

          const isMemberExisting =  await SendSmsUsers.findOne({ 
            where: {
                 id: authId ,
            },

           })

           if (!isMemberExisting) {
            return {
                status: false,
                message: "Invalid user"
            };
        }


        //check if email already exist in the database

        const isEmailExisting =  await SendSmsUsers.findOne({ 
            where: {
                 email: email ,
            },

           })

           if (isEmailExisting) {
            return {
                status: false,
                message: "Email already exist"
            };
        }
        

       

            // If email address is not existing; update new email address in the database for this user
           await SendSmsUsers.update({ 
                email: email
            },
                {
                    where: { id: authId }
                });


        return {
            status: true,
            message: "Email updated successfully",
        };

    } catch (error) {
        
        return {
            status: false,
            message: constants.SERVER_ERROR("EMAIL ADDRESS"),
        };

 }

}



/**
 * Update phone number endpoint
 * @param {Object} params email and phone number.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

 const updateWallet = async (params) => {
    try {
        const {authId, amount} = params;

       
          //check if phone number exist in the database

          const user =  await SendSmsUsers.findOne({ 
            where: {
                id: authId
            }, 
           })

           if (!user) {
            return {
                status: false,
                message: "user is not existing."
            };
        }
          //getting the wallet balance
          let walletBalance;
          walletBalance = user.dataValues.wallet + amount;

        //update users wallet
        await SendSmsUsers.update({ wallet: walletBalance },
            {
                where: { id: authId }
            });


        return {
            status: true,
            message: "wallet updated successfully",
        };

    } catch (error) {
        
        return {
            status: false,
            message: constants.SERVER_ERROR("UPDATE WALLET"),
        };

 }
}



/**
 * Update phone number endpoint
 * @param {Object} params email and phone number.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

 const updateWalletForSendSms = async (params) => {
    try {
        const {authId} = params;

       
          //check if phone number exist in the database

          const user =  await SendSmsUsers.findOne({ 
            where: {
                id: authId
            }, 
           })

           if (!user) {
            return {
                status: false,
                message: "user is not existing."
            };
        }
          //getting the wallet balance
          let walletBalance;
          walletBalance = user.dataValues.wallet - process.env.SMS_AMOUNT;

        //update users wallet
        await SendSmsUsers.update({ wallet: walletBalance },
            {
                where: { id: authId }
            });


        return {
            status: true,
            message: "wallet updated successfully",
        };

    } catch (error) {
        
        return {
            status: false,
            message: constants.SERVER_ERROR("UPDATE WALLET"),
        };

 }
}



/**
 * transfer funds endpoint
 * @param {Object} params senderAuthId, receiverAuthId, senderAmount, receiverAmount.
 * @returns {Promise<Object>} Contains status, and returns data and message 
 */

 const transferFund = async (params) => {
    try {
        const {senderAuthId, receiverEmail, amount} = params;

       
          //check if sender exist in the database

          const sender =  await SendSmsUsers.findOne({ 
            where: {
                id: senderAuthId
            }, 
           })

           if (!sender) {
            return {
                status: false,
                message: "sender user is not existing."
            };
        }
                    //check if receiver exist in the database

                    const receiver =  await SendSmsUsers.findOne({ 
                        where: {
                            email: receiverEmail
                        }, 
                    })

                    if (!receiver) {
                        return {
                            status: false,
                            message: "receiver is not existing."
                        };
                    }

                    //check if user has funds
                    if(sender.dataValues.wallet < amount){
                        return {
                            status: false,
                            message: "Insufficient balance",
                        };
                    }

          //getting the wallet balance of sender
          let senderWalletBalance;
          senderWalletBalance = sender.dataValues.wallet - amount;

        //update sender wallet
        await SendSmsUsers.update({ wallet: senderWalletBalance },
            {
                where: { id: senderAuthId }
            });

             //getting the wallet balance of receiver
          let receviersWalletBalance;
          receviersWalletBalance = receiver.dataValues.wallet + amount;


             //update receivers wallet
        await SendSmsUsers.update({ wallet: receviersWalletBalance },
            {
                where: { email: receiverEmail }
            });


        return {
            status: true,
            message: "Transfer went successfully",
        };

    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: constants.SERVER_ERROR("TRANSFER FUNDS"),
        };

 }
}


const sendBulkMessage = async (params) => {
    try {
        const {authId, from, phoneNumber, message } = params;

         //check if  account is already registered

         const user =  await SendSmsUsers.findOne({ 
            where: {
                id: authId
            }, 
           })
        
        if(!user) {
            return {
                status: false,
                message: "User does not exist",
            };

        }

        //check if account is not blocked

    

        if (user.dataValues.blocked === true) {
            return {
                status: false,
                message: "Sorry your account has been blocked",
            };

        }
 //encrypt message 

        //check if the user wallet is more than 1.3 for per sms
       
        if (user.dataValues.wallet >= process.env.SMS_AMOUNT) {
            //send sms here

            await SmsService.sendMesssageAPI({
                from: from,
                phoneNumber: phoneNumber,
                message:message
              });

       //minus 1.3 from the users wallet
       let newWallet = user.dataValues.wallet - process.env.SMS_AMOUNT;

       //update the users wallet
      const updateUsersWallet = await SendSmsUsers.update({ wallet: newWallet },
        {
            where: { id: authId }
        });


       if (!updateUsersWallet) {
        return {
            status: false,
            message: 'Sorry please try again',
        };
    }

       return {
        status: true,
        message: "sms sent successfully"
    };


        }
        return {
            status: false,
            message: "Sorry insufficient fund"
        };


       
    } catch (e) {
        console.log(e);
        return {
            status: false,
            message: constants.SERVER_ERROR("SENDING MESSAGE"),
        };
    }
}



module.exports = {
    welcomeText,
    generalLogin,
    userRegistration,
    validateUserToken,
    getAllUsers,
    getAUser,
    updateUserData,
    deleteAUser,
    updateMessagesCount,
   
    updatePassword,
   
    updatePhoneNumber,
    
    updateEmailAddress,
    updateWallet,
    sendBulkMessage,
    transferFund,
    updateWalletForSendSms
}