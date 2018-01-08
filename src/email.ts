import * as nodemailer from 'nodemailer';
import * as _ from 'lodash';
import config from './config';

let { emial: { host, port, user, pass } } = config;

export interface mailOptions {
    target: string;
    subject: string;
    html: string;
}

/**
 * 发送邮件类
 */
class Email {

    static transporter = null;

    constructor() {
        if (!Email.transporter) {
            Email.transporter = nodemailer.createTransport({
                host,
                secureConnection: true, // use SSL
                port,
                secure: true, // secure:true for port 465, secure:false for port 587
                auth: {
                    user,
                    // QQ邮箱需要使用授权码
                    pass
                }
            })
        }
    }

    sendMail(options: mailOptions) {

        let defaultOptions = {
            from: user,
            to: options.target,
            subject: options.subject,
            html: options.html
        };

        Email.transporter.sendMail(defaultOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

export default Email;