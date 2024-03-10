import { randomUUID } from "crypto";
import { db } from "./db";
import { User } from "./protocols";

function getAllUsers() : User[] {
    return db.prepare("SELECT * FROM users").all() as User[];
}

function postUser(userRequest: User) {
    db
    .prepare(
      "INSERT INTO users (id, first_name, last_name, email, phone_number, day_of_birth) VALUES (@id, @first_name, @last_name, @email, @phone_number, @day_of_birth)",
    )
    .run({
      first_name: userRequest.first_name,
      last_name: userRequest.last_name,
      email: userRequest.email,
      phone_number: userRequest.phone_number || '',
      day_of_birth: userRequest.day_of_birth || '',
      id: userRequest.id || randomUUID()
    });
}

function getUserById(id: string){
    const statement = db.prepare(`SELECT * FROM users WHERE id = ?`);
    return statement.get(id) as User | undefined;
}

export const repository = {
    getAllUsers,
    postUser,
    getUserById
}