import { User } from "./protocols";

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

export const service = {
    treatUser
}