import express from "express";
import bodyParser from "body-parser";
import api from "./src/api/index";
import cors from "cors";

const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use(express.static("public"));
app.use("/api", api);

const port = process.env.PORT || 5000;

// Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
