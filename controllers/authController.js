const jwt= require('jsonwebtoken');
const bcrypt =require('bcryptjs');
const db = require('../models/db');
exports.login =(req,res) => {
    try {
        const { email,password} = req.body;

    if(!email || !password){
        res.status(401).json({message:"Email And password Required"});
    }
    db.query('select * From users where email =?',[email],async(err,results)=>{
        if(err) return res.status(500).json({error:err});
        if(!results.length) return res.status(401).json({message:"Invelid Credentatial"});
        const isMatch =await bcrypt.compare(password,results[0].password);

        if(!isMatch) return res.status(401).json({message:"Invelid Credentatial"});
        const token=jwt.sign({id:results[0].id},process.env.JWT_SECRET,{expiresIn:'1h'});
        res.json({token});
    });
} catch(error) {
    console.error("Unexpected Error:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}