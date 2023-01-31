require("dotenv").config()
var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var cors = require("cors")
var bodyParser = require("body-parser")
var newsAPI = require("newsapi")
const newsapi = new newsAPI(process.env.NEWS_API_KEY)
const { TwitterApi } = require("twitter-api-v2")
const helmet = require("helmet")

var indexRouter = require("./routes/index")

var app = express()

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(helmet())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", indexRouter)
const NewsAPI = require("newsapi")

/* GET users listing. */
app.post("/tweets", function (req, res, next) {
  const client = new TwitterApi(process.env.TWITTER_API_KEY)
  const { q } = req.query
  const roClient = client.readOnly
  roClient.v2
    .get("tweets/search/recent", {
      query: q,
      max_results: 50,
    })
    .then((result) => {
      res.send(result.data)
    })
    .catch((err) => {
      res.send({ err })
    })
})

app.post("/news", function (req, res, next) {
  const { q } = req.query
  newsapi.v2
    .everything({
      q: q,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 50,
    })
    .then((result) => {
      res.send(result.articles)
    })
    .catch((err) => {
      res.send({ err })
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app

