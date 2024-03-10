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
      "INSERT INTO users (first_name, last_name, email, phone_number, day_of_birth) VALUES (@first_name, @last_name, @email, @phone_number, @day_of_birth)",
    )
    .run({
      first_name: userRequest.first_name,
      last_name: userRequest.last_name,
      email: userRequest.email,
      phone_number: userRequest.phone_number || '',
      day_of_birth: userRequest.day_of_birth || ''
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
