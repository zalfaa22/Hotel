const express = require(`express`)
const app = express()
app.use(express.json())
const tipekamarController = require(`../controllers/tipekamar.controller`)

app.get("/getAllTipekamar", tipekamarController.getAllTipekamar)
app.post("/findTipekamar", tipekamarController.findTipekamar)
app.post("/addTipekamar", tipekamarController.addTipekamar)
app.put("/updateTipekamar/:id", tipekamarController.updateTipekamar)
app.delete("/deleteTipekamar/:id", tipekamarController.deleteTipekamar);

module.exports = app