const mongoose = require("mongoose");
const User = mongoose.model("users");
module.exports = (app) => {
  app.get("/api/topmajors/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("topMajors");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.topMajors);
    } catch (error) {
      console.error("Error fetching top majors:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/selectedmajors/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("selectedMajor");
      if(!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.selectedMajor);
    } catch (error) {
      console.error("Error fetching selected majors:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};
