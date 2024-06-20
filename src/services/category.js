import db from "../models";

// GET CATEGORIES
export const getCategories = () =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.Category.findAll({
        raw: true,
        attributes: ["code", "value"],
      });
      resolve({
        err: response ? 1 : 0,
        msg: response ? "OK" : "Fail to get categories !",
        response: response,
      });
    } catch (error) {
      reject(error);
    }
  });
