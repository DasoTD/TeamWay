import { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import { authenticate } from '../../Middleware/Authenticate';
import { User, UserInput } from '../models/user.model';
require('dotenv').config();

const SALT : any= process.env
const login = async(req: Request, res: Response) => {
    try {
        //const SALT: number = 10; // hard coded this for sample purpose, please store it the .env file
        const {usernameoremail, password} = req.body
        if(!usernameoremail || ! password){
            return res.status(422).json({ message: 'The fields username and password are required' });
        }

        const user: any = await User.findOne({
            $or: [
              { username: usernameoremail.toLowerCase() },
              { email: usernameoremail.toLowerCase() },
            ],
          });
          if(!user){
              return res.status(404).json({ message: "user not found"})
          }
          const match =  bcrypt.compareSync(password, user.password)
          if(!match){
            return res.status(400).json({ message: "password does not match"})
        }

        const accessToken = await authenticate(user);
        const refreshToken = await bcrypt.hash(accessToken, Number(SALT));
        user.refreshToken = refreshToken;
        user.accessToken = accessToken;
        await user.save()

    } catch (error: unknown) {
        return res.json(error)
    }
}

const createUser =async (req:Request, res: Response) => {
    try {
        const { fullName, email, password, role, enabled} = req.body; // the request body

        if (!email || !fullName || !password || !role) {
            return res.status(422).json({ message: 'The fields email, fullName, password and role are required' });
        }
        //const SALT = 10; //hard codimng though
        //hash the entered password
          const encryptedPassword = await bcrypt.hash(
            password.toString(),
            Number(SALT)
          );
          //validate entered input
          const userInput: UserInput = {
            fullName,
            email,
            password: encryptedPassword,
            enabled,
            role,
          };

          const userCreated = await User.create(userInput);

          return res.status(201).json({ data: userCreated });
    } catch (error: unknown) {
        return res.json(error);
    }
}
const addHours = (date: Date, hours: number): Date => {
    return new Date(new Date(date).setHours(date.getHours() + hours))
  }

const schedule = async(req: Request, res: Response) =>{
    try {
        const user: any = ((req as any).user)
        let date = new Date()
       const bactTime: Date = addHours(date, 8)
       user.shift = true;
       await user.save();
   
    } catch (error: any) {
        
    }
}
export{ login, createUser, schedule} 