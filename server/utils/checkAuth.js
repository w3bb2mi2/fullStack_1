import jwt from "jsonwebtoken"

export default (req, res, next)=>{
    const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""   );
    console.log("token: ", token)
    if(token){
        try {
            const decoded = jwt.verify(token, "secretKey")
            req.userId = decoded._id
            console.log("req.userId: ", req.userId)
            next()
        } catch (error) {
            console.log(error)
            return res.status(403).json({
                message:"Нет доступа"
            })
        }
    }else{
        return res.status(403).json({
            message: "Нет доступа"
        });
    }
    //res.send(token)
    
}