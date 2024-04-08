import db from "../models";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { raw } from "mysql2";
import { v4 } from "uuid";
require("dotenv").config();

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

export const registerService = ({ name, phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        // response sẽ nhận 1 mảng 2 phần tử. phần tử đầu trả về true || false, phần tử 2 trả về DL
        where: { phone },
        defaults: {
          phone,
          name,
          password: hashPassword(password),
          id: v4(),
        },
      });

      const token =
        response[1] &&
        jwt.sign(
          { id: response[0].id, phone: response[0].phone },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );

      resolve({
        err: token ? 0 : 2,
        msg: token
          ? "Register is successfully !"
          : "This phone number already exists !",
        token: token || null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const loginService = ({ phone, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOne({
        // response sẽ nhận DL khi where true và null khi where false
        where: { phone },
        raw: true,
      });

      const isCorrectPassword =
        response && bcrypt.compareSync(password, response.password);

      const token =
        isCorrectPassword &&
        jwt.sign(
          { id: response.id, phone: response.phone },
          process.env.SECRET_KEY,
          { expiresIn: "2d" }
        );

      resolve({
        err: token ? 0 : 2,
        msg: token
          ? "Login is successfully !"
          : response
          ? "Incorrect password !"
          : "This phone number not found !",
        token: token || null,
        // response,
      });
    } catch (error) {
      reject(error);
    }
  });
