const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const projectRoutes = require('./routes/projectRoutes')

const app = express()

/* MIDDLEWARE */

app.use(cors())
app.use(express.json())

/* ROUTES */

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)

/* TEST ROUTE */

app.get('/', (req, res) => {
  res.send('API Running Successfully 🚀')
})

/* DATABASE CONNECTION */

mongoose.connect(process.env.MONGO_URI)
.then(() => {

  console.log('MongoDB Connected ✅')

  const PORT = process.env.PORT || 5000

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`)
  })

})
.catch(err => {

  console.log('MongoDB Connection Error ❌')
  console.log(err)

})