import db from "../models";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import moment from "moment";
// import chothuecanho from "../data/chothuematbang.json";
// import chothuematbang from "../data/chothuematbang.json";
// import nhachothue from "../data/nhachothue.json";
import chothuephongtro from "../data/chothuephongtro.json";
import generateCode from "../untils/generateCode";
import { where } from "sequelize";
require("dotenv").config();

const dataBody = chothuephongtro.body;

const hashPassword = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(12));

export const insertService = () =>
  new Promise(async (resolve, reject) => {
    try {
      dataBody.forEach(async (item) => {
        let postId = v4();
        let labelCode = generateCode(item?.header?.class?.classType);
        let attributeId = v4();
        let userId = v4();
        let overviewId = v4();
        let imagesId = v4();
        await db.Post.create({
          id: postId,
          title: item?.header?.title,
          star: item?.header?.star,
          labelCode,
          address: item?.header?.address,
          attributeId,
          categoryCode: "CTPT",
          description: JSON.stringify(item?.mainContent?.content),
          userId,
          overviewId,
          imagesId,
        });

        await db.Attribute.create({
          id: attributeId,
          price: item?.header?.attribute?.price,
          acreage: item?.header?.attribute?.acreage,
          published: item?.header?.attribute?.published,
          hashtag: item?.header?.attribute?.hashtag,
        });

        await db.Image.create({
          id: imagesId,
          image: JSON.stringify(item?.images),
        });

        await db.Label.findOrCreate({
          where: { code: labelCode },
          defaults: {
            code: labelCode,
            value: item?.header?.class?.classType,
          },
        });

        await db.Overview.create({
          id: overviewId,
          code: item?.overview?.content?.find((el) => el.name === "Mã tin:")
            ?.content,
          area: item?.overview?.content?.find((el) => el.name === "Khu vực")
            ?.content,
          type: item?.overview?.content?.find(
            (el) => el.name === "Loại tin rao:"
          )?.content,
          target: item?.overview?.content?.find(
            (el) => el.name === "Đối tượng thuê:"
          )?.content,
          bonus: item?.overview?.content?.find((el) => el.name === "Gói tin:")
            ?.content,
          expired: moment(
            item?.overview?.content
              ?.find((el) => el.name === "Ngày hết hạn:")
              ?.content.split(",")[1],
            "HH:mm DD/MM/YYYY"
          ).format("YYYY-MM-DD HH:mm:ss"),
          created: moment(
            item?.overview?.content
              ?.find((el) => el.name === "Ngày đăng:")
              ?.content.split(",")[1],
            "HH:mm DD/MM/YYYY"
          ).format("YYYY-MM-DD HH:mm:ss"),
          //   created: item?.overview?.content?.find(
          //     (el) => el.name === "Ngày đăng:"
          //   )?.content,
        });

        await db.User.create({
          id: userId,
          name: item?.contact?.content?.find((el) => el.name === "Liên hệ:")
            ?.content,
          password: hashPassword("123456"),
          phone: item?.contact?.content?.find((el) => el.name === "Điện thoại:")
            ?.content,
          zalo: item?.contact?.content?.find((el) => el.name === "Zalo")
            ?.content,
          avatar: null,
        });
      });

      resolve("Done...");
    } catch (error) {
      reject(error);
    }
  });
