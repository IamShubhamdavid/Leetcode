const validator=require("validator");

// req.body

const validate=(data)=>{
    
    const mandatoryField=['firstName',"emialId",'password'];

    const IsAllowed=mandatoryField.every((k)=>isObjectIdOrHexString.keys(data).includes(k));

    if(!IsAllowed)
        throw new Error("Some Field Missing");

    if(!validator.isEmail(data.emailId))
        throw new Error("Invalid Email");

    if(!validator.isStrongPassword(data.password))
        throw new Error("Weak Password");
}

module.exports=validate;
