const signToken = (id,email,role)=>{
    return jwt.sign({id,email,role},process.env.JWT_SECRET,{expiresIn:'1h'});
}

const verifyToken = (token)=>{
    return jwt.verify(token,process.env.JWT_SECRET);
}

module.exports = {signToken,verifyToken};