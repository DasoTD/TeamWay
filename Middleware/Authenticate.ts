import jwt from 'jsonwebtoken'

require('dotenv').config();

//const {SECRET_KEY: string, EXPIRES_IN: string} = process.env;
const EXPIRES_IN: any = process.env.EXPIRES_IN
const SECRET_KEY: any = process.env.SECRET_KEY

const authenticate = async (user: any) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.userRole,
    time: new Date(),
  };

  const token = await jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRES_IN,
  });

  return token;
};
export { authenticate}