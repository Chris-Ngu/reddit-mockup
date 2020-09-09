import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {

    //    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'th4tradfzbd3tmfy@ethereal.email',
            pass: 'Tsugk6NFqh3ctjxMmf'
        },
    });

    let info = await transporter.sendMail({
        from: '"Fred Foo" <foo@example.com>',
        to: to,
        subject: "Change password",
        html: html
    });

    console.log("Message Sent: %s", info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


}