import { Request, Response, Router } from "express";
import { db } from "./db";
import multer from "multer";
import os from "os";
import { service } from "./services";
import { User } from "./protocols";

const router = Router();

const upload = multer({ dest: os.tmpdir() });

router.get("/users", (req: Request, res: Response) => {
  const users = db.prepare("SELECT * FROM users").all();

  res.json({
    users: users,
  });
});

router.post("/users", (req: Request, res: Response) => {
  const userRequest : User = req.body;
  const errors = service.treatUser(userRequest);
  if(errors.length > 0){
    return res.status(400).send(errors);
  }

  const user = db
    .prepare(
      "INSERT INTO users (first_name, last_name, email) VALUES (@firstName, @lastName, @email)",
    )
    .run({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
    });

  res.json({
    id: user.lastInsertRowid,
  });
});

router.post(
  "/users/bulk",
  upload.single("file"),
  (req: Request, res: Response) => {
    const file = req.file;

    console.log(file);

    res.sendStatus(200);
  },
);

export default router;
