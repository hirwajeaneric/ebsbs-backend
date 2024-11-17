"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateOTP = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Email
const sendEmail = (recipient, subject, body) => {
    const transporter = nodemailer_1.default.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const mailOptions = {
        from: `"EDSDS" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: subject,
        text: body
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        }
        else {
            console.log('Email sent:', info.response);
        }
    });
};
exports.sendEmail = sendEmail;
// Notification
// OTP
/**
 * Generate an OTP with a given validity period.
 * @returns an object containing the OTP and its expiry date
 */
const GenerateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiryDate = new Date(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiryDate };
};
exports.GenerateOTP = GenerateOTP;
