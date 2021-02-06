const express = require("express");
const cors = require("cors");
const app = express();


require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use('/images', express.static('./images'))
//AUTH ROUTES
const registerRoute = require("./auth/routes/register");
const loginRoute = require("./auth/routes/login");
const forgotPasswordRoute = require("./auth/routes/forgotPassword");
const updatePasswordRoute = require("./auth/routes/updatePassword");
const verifyEmail = require("./auth/routes/verifyEmail");
///////////////////////////////////////////////////////////////////////////////
app.use("/auth/register", registerRoute);
app.use("/auth/login", loginRoute);
app.use("/auth/forgotpassword", forgotPasswordRoute);
app.use("/auth/updatepassword", updatePasswordRoute);
app.use("/auth/verifyemail", verifyEmail);
//END OD AUTH ROUTES

//QUESTION AND ANSWERS ROUTES
const askYourselfRoute = require('./questionsAndAnswers/routes/askYourself')
const askAnotherUserRoute = require('./questionsAndAnswers/routes/askAnotherUser')
const getQuestionsRoute = require('./questionsAndAnswers/routes/getQuestions')
const getOneQuestionRoute = require('./questionsAndAnswers/routes/getOneQuestion')
const deleteQuestionRoute = require('./questionsAndAnswers/routes/deleteQuestion')
const addAnswerRoute = require('./questionsAndAnswers/routes/addAnswer')
const getAnswersRoute = require('./questionsAndAnswers/routes/getAnswers')
const getYourAnsweresRoute = require('./questionsAndAnswers/routes/getYourAnswers')
const addLikeRoute = require('./questionsAndAnswers/routes/addLike')
const removeLikeRoute = require('./questionsAndAnswers/routes/removeLike')
const removeAnswerRoute = require('./questionsAndAnswers/routes/removeAnswer')
///////////////////////////////////////////////////////////////////////////////
app.use('/question/askyourself', askYourselfRoute)
app.use('/questions/getquestions', getQuestionsRoute)
app.use('/questions/getquestion', getOneQuestionRoute)
app.use('/questions/deletequestion', deleteQuestionRoute)
app.use('/questions/addanswer', addAnswerRoute)
app.use('/questions/getanswers', getAnswersRoute)
app.use('/questions/getyouranswers', getYourAnsweresRoute)
app.use('/questions/askquestion', askAnotherUserRoute)
app.use('/questions/addlike', addLikeRoute)
app.use('/questions/removelike', removeLikeRoute)
app.use('/questions/removeAnswer', removeAnswerRoute)
///////////////////////////////////////////////////////////////////////////////
const imageUploadRoute = require('./misc/uploadimage')
const updateSettingsRoute = require('./misc/updateSettings')
const getUserSettingsRoute = require('./misc/getUserSettings')
const getUserNameAndImageRoute = require('./misc/getUserNameAndImage')

app.use('/upload/image', imageUploadRoute)
app.use('/user/settings', updateSettingsRoute)
app.use('/user/getsettings', getUserSettingsRoute)
app.use('/user/getuserandimage', getUserNameAndImageRoute)

///////////////////////////////////////////////////////////////////////////////
const followRoute = require('./following/routes/follow')
const unfollowRoute = require('./following/routes/unfollow')
const checkFollowStatusRoute = require('./following/routes/checkFollowingStatus')
const getFollowingRoute = require('./following/routes/getFollowing')

app.use('/follow', followRoute)
app.use('/unfollow', unfollowRoute)
app.use('/checkfollow', checkFollowStatusRoute)
app.use('/getfollowing', getFollowingRoute)

///////////////////////////////////////////////////////////////////////////////


app.listen(4000, () => {
  console.log('listening on :4000');
});