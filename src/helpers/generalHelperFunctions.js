const between = (min, max)=>{
return Math.floor(
    Math.random() * (max - min) + min,
)
}


const generateEmailCode = ()=>{
    
const emailCode = between(100000, 200000);


 return emailCode;
}


const generatePhoneNumberCode = ()=>{
    
    const phoneNumberCode = between(100000, 200000);
    
    
     return phoneNumberCode;
    }







const formatRegistrationResult =  ( resultObject) => {

    let result;
   


            // eslint-disable-next-line no-unused-vars
            const { password,   ...publicUserData }  = resultObject;
            result = publicUserData

            
       
  

    return result;

}






module.exports = {
    generateEmailCode,
    formatRegistrationResult,
    generatePhoneNumberCode
}