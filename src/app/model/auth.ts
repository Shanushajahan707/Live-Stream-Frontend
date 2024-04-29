export interface loginCredential{
    username:string,
    password:string
}

export interface signupCredential{
    username:string,
    email:string,
    password:string,
    dateofbirth:Date
}
export interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    role: string;
    dateofbirth: string;
    isblocked: boolean;
    googleId:number;
   }
   