require("dotenv").config();
const app = require("./App");
const connectDB = require("./config/db");

connectDB();


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
