const Express = require('express')
const router = Express.Router()
const db = require('../db')
const pgp = db.$config.pgp

router.get('/', (req, res) => {
  let q = req.query
  console.log(q)
  let where = ''
  let s = []

  if (Object.keys(q).length !== 0) {
    console.log(q[0])
    for (let x in q) {
      s.push(pgp.as.format(`${x} IN ($(${x}:csv))`, q))
    }
    where = s.reduce((prev, curr) => prev + ' AND ' + curr)
  } else {
    where = true
  }

  db.animals.all(where)
  .then(data => res.status(200).json({ success: true, data: data }))
  .catch(err => res.status(400).json({ success: false, error: err }))
})

router.get('/:perm_id', (req, res) => {
  db.animals.show(req.params)
  .then(data => res.status(200).json({ success: true, data: data }))
  .catch(err => res.status(400).json({ success: false, error: err }))
})

router.post('/', (req, res) => {
  // TODO: data validation for aniamls post
  db.animals.post(req.body)
  .then(data => res.status(201).json({ success: true, data: data }))
  .catch(err => res.status(400).json({ success: false, error: err }))
})

router.delete('/:perm_id', (req, res) => {
  // TODO: should also delete the deployment
  db.captures.delete(req.params)
  .then(() => res.status(200).json({ success: true }))
  .catch(err => res.status(400).json({ success: false, error: err }))
})

// TODO: edit route

module.exports = router
