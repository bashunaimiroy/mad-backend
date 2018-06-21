const bcrypt = require('bcrypt')
require('dotenv').config();
const adminKey = process.env.ADMIN_KEY

module.exports = (req,res,next)=> {
	let userPass = req.headers.authorization
	console.log('received loggedin request', userPass)
	bcrypt.compare(userPass, adminKey, (err,success)=>{
		if (success){
			next()
		} else {
			res.status(401).json({approved:false})
		}
	})
}