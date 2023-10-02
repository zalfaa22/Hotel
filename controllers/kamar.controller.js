const { request, response } = require("express");
const kamarModel = require("../models/index").kamar;
const tipe_kamarModel = require("../models/index").tipe_kamar;
const Op = require("sequelize").Op;
const Sequelize = require("sequelize");
const sequelize = new Sequelize("hotelnew", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

exports.getAllKamar = async (request, response) => {
  let kamars = await kamarModel.findAll({
  include: {
    model: tipe_kamarModel,
    attributes: ['nama_tipe_kamar']
  }
});
  return response.json({
    success: true,
    data: kamars,
    message: "All rooms have been loaded",
  });
};

exports.findKamar = async (request, response) => {
  let keyword = request.body.keyword
  let kamars = await kamarModel.findAll({
    where: {
      [Op.or]: [
        { nomor_kamar: { [Op.substring]: keyword } },
        // { nama_tipe_kamar: { [Op.substring]: keyword } },
      ],
    },
  });
  return response.json({
    success: true,
    data: kamars,
    message: "All rooms have been loaded",
  });
};

exports.addKamar = async (request, response) => {
  let newKamar = {
      nomor_kamar: request.body.nomor_kamar,
      tipeKamarId: request.body.tipeKamarId,
  }

  if (newKamar.nomor_kamar === '' || newKamar.tipeKamarId === '') {
      return response.json({
          success: false,
          message: 'Semua data harus diisi'
      })
  }

  // Cek apakah nomor kamar sudah ada di database
  let existingKamar = await kamarModel.findOne({
      where: {
          nomor_kamar: newKamar.nomor_kamar,
      },
  })

  if (existingKamar) {
      return response.json({
          success: false,
          message: 'Nomor kamar sudah digunakan'
      })
  }

  let tipe_kamar = await tipe_kamarModel.findOne({
      where: {
          id: newKamar.tipeKamarId,
      },
  })

  if (!tipe_kamar) {
      return response.json({
          success: false,
          message: "Room types doesn't exist"
      })
  }

  kamarModel.create(newKamar).then((result) => {
      return response.json({
          success: true,
          data: result,
          message: `kamar telah ditambahkan`
      })
  }).catch(error => {
      return response.json({
          success: false,
          message: error.message
      })
  })
}

exports.updateKamar = async (request, response) => {
  let id = request.params.id;
  let dataKamar = {
    nomor_kamar: request.body.nomor_kamar,
    tipeKamarId: request.body.tipeKamarId,
  };
  console.log(dataKamar);
  kamarModel
    .update(dataKamar, { where: { id: id } })
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
};

exports.deleteKamar = (request, response) => {
  let id = request.params.id;
  kamarModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data room has been updated`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.availableRoom = async (request, response) => {
  const tgl_check_in = request.body.tgl_check_in;
  const tgl_check_out = request.body.tgl_check_out;

  const result = await sequelize.query(
    `SELECT tipe_kamars.nama_tipe_kamar, tipe_kamars.foto, tipe_kamars.harga, kamars.nomor_kamar, tipe_kamars.deskripsi FROM kamars LEFT JOIN tipe_kamars ON kamars.tipeKamarId = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.kamarId = kamars.id WHERE kamars.id NOT IN (SELECT kamarId from detail_pemesanans WHERE tgl_akses BETWEEN '${tgl_check_in}' AND '${tgl_check_out}') GROUP BY kamars.nomor_kamar`
  );

  return response.json({
    success: true,
    sisa_kamar: result[0].length,
    data: result[0],
    message: `Room have been loaded`,
  });
};
