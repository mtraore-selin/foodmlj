import { config } from "dotenv";
import express from "express";
import expressAsyncHandler from "express-async-handler";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import Order from "../models/order.js";
import { emailTemplate, isAuth } from "../utlis.js";

config();

const orderRouter = express.Router();

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, EMAIL, FROM, REDIRECT_URI } =
  process.env;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

orderRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id });
    res.send(orders);
  })
);
orderRouter.get(
  "/admin-orders",
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ _id: -1 }).limit(20);
    res.send(orders);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "cart is empty!" });
    } else {
      const accessToken = oAuth2Client.getAccessToken();
      const newOrder = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        totalprice: req.body.totalprice,
        shippingPrice: req.body.shippingPrice,
        paymentId: req.body.paymentId,
        userId: req.user._id,
        email: req.body.email,
        userName: req.body.userName,
      });

      const order = await newOrder.save();

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: EMAIL,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: FROM, // sender address
        to: order.email, // list of receivers
        subject: "Order placed Successfuly🎉",
        text: "Hello world?", // Subject line
        html: emailTemplate(order), // html body
      });

      res.status(201).send({ message: "Order Placed !", order: order });
    }
  })
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default orderRouter;
