const express = require(`express`)
const app = express()
app.use(express.json())
const pemesananController = require(`../controllers/pemesanan.controller`)

app.get("/getAllPemesanan", pemesananController.getAllPemesanan)
app.post("/findPemesanan", pemesananController.findPemesanan)
app.post("/addPemesanan", pemesananController.addPemesanan)
app.put("/updatePemesanan/:id", pemesananController.updatePemesanan)
app.delete("/deletePemesanan/:id", pemesananController.deletePemesanan)
app.put("/updateStatusPemesanan/:id", pemesananController.updateStatusPemesanan);

module.exports = app