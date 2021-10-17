const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        maxlength:[30,"Character lenght exceeded"],
        minlength:[3,"Name should not be less than 3 characters."]
    },
    email: {
        type: String,
        required: [true, "Please Enter your e-mail"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid e-mail address."]

    },
    password: {
        type: String,
        required: [true, "Please Enter your Password"],
        minlength:[8,"Your password must be greater than 8 characters."]

    },
    avatar: {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }    
    },
    role:{
        type: String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,

})


//encrypting user's password before saving it into mongoDB
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})


//JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE 
    })
} 


// comparing passwords
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)

}


//Generating Password reset Token
userSchema.methods.getResetPasswordToken = function(){
    //generating token
    const resetToken = crypto.randomBytes(20).toString("hex")

    //Hashing and adding resetPasswordToken to userSchema

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now()+15*60*1000
    return resetToken
}

module.exports = mongoose.model("user",userSchema)