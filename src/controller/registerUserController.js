import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken"
import bcrypts from "bcrypts";

import UserModel from "../models/user.js"

import {config} from "../config.js"

const registerUserController = {};

registerUserController.register = async (req, res) => {
    const {name,lastName,email,password,phone,birthDate, picture,clodinaryPublicId,verificationCode,codeExpires,isVerified} = req.body;
    
    try{
        const existsUser = await UserModel.findOne
        ({email});
        if(existsUser){
            return res.status(400).json({message:"User already exits"});
        }
        const passwordHashed = await bcryptjs.hash(password, 10);

        const randomNumber = crypto.randomBytes(3).toString("hex");

        const token = jsonwebtoken.sign(
            {
                randomNumber,
                name,
                lastName,
                email,
                password: passwordHashed,
                phone,
                birthDate,
                picture,
                clodinaryPublicId,
                verificationCode,
                codeExpires,
                isVerified,
            },
            config.JwT.secret,
            {expiresIn: "15m"},
        );

        res.cookie("registrationCookie",token,{maxAge:15*60*1000});

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: config.email.user_email,
                to:email,
                subject: "Verificación de cuenta",
                text:
                "Para verificar tu cuenta, utiliza este código:" + randomNumber + "expira en 15 minutos",
            },

            transporter.sendMail(mailOptions, (error),info) = {
                if (error) {
                    console.log("error" + error);
                    return res.status(500).json({message: "Error sending email"});
                }
                return res.status(200).json({message: "Email sent"})
            });
        }catch (error){
            console.log ("error" + error);
            return res.status(500).json({message:"Internal server error"});
        }
    };
    

    registerUserController.verifyCode = async (req, res) => {
        try{
            const {verificationCodeRequest} = req.body;

            const token = req.cookies.registrationCookie;

            const decoded = jsonwebtoken.verify(token, config.JWT.secret);
            const{
                randomNumber: storedCode,
                name,
                lastName,
                email,
                password: passwordHashed,
                phone,
                birthDate,
                picture,
                clodinaryPublicId,
                verificationCode,
                codeExpires,
                isVerified,
            } = decoded;

            if (verificationCodeRequest !== storedCode) {
                return res.status (400).json ({message: "Invalid Code"});
            }

            const NewUser = new UserModel({
                name,
                lastName,
                email,
                password,
                phone,
                birthDate,
                picture,
                clodinaryPublicId,
                verificationCode,
                codeExpires,
                isVerified: true,
            });

            await NewUser.save();

            res.clearCookie("registrationCookie")
            return res.status (200).json({message:"Customer registered"})
        } catch (error) {
            console.log ("error" + error )
            return res.status (500).json({message:"Internal server error"})
        }
    };
    
export default registerUserController;