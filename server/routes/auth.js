const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
        if(req.user.isAdmin)
            res.redirect("http://localhost:3000/admin");
        else if(req.user.topMajors.length > 0)
            res.redirect("http://localhost:3000/career");
        else 
            res.redirect("http://localhost:3000/setup");
    },
  );

  app.get("/auth/current_user", (req, res) => {
    if (req.user == undefined) {
      res.status(401).json({ message: "Not authenticated" });
    } else res.send(req.user);
  });

  app.post("/auth/logout", function (req, res, next) {
    req.session = null;
    req.logout();
    req.logOut();
    res.status(200).send("Logged out");
  });
};
