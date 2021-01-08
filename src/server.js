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
const addQuestionRoute = require('./questionsAndAnswers/routes/addQuestion')
const getQuestionsRoute = require('./questionsAndAnswers/routes/getQuestions')
const getOneQuestionRoute = require('./questionsAndAnswers/routes/getOneQuestion')
const deleteQuestionRoute = require('./questionsAndAnswers/routes/deleteQuestion')
///////////////////////////////////////////////////////////////////////////////
app.use('/question/addquestion', addQuestionRoute)
app.use('/questions/getquestions', getQuestionsRoute)
app.use('/questions/getquestion', getOneQuestionRoute)
app.use('/questions/deletequestion', deleteQuestionRoute)
app.listen(4000, () => {
  console.log("listening on port 4000");
});