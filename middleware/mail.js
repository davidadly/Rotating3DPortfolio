const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: config.mail.sender_email,
    pass: config.mail.sender_password,
  },
  secure: true,
});

const sendMail = (req, res) => {
  const { email, message, subject } = req.body;
  if (!email) return res.status(400).json({ msg: "Email is required" });
  if (email.length < 5 || email.indexOf("@") === -1)
    return res.status(400).json({ msg: "Email is invalid" });
  if (message.length < 5)
    return res.status(400).json({ msg: "messagEmaile is invalid" });

  transporter.sendMail(
    {
      from: config.mail.sender_email,
      to: config.mail.receiver_email,
      subject,
      html: `<h3>SENDER: ${email}</h3>
             <h3>Message:</h3>

            ${message}`,
    },
    function (err, info) {
      if (err) {
        console.error(err);
        return res.status(500).json({ msg: "Something went wrong" });
      } else return res.status(200).json({ msg: "successfully send the mail" });
    }
  );
};

module.exports = { sendMail };
