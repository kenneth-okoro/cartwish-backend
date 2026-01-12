const express = require ("express");
const mongoose = require ("mongoose");
const userRouter = require("./routes/user.route");
const app = express();

mongoose.connect("mongodb://localhost:27017/cartwish")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));
    
app.use(express.json());

app.use('/api/v1/users', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});