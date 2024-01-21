import nodemailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

const EMAIL_ME = "mtra0201@gmail.com";
const FROM_ME = "momogafou85@gmail.com";
const CLIENT_ID_ME =
  "716912508597-gqpqkmtqq0lp9f6nl4r94h5hndi0ikon.apps.googleusercontent.com";
const CLIENT_SECRET_ME = "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";

const REFRESH_TOKEN_ME =
  "1//04fcLnnlvbnrQCgYIARAAGAQSNwF-L9IrLpGF3NQKfqbxTRUAxixZ3Cm_l2LHuXzJ3J-1o7bjSFUl8waKIqrLSneNCO1NOhT9txY";

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    CLIENT_ID_ME,
    CLIENT_SECRET_ME,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN_ME,
  });

  const accessToken = await oauth2Client.getAccessToken();

  //   const accessToken = await new Promise((resolve, reject) => {
  //     oauth2Client.getAccessToken((err, token) => {
  //       if (err) {
  //         console.error(err);
  //         reject("Failed to create access token :(");
  //       }
  //       resolve(token);
  //     });
  //   });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_ME,
      accessToken,
      clientId: CLIENT_ID_ME,
      clientSecret: CLIENT_SECRET_ME,
      refreshToken: REFRESH_TOKEN_ME,
    },
    // tls: {
    //   rejectUnauthorized: true,
    // },
  });

  return transporter;
};

const sendEmail = async (emailOptions) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

try {
  await sendEmail({
    subject: "Test",
    text: "I am sending an email from nodemailer!",
    to: "momogafou85@gmail.com",
    from: FROM_ME,
  });
} catch (error) {
  console.log(error);
}
