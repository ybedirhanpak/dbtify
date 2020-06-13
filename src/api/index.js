import { Router } from "express";

//Routes
import start from "./routes/start";
import listener from "./routes/listener";
import artist from "./routes/artist";
import song from "./routes/song";
import album from "./routes/album";

const route = Router();

route.use("/start", start);
route.use("/listener", listener);
route.use("/artist", artist);
route.use("/song", song);
route.use("/album", album);

export default route;
