const express= require('express')

const {createBug,getAllBugs, getBugsByUser, updateBugStatus ,deleteBug} = require("../controllers/BugController")
const {verifyUser} = require('../middleware/protected')

const BugRouter = express.Router();

BugRouter.get("/all",verifyUser,getAllBugs);
BugRouter.get("/all/:userId",verifyUser,getBugsByUser);
BugRouter.post("/new",verifyUser,createBug);
BugRouter.patch("/update/:bugId",verifyUser,updateBugStatus)
BugRouter.delete("/delete/:bugId",deleteBug)

module.exports = BugRouter;