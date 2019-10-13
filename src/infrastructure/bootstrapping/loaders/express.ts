import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import methodOverride from "method-override";

import { RequestMiddleware } from "../../../ui/api/middleware/interceptor_middleware";

export type App = express.Application;

export const expressLoader = (app: express.Application) => {
    app.get("/status", (_req, res) => {
        res.status(200).end();
    });
    app.head("/status", (_req, res) => {
        res.status(200).end();
    });
    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable("trust proxy");

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors());

    // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
    // Maybe not needed anymore ?
    app.use(methodOverride());

    // Disable default cache
    app.set("etag", false);

    // Configure requests body parsing
    app.use(
        bodyParser.urlencoded({
            extended: true
        })
    );
    app.use(bodyParser.json());

    // Adds some security defaults
    app.use(helmet());

    // Log all requests that hit the server
    app.use(new RequestMiddleware().handler);
};
