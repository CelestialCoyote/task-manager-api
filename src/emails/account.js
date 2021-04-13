//const sgMail = require('@sendgrid/mail');


//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'celestialcoyote.io',
    //     subject: 'Thanks for joining.',
    //     text: `Welcome to the app, ${name}.  Let me know how you get along with the app.`
    // });

    console.log({
        to: email,
        from: 'celestialcoyote.io',
        subject: 'Thanks for joining.',
        text: `Welcome to the app, ${name}.  Let me know how you get along with the app.`
    });
}

const sendDeleteAccountEmail = (email, name) => {
    console.log({
        to: email,
        from: 'celestialcoyote.io',
        subject: 'Thanks for playing.',
        text: `Sorry to see you go, ${name}.  Let me know why you quit the app.`
    });
}


module.exports = {
    sendWelcomeEmail,
    sendDeleteAccountEmail
}