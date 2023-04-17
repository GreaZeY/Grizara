//creating token and saving it in cookie
const sendToken = (user,statusCode,res)=>{

    const token = user.getJWTToken()

    //options for cookie
    const options = {
        expires:new Date(
            Date.now()+process.env.COOKIE_EXPIRE *24*60*60*1000
        ),
        httpOnly:true,
    }
    let cUser = user._doc
    delete cUser.password
    
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user:cUser,
        token
    })
}

module.exports = sendToken