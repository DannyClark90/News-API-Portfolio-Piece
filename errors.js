
// Handle Custom Errors.
exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({ msg: err.msg })
    }
    else {next(err)};
};

// handles any invalid path requests
exports.handle404Errors = (req, res, next) => {
    res.status(404).send({ msg:"Path Not Found" })
}; 