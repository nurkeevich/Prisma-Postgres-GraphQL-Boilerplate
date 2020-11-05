import { Request } from "express";
import * as jwt from "jsonwebtoken";

const getUserId = (request: Request, requireAuth = true) => {
    const authorization = request.get("Authorization");

    if (authorization) {
        const token = authorization.replace("Bearer ", "");
        const { userId } = jwt.verify(
            token,
            process.env.APP_SECRET as string
        ) as { userId: number };

        return userId;
    }

    if (requireAuth) {
        throw new Error("Not Authorized");
    }

    return null;
};

export default getUserId;
