const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.use(express.static('app/public'))

const indexRouter = require('./app/routes/index')
const homeRouter = require('./app/routes/home')
const editUserRouter = require('./app/routes/editUser')
const viewTableRouter = require('./app/routes/viewTable')

app.use(indexRouter)
app.use('/home', homeRouter)
app.use('/home/editUser', editUserRouter)
app.use('/viewTable', viewTableRouter)

app.listen(3000, () => console.log('Ouvindo na porta 3000'))