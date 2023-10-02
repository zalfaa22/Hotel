const express = require("express")
const app = express()
const PORT = 8080
const cors = require(`cors`)
const bodyParser = require('body-parser')
const md5 = require(`md5`)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))

const userRoute = require("./routes/user.route")
const tipekamarRoute = require("./routes/tipekamar.route")
const kamarRoute = require("./routes/kamar.route")
const pemesananRoute = require("./routes/pemesanan.route")
const customerRoute = require("./routes/customer.route")

app.use("/user", userRoute)
app.use("/tipekamar", tipekamarRoute)
app.use("/kamar", kamarRoute)
app.use("/pemesanan", pemesananRoute)
app.use("/customer", customerRoute)

app.listen(PORT, () => {
    console.log(`Server of Hotel runs on port ${PORT}`)
    })