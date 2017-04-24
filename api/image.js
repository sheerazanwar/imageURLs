var img = require('../models/image.js');

exports.getAll = function (req, res) {
    img
        .find({})
        .exec(function (error, images) {
            if (error) {
                res
                    .status(500)
                    .send({message: error});
            } else {
                res
                    .status(200)
                    .send(images);
            }
        })
}

exports.add = function (req, res) {
    if (req.body.appName == undefined || req.body.imgUrl == undefined) {
        res
            .status(404)
            .send({message: 'one or more perameters missing'});
    } else {
        var arr = JSON.parse(req.body.imgUrl);
        var promiseArray = [];
        arr.forEach(function (element) {
            promiseArray.push(new Promise(function (resolve, reject) {
                new img({appName: req.body.appName, imgUrl: element})
                    .save(function (err, user) {
                        if (err) {
                            reject({message: 'image URL already exists'})
                      } else {
                          resolve(user);
                        }
                    });

            }))
        });
 
        Promise.all(promiseArray)
        .then(function(result){
            res.send(result);
        })
        .catch(err=> res.status(500).send({err:err}));

    }
}

exports.getAppImages = function (req, res) {
    img
        .find({'appName': req.params.appName})
        .exec(function (error, images) {
            if (error) {
                res
                    .status(500)
                    .send({message: error});
            } else {
                if (images.length == 0) {
                    res
                        .status(200)
                        .send({message: 'app images not fount'});
                } else {
                    res
                        .status(200)
                        .send(images);
                }
            }
        })
}