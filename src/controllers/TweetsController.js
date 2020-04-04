const TwitterConfig = require('../config/TwitterConfig');
const Pick = require('../utils/pick');
const ErrorResponse = require('../Domain/ErrorResponse');
const SuccessResponse = require('../Domain/SuccessResponse');

module.exports = {

    async index(req, res) {
        const { userName } = req.body;

        var params = {
            screen_name: userName,
            count: 10,
        }

        // listar os tweets do usuário
        await TwitterConfig.get('statuses/user_timeline', params, (error, data, response) => {
            if (!error) {
                var lista = data.map((tweet) => {
                    return {
                        id: tweet.id_str,
                        text: tweet.text,
                        userId: tweet.user.id_str,
                        name: tweet.user.name,
                        username: tweet.user.screen_name,
                        picture: tweet.user.profile_image_url,
                        likes: tweet.favorite_count,
                        rt: tweet.retweet_count
                    }
                })
                return res.json(lista);
            } else {
                console.log(error);
                res.json(new ErrorResponse(null, `Ocorreu um erro ao tentar listar os tweets do ${userName}`));
            }
        });
    },

    async getTweet(req, res) {
        const { id } = req.params;
        const myId = req.headers.authorization;

        //Informações do Tweet
        await TwitterConfig.get(`statuses/retweeters/ids`, { id }, async (error, data, response) => {
            if (!error) {
                var idSorteado = Pick.userId(data.ids);

                var liked = await module.exports.userLikedTweet(id, idSorteado, async (idDoLike) => {
                    if (idDoLike !== "" && idDoLike != undefined) {
                        var follows = await module.exports.userFollowsMe(myId, idSorteado, async (followsMe) => {
                            if (followsMe) {
                                var userSorteado = await module.exports.userInfo(idSorteado, async (response) => {
                                    res.json(response)
                                });
                            }
                            else {
                                res.json("Não me segue");
                            }
                        });
                    }
                    else {
                        res.json("Não deu like");
                    }
                });
            } else {
                console.log(error);
                res.json(new ErrorResponse('Ocorreu um erro ao obter os retweets'));
            }
        });
    },

    async getTweet2(req, res) {
        const { id } = req.params;
        const myId = req.headers.authorization;

        //Informações do Tweet
        await TwitterConfig.get(`statuses/retweeters/ids`, { id }, async (error, data, response) => {
            if (!error) {
                var idSorteado = Pick.userId(data.ids);
                var userSorteado = await module.exports.userInfo(idSorteado, async (response) => {
                    res.json(response)
                });
            } else {
                console.log(error);
                res.json(new ErrorResponse('Ocorreu um erro ao obter os retweets'));
            }
        });
    },

    async userLikedTweet(tweetId, userId, callback) {
        var params = {
            user_id: userId,
            count: 200,
        };

        await TwitterConfig.get(`favorites/list`, params, (error, data, response) => {
            if (!error) {
                var likes = data.map(d => {
                    return d.id_str;
                });
                callback(likes.find(l => l.toString() === tweetId.toString()));
            } else {
                console.log(error);
                return undefined;
            }
        });
    },

    async userFollowsMe(myId, userId, callback) {
        var params = {
            source_id: userId,
            target_id: myId,
        };

        await TwitterConfig.get(`friendships/show`, params, (error, data, response) => {
            if (!error) {
                callback(data.relationship.source.following);
            } else {
                console.log(error);
                return false;
            }
        });
    },

    async userInfo(userId, callback) {
        var params = {
            id: userId,
        };

        await TwitterConfig.get(`users/show`, params, (error, data, response) => {
            if (!error) {
                const user = {
                    name: data.name,
                    userName: data.screen_name,
                    picture: data.profile_image_url,
                }
                callback(user);
            } else {
                console.log(error);
                return undefined;
            }
        });
    }
}




                // deu o like
                //  var liked = await userLikedTweet(myId, idSorteado);
                // segue eu
                // var follows = await module.exports.userFollowsMe(myId, idSorteado);
                // //obtem info do user
                // if (follows) {
                //     var userSorteado = await module.exports.userInfo(idSorteado);
                //     return res.json(userSorteado);
                // }
                // else {
                //     return res.json("Faiô");
                // }