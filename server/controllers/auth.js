import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
const nanoid = require("nanoid");

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAcessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Validate the user info
        if (!name) return res.status(400).send("Name is required");
        if (!password || password.length < 6) {
            return res.status(400).send("Password greater than 6 characters long is required");
        }
        let existingUser = await User.findOne({ email }).exec();
        if (existingUser) return res.status(400).send("Email already exists in system");
        
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Register the new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        })

        await user.save();
        
        return res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Please try again.");
    }
    
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Search db for user with the email and check password
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(400).send("User not found.");
        const exists = await comparePassword(password, user.password);
        if (!exists) return res.status(400).send("Incorrect password");
        // make signed json web token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "90d",
        });
        // return user and token to client, exclude hashed password
        user.password = undefined;
        //send jwt in cookie
        res.cookie("token", token, {
            httpOnly: true,
        });
        // send user as a json response
        res.json(user);

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Please try again.");
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ message: "Logout successful" });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Please try again.");
    }
};

export const currentUser = async (req, res) => {
    try {
        const user = await User.findById(req.auth._id).select("-password").exec();
        return res.json({ok: true});
    } catch (err) {
        console.log(err);
    }
};

// Sending Email using Amazon SES for password reset and other admin function
export const sendTestEmail = async (req, res) => {
    const params = {
        Source: process.env.EMAIL_FROM,
        Destination: {
            ToAddresses: ["user@gmail.com"],  //Field should be the email you want to send to, would be a users email such as "user@gmail.com" - replace as needed
        },
        ReplyToAddresses: [process.env.EMAIL_FROM],
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: `
                        <html>
                            <h1>Reset password link</h1>
                            <p>Please click the following link to reset your password</p>    
                        </html>
                    `,
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Reset Password",
            },
        },
    };

    const emailSent =  SES.sendEmail(params).promise();
    
    emailSent.then((data) => {
        res.json({ ok: true });
    }) .catch((err) => {
        console.log(err);
    });
};


export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const resetCode = nanoid(6).toUpperCase();
        const user = await User.findOneAndUpdate(
            { email },
            { passwordResetCode: resetCode }
        );
        if (!user) return res.status(400).send("User not registered");
        
        // Email
        const params = {
            Source: process.env.EMAIL_FROM,
            Destination: {
                ToAddresses: [email]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: `
                            <html>
                                <h1>Reset password code</h1>
                                <p>Copy this code to reset your password for your account linked to this email</p>
                                <h2 style="color:red;">${resetCode}</h2>
                                <i>adaptive-elearning.com</i>
                            </html>
                        `
                    }
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: "Reset Password",
                },
            },

        };

        const emailSent = SES.sendEmail(params).promise();
        emailSent.then((data) => {
            res.json({ ok: true });
        }).catch((err) => {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
};

export const resettingPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const hashedPassword = await hashPassword(newPassword);
        const user = User.findOneAndUpdate(
            {
                email,
                passwordResetCode: code,
            }, {
                password: hashedPassword,
                passwordResetCode: "",
            }
        ).exec();

        res.json({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Please try again.");
    }
};