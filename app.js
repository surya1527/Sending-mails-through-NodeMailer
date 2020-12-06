const express = require('express');
const bodyParser = require('body-Parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs({ defaultLayout: false }));
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req,res) => {
    const output = `
        <p>You have a new contact request</p>
        <h3>Contact Details</h3>
        <ul>
           <li>Name: ${req.body.name}</li>
           <li>Subject: ${req.body.Subject}</li>
           <li>Email: ${req.body.email}</li>
           <li>Phone: ${req.body.phone}</li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `;

    async function main() {
      // Generate test SMTP service account from ethereal.email
      // Only needed if you don't have a real mail account for testing
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "user@gmail.com", // generated ethereal user
          pass: "password", // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"user_name" <fromuser@gmail.com>', // sender address
        to: "touser@gmail.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    }

    main().catch(console.error);

      res.render('contact', {msg:'Email has been sent'});

});
app.listen(3000, () => console.log('Server started...'));
