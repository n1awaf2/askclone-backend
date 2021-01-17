const tokenSender = async(res, payload) => {
const accessToken = res.get("access-token");
const refreshToken = res.get("refresh-token");
    const tokens = {
        accessToken,
        refreshToken
    }
    res.status(200).json({
        message: 'Succeed',
        tokens,
        payload
    })
}

module.exports = tokenSender