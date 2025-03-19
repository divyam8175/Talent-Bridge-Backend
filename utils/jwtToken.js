export const sendToken = (user, statusCode, res, message) => {
    const token = user.getJWTToken()
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies only in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax" // or "Strict" based on your needs
    };
    
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        user,
        message,
        token
    })
}