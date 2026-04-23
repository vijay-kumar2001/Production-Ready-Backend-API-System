import bcrypt from 'bcryptjs';

// bcrypt functions are async , so function that uses it should be async also and while calling these function await should be used 
export function hashPassword(password){
    return bcrypt.hash(password,10)
}

export function comparePassword(password,hash){
    //hash is stored hashed pswd of user and pswd is the one given during login
    return bcrypt.compare(password,hash)
}