import { Router } from "express";

//Routes
import start from "./routes/start";
import listener from "./routes/listener";
import artist from "./routes/artist";

const route = Router();

route.use("/start", start);
route.use("/listener", listener);
route.use("/artist", artist);

export default route;
