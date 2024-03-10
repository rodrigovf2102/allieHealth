import { User, UserEhr, UserPayroll, UsersJson } from "./protocols";
import { repository } from "./repository";


function treatUser(user: User){
    const errors : string[] = [];
    const emptyError = (key:string) => `The user ${key} is empty` 
    if (!user.first_name){
        errors.push(emptyError("first name"))
    }
    if(!user.last_name){
        errors.push(emptyError("last name"))
    } 
    if(!user.email) {
        errors.push(emptyError("email"))
    }
    const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!validEmailRegex.test(user.email) && user.email){
        errors.push("The user email is not valid")
    }
    return errors;
}

function insertBulkUsers(usersJson: UsersJson){
    let userType : string = "";
    if(usersJson.source.includes("payroll")) userType = "payroll";
    if(usersJson.source.includes("ehr")) userType = "ehr";

    const users : User[] = userType === "payroll" ?
        treatUsersPayroll(usersJson.users || []) : treatUsersEhr(usersJson.people || []);

    for (const user of users) {
        const repeatedUser = repository.getUserById(user.id || "");
        if(repeatedUser) continue;
        try {
            repository.postUser(user);
        } catch (error) {
            console.log(error);
        }
    }
}

function treatUsersPayroll(usersPayroll : UserPayroll[]) : User[]{
    const users : User[] = [];
    for (const userPayroll of usersPayroll) {
        let user : User = {
            day_of_birth: userPayroll.date_of_birth,
            email: userPayroll.email,
            first_name: userPayroll.first_name,
            last_name: userPayroll.last_name,
            id: userPayroll.payroll_id,
            phone_number: userPayroll.phone_number
        };
        const errors = treatUser(user);
        if(errors.length === 0) users.push(user); 
    }
    return users;
}

function treatUsersEhr(usersEhr : UserEhr[]) : User[] {
    const users : User[] = [];
    for (const userEhr of usersEhr) {
        const names = userEhr.name.split(" ");
        const [firstName, lastName] = [names[0], names[names.length-1]]
        let user: User = {
            first_name : firstName,
            last_name : lastName,
            email: userEhr.contact_info.email || userEhr.contact_info.email_address || "",
            day_of_birth: userEhr.date_of_birth,
            id: "a"+userEhr.ehr_id.toString(),
            phone_number: userEhr.contact_info.phone,
        }
        const errors = treatUser(user);
        if(errors.length === 0) users.push(user); 
    }
    return users;
}

export const service = {
    treatUser,
    insertBulkUsers
}