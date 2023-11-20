
// handles any invalid path requests
exports.handle404Errors = (req, res, next) => {
    res.status(404).send({ msg:"Path Not Found" })
}; 

// Handles server errors.
exports.handleServerErrors = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: "internal server error"})
};