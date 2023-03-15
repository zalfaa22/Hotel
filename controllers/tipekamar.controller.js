const { request, response } = require("express")
const modelTipekamar = require("../models/index").tipe_kamar
const Op = require('sequelize').Op
const  path = require("path")
const upload = require(`./upload-tipekamar`).single(`foto`)
const fs = require(`fs`)
const md5 = require(`md5`)
const tipe_kamar = require("../models/tipe_kamar")


exports.getAllTipekamar = async (request, response) => {
    let tipe_kamars = await modelTipekamar.findAll()
    return response.json({
    success: true,
    data: tipe_kamars,
    message: `ini adalah semua data tipe kamar`
})
}
  
exports.findTipekamar = async (request, response) => {
    let nama_tipe_kamar = request.body.nama_tipe_kamar
    let harga = request.body.harga
    let tipe_kamars = await modelTipekamar.findAll({
        where: {
            [Op.and]: [
                { nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } },
                { harga: { [Op.substring]: harga } }
            ]
        }
    })
    return response.json({
        success: true,
        data: tipe_kamars,
        message: `berikut data yang anda minta yang mulia`
    })
}

exports.addTipekamar = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        
        if (!request.file) {
            return response.json({ message: `Nothing to Upload`
        })
    }
    
    let newTipekamar = {
        nama_tipe_kamar: request.body.nama_tipe_kamar,
        harga: request.body.harga,
        deskripsi: request.body.deskripsi,
        foto: request.file.filename
    };
    console.log("nama_tipe_kamar: "  +newTipekamar.nama_tipe_kamar);
    
    modelTipekamar.create(newTipekamar).then(result => {
        return response.json({
            success: true,
            data: result,
            message: `Tipe kamar telah ditambahkan`
            
        })
    })
    
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
})
}

exports.updateTipekamar = async (request, response) => {
    upload(request, response, async (err) => {
      if (err) {
        return response.json({ message: err });
      }
      let id = request.params.id;
      let dataTipekamar = {
        nama_tipe_kamar: request.body.nama_tipe_kamar,
        harga: request.body.harga,
        deskripsi: request.body.deskripsi,
        foto: request.file.filename
      };
      console.log(dataTipekamar);
  
      if (request.file) {
        const selectedTipekamar = await modelTipekamar.findOne({
          where: { id: id },
        });
        const oldFotoTipekamar = selectedTipekamar.foto;
  
        const pathImage = path.join(__dirname, `/../foto`, oldFotoTipekamar);
        if (fs.existsSync(pathImage)) {
          fs.unlink(pathImage, (error) => console.log(error));
        }
        dataTipekamar.foto = request.file.filename;
      }
      modelTipekamar
        .update(dataTipekamar, { where: { id: id } })
        .then((result) => {
          return response.json({
            success: true,
            message: `Data tipe kamar has been updated`,
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
  
  exports.deleteTipekamar = (request, response) => {
    let id_tipe_kamar = request.params.id;
    modelTipekamar
      .destroy({ where: { id: id_tipe_kamar } })
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