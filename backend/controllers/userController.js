const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErros = require('../middleware/catchAsyncErrors')
const User = require("../schemas/userModel")
const sendToken = require("../utils/sendToken")
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

exports.registerUser = catchAsyncErros(async (req,res,next)=>{
    const {name , email, password} = req.body

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"sample_id",
            url:"url"
        }
    })
    
    sendToken(user,200,res)
})

// Login User

exports.loginUser = catchAsyncErros(async(req,res,next)=>{
    const{email,password} = req.body
    // checking if user has given email and password both
    if(!email||!password){
        return next(new ErrorHandler("Please Enter Email & Password",400))

    }
    const user = await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }
    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401))
    }

    //if matched
    sendToken(user,200,res)
})

// Logout Function
exports.logout = catchAsyncErros(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });

    res.status(200).json({
        success:true,
        message:"Succesfully Logged Out"
    })
})

// Forgot password function
exports.forgotPassword=catchAsyncErros(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user) return next(new ErrorHandler("There no user is registered with this E-mail",404))

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    try{
        await sendEmail({
            email:user.email,
            subject:`Grizara Password Recovery`,
            message :process.env.FORGOT_PASS_MSG+` ${resetPasswordUrl}. \n\n`
        })
        res.status(200).json({
            success: true,
            message: `Password reset link has been sent to ${user.email}.\nPlease check your inbox and spam also.`
        })

    }catch(err){
        user.resetPasswordToken = undefined
        resetPasswordExpire = undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(err.message,500))
    }
})
// Resetting the password
exports.resetPassword=catchAsyncErros(async(req,res,next)=>{
    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        if(!user) return next(new ErrorHandler("Invalid link or has been expired.",400))
    }

    if(req.body.password !== req.body.confirmPassword){

        return next(new ErrorHandler("Password does not match",404))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire =undefined

    await user.save()

    sendToken(user,200,res)

})