
// Handles any invalid path requests
exports.handle404Errors = (req, res, next) => {
    res.status(404).send({ msg:"Path Not Found" })
}

// Handles psql errors
exports.handlePsqlErrors = ((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: "Bad Request"})
      }
    next(err)
  })

// Handles custom errors
exports.handleCustomErrors = ((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg })
      }
      next(err)
  })

// Handles server errors.
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "internal server error"})
};