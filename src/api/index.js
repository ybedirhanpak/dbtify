import { Router } from "express";

//Routes
import start from "./routes/start";
import listener from "./routes/listener";

const route = Router();

route.use("/start", start);
route.use("/listener", listener);

export default route;
