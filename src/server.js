const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json());

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
const getQuestionsRoute = require('./questionsAndAnswers/routes/getQuestions')
const getOneQuestionRoute = require('./questionsAndAnswers/routes/getOneQuestion')
const deleteQuestionRoute = require('./questionsAndAnswers/routes/deleteQuestion')
const addAnswerRoute = require('./questionsAndAnswers/routes/addAnswer')
///////////////////////////////////////////////////////////////////////////////
app.use('/question/askyourself', askYourselfRoute)
app.use('/questions/getquestions', getQuestionsRoute)
app.use('/questions/getquestion', getOneQuestionRoute)
app.use('/questions/deletequestion', deleteQuestionRoute)
app.use('/questions/addanswer', addAnswerRoute)
app.listen(4000, () => {
  console.log("listening on port 4000");
});