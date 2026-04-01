const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/votingDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));
const userSchema = new mongoose.Schema({
  aadhaar: String,
  name: String,
  passwordHash: String,
  votedCandidate: { type: String, default: null },
});

const User = mongoose.model("User", userSchema);
app.post("/api/register", async (req, res) => {
  const { aadhaar, name, password } = req.body;

  const exists = await User.findOne({ aadhaar });
  if (exists) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    aadhaar,
    name,
    passwordHash: hash,
  });

  await user.save();
  res.json({ message: "Registered" });
});
app.post("/api/login", async (req, res) => {
  const { aadhaar, password } = req.body;

  const user = await User.findOne({ aadhaar });
  if (!user) return res.status(400).json({ error: "Invalid" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(400).json({ error: "Invalid" });

  res.json({
    aadhaar: user.aadhaar,
    name: user.name,
    votedCandidate: user.votedCandidate,
  });
});
app.post("/api/vote", async (req, res) => {
  const { aadhaar, candidate } = req.body;

  const user = await User.findOne({ aadhaar });

  if (user.votedCandidate)
    return res.status(400).json({ error: "Already voted" });

  user.votedCandidate = candidate;
  await user.save();

  res.json({ message: "Vote stored" });
});
app.get("/api/results", async (req, res) => {
  const data = await User.aggregate([
    { $match: { votedCandidate: { $ne: null } } },
    { $group: { _id: "$votedCandidate", count: { $sum: 1 } } },
  ]);

  res.json(data);
});
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
