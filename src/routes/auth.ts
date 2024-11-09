import { Request, Response, Router } from "express";
import { allUser, login, me, signup } from "../controllers/auth";
import authMiddleware, { authorizeRole } from "../middlewares/authMiddleware";


const authRoutes: Router = Router()


authRoutes.post('/signup', signup)

authRoutes.post('/login', login)


authRoutes.get('/me', authMiddleware, me);

authRoutes.get('/users',authMiddleware,authorizeRole(["ADMIN"]), allUser);


authRoutes.get("/admin", authMiddleware, authorizeRole(["ADMIN"]), (req: Request, res: Response) => {
    res.json({ message: "Welcome, admin!" });
}
);
authRoutes.get("/sub-admin", authMiddleware, authorizeRole(["SUB_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
    res.json({ message: "Welcome, subadmin!" });
}
);
authRoutes.get("/mentor", authMiddleware, authorizeRole(["MENTOR", "SUB_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
    res.json({ message: "Welcome, MENTOR!" });
}
);
authRoutes.get("/user", authMiddleware, authorizeRole(["USER", "MENTOR", "SUB_ADMIN", "ADMIN"]), (req: Request, res: Response) => {
    res.json({ message: "Welcome, admin! and all acccess this route" });
}
);








export default authRoutes;