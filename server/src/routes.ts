import { Request, Response, Router } from "express";
import multer from "multer";
import os from "os";
import { service } from "./services";
import { User, UsersJson } from "./protocols";
import { repository } from "./repository";
import fs from 'fs';

const router = Router();

const upload = multer({ dest: os.tmpdir() });

router.get("/users", (req: Request, res: Response) => {
  const users = repository.getAllUsers();

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

  repository.postUser(userRequest);

  res.sendStatus(201);
});

router.post(
  "/users/bulk",
  upload.single("file"),
  (req: Request, res: Response) => {
    const file = req.file;

    const users : UsersJson = JSON.parse(fs.readFileSync(file?.path || '', 'utf-8'));
    service.insertBulkUsers(users);

    res.sendStatus(200);
  },
);

export default router;
