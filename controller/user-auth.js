const User = require('../models/user.js')
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config();
exports.signup = (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec(async (error, user) => {
        if (user)
            return res.status(400).json({
                message: 'user allready registed'
            });
        const {
            userId,
            name,
            email,
            password
        } = req.body;
        const hashpassword = await bcrypt.hash(password, 10);
        const _user = new User({
            userId,
            name,
            email,
            hashpassword,
            username: Math.random().toString(),
            role: 'user'
        });

        _user.save().then(() => {
            res.json("user added");
        }).catch((err) => {
            console.log(err);
        })


    });

}
//json({error}).
//signin
exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec((error, user) => {
        if (error) return res.status(400).json({ error });
        if (user) {
            console.log(req.body.email);
            console.log(req.body.password);
            //check pw and role
            if (user.authenticate(req.body.password)) {

                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SCRET,
                    {
                        expiresIn: '7d'
                    });
                const { _id, name, email, role } = user;
                res.status(200).json({
                    token,
                    user: {
                        _id, name, email, role
                    }
                });
            }
            //pw fail
            else {
                return res.status(400).json({
                    message: 'pw wrong'
                })
                //.json({error});
            }

        }
        else {
            return res.status(400).json({
                message: 'something wrong'
            });
        }
    });

};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        message: "Signout successfully...!",
    });
};
exports.getAllUsers = (req, res) => {
    User.find({}).exec((error, users) => {
        if (error) return res.status(400).json({ error });
        if (users) {
            
            return res.status(201).json({ users });
        }
    });
};

exports.getUserbyID=(req,res)=>{
    console.log('hey')
    const { name } = req.params._id;
    console.log("pro id", req.params._id)
    console.log(req.params._id);
        User.find({_id: req.params._id})
        .exec((error, users) => 
        {
            if (error) {
                return res.status(400).json({ error });
            }
            if (users) {
                
                console.log(users);
                res.status(200).send({ data: users });
            }
        });
        
    };
    exports.deleteByID = (req, res) => {
        const { userId } = req.params._id;
        console.log(req.params._id)
        if (req.params._id) {
            User.deleteOne({ _id: req.params._id }).exec((error, result) => {
            if (error) return res.status(400).json({ error });
            if (result) {
              res.status(202).json({ result });
            }
          });
        } else {
          res.status(400).json({ error: "Params required" });
        }
      };

      exports.updateuser = (req, res) => {
        const {
             name,email
        } = req.body;
        
        User.findByIdAndUpdate(req.params._id, { $set: { email: email, name: name} },
            { new: true })
            .catch((err) => {
                console.log(err);
            })
    }