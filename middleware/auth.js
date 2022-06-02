import dotenv from 'dotenv';
dotenv.config({ path: "./config.env" })

export default {
    verifyToken: function(req, res, next) {
        try {
            const token = req.header("client-id");
            if (!token || token !== process.env.ACCESS_TOKEN) {
                return res.status(401).send("Access denied");
            }
            next();
        }
        catch (error) {
            res.status(400).send("Invalid token");
        }
    }
};