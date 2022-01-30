const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErros = require('../middleware/catchAsyncErrors')
const User = require("../schemas/userModel")
const sendToken = require("../utils/sendToken")
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')


exports.registerUser = catchAsyncErros(async (req,res,next)=>{
    let avatar= req.body.avatar
if(req.body.avatar){
        const mycloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:'UserAvatars',
        width:300,
        crop:"scale"
    })
     avatar={
        public_id:mycloud.public_id,
        url:mycloud.secure_url
    }
}
    const {name , email, password,mobileNo} = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar,
        mobileNo
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

    if(!user) return next(new ErrorHandler("No user is registered with this E-mail",404))

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave:false})

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    try{
        await sendEmail({
            email:user.email,
            subject:`Grizara Password Recovery`,
            message :`Hey ${user.name}, \n`+process.env.FORGOT_PASS_MSG+`\n ${resetPasswordUrl}. \n\n`
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


//GET User details

exports.getUserDetails = catchAsyncErros(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    })
})

//Password change feature

exports.updatePassword = catchAsyncErros(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password')

    const isPassWordMatched = await user.comparePassword(req.body.oldPassword)

    if(!isPassWordMatched){
        return next(new ErrorHandler("Your current Password is incorrent",400));
            }

    if(req.body.newPassword!==req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    }
    user.password= req.body.newPassword;
    await user.save()
    sendToken(user,200,res)
    
})


// Update Profile
exports.updateProfile = catchAsyncErros(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        mobileNo:req.body.mobileNo,
            }
            
            if (req.body.avatar !== ""&&req.body.avatar!=='undefined') {
                const user = await User.findById(req.user.id);
            
                const imageId = user.avatar.public_id;
                if(imageId){
                    await cloudinary.v2.uploader.destroy(imageId);
                }
               
                const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
                  folder: "UserAvatars",
                  width: 300,
                  crop: "scale",
                });
            
                newUserData.avatar = {
                  public_id: myCloud.public_id,
                  url: myCloud.secure_url,
                };
              }
            
              const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
                new: true,
                runValidators: true,
                useFindAndModify: false,
              });

    await user.save()
    res.status(200).json({
        success:true,
        message:"Profile updated successfully"
    })
})

//Get all users -admin
exports.getAllUser = catchAsyncErros(async(req,res,next)=>{
    const users = await  User.find();
    res.status(200).json({
        success:true,
        users
    })
})
//Get a user by ID
exports.getSingleUser = catchAsyncErros(async(req,res,next)=>{
    const user = await  User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with this ID : ${req.params.id}`))
    }
    
    res.status(200).json({
        success:true,
        user
    })
})

//Update User Role -admin
exports.updateUserRole = catchAsyncErros(async(req,res,next)=>{
    
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
 
    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    await user.save()
    res.status(200).json({
        success:true,
        message:"User updated Successfully."
    })
})

// Delete User -admin
exports.deleteUser = catchAsyncErros(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User does not exist with this ID : ${req.params.id}`))
    }
    await user.remove()
    res.status(200).json({
        success:true,
        message:"User Deleted Succesfully."
    })
})
