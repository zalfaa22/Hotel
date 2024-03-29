const { request, response } = require("express");
const modelUser = require("../models/index").user;
const Op = require("sequelize").Op;
const  path  = require("path");
const upload = require(`./upload-user`).single(`foto`);
const fs = require(`fs`);
const md5 = require(`md5`);

const jsonwebtoken = require("jsonwebtoken")
const SECRET_KEY = "secretcode"

exports.login = async (request,response) => {
  try {
      const params = {
          email: request.body.email,
          password: md5(request.body.password),
      };

      const findUser = await modelUser.findOne({ where: params});
      if (findUser == null) {
          return response.status(404).json({
              message: "email or password doesn't match",
              err: error,
          });
      }
      console.log(findUser)
      //generate jwt token
      let tokenPayLoad = {
          id: findUser.id,
          email: findUser.email,
          role: findUser.role,
      };
      tokenPayLoad = JSON.stringify(tokenPayLoad);
      let token = await jsonwebtoken.sign(tokenPayLoad,SECRET_KEY);

      return response.status(200).json({
          message: "Success login",
          data:{
              token: token,
              id: findUser.id,
              email: findUser.email,
              role: findUser.role,
          },
      });
  } catch (error){
      console.log(error);
      return response.status(500).json({
          message: "Internal error",
          err: error,
      });
  }
};

exports.getAllUser = async (request, response) => {
  let users = await modelUser.findAll();
  return response.json({
    success: true,
    data: users,
    message: `ini adalah semua data user`,
  });
};

exports.getAllReceptionists = async (request, response) => {
  try {
    let resepsionis = await modelUser.findAll({
      where: {
        role: 'resepsionis' // Ganti dengan nilai yang sesuai dengan role "resepsionis" dalam basis data Anda
      },
      order: [['createdAt', 'DESC']],
    });

    if (resepsionis.length === 0) {
      return response.json({
        success: true,
        data: [],
        message: `Tidak ada resepsionis yang ditemukan`,
      });
    }

    return response.json({
      success: true,
      data: resepsionis,
      message: `Ini adalah semua data resepsionis`,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: `Terjadi kesalahan dalam mengambil data resepsionis`,
    });
  }
};

exports.findUser = async (request, response) => {
  let keyword = request.body.keyword
  let users = await modelUser.findAll({
    where: {
      [Op.or]: [
        { nama_user: { [Op.substring]: keyword } },
        { email: { [Op.substring]: keyword } },
        { role: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: users,
    message: `berikut data yang anda minta yang mulia`,
  });
};

exports.addUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    if (!request.file) {
      return response.json({ message: `Nothing to Upload` });
    }

    let newUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };

    modelUser
      .create(newUser)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `User telah ditambahkan`,
        });
      })

      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateUser = async (request, response) => {
  upload(request, response, async (err) => {
    if (err) {
      return response.json({ message: err });
    }
    let id = request.params.id;
    let dataUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };
    console.log(dataUser);

    if (request.file) {
      const selectedUser = await modelUser.findOne({
        where: { id: id },
      });
      const oldFotoUser = selectedUser.foto;

      const pathImage = path.join(__dirname, `/../foto`, oldFotoUser);
      if (fs.existsSync(pathImage)) {
        fs.unlink(pathImage, (error) => console.log(error));
      }
      dataUser.foto = request.file.filename;
    }
    modelUser
      .update(dataUser, { where: { id: id } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data user has been updated`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.deleteUser = (request, response) => {
  let idUser = request.params.id;
  modelUser
    .destroy({ where: { id: idUser } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data user has been delete`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
