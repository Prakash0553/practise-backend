

import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    if (!isExist) return res.status(404).json({ message: 'user not found' });
    const pass = bcrypt.compareSync(password, isExist.password);
    if (!pass) return res.status(401).json({ message: 'Invalid Credential' });
    const token = jwt.sign({
      id: isExist.id,
      role: isExist.role
    }, 'secret');

    res.cookie(
      'jwt',
      token,{
        httpOnly: true,
        maxAge: 25 * 60 *60 * 1000,
       //secure: true,
        sameSite: 'none'
      });

    return res.status(200).json({
      token,
      role: isExist.role,
      username: isExist.username,
      email: isExist.email
    });

  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}



export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    if (isExist) return res.status(409).json({ message: 'user already exist' });
    const hashPass = bcrypt.hashSync(password, 10);
    await User.create({ username, email, password: hashPass }); //hash vako password haleko
    return res.status(200).json({ message: 'user registered successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }

}



export const getUserProfile = async (req, res) => {
  const id = req.userId;  // usercheck bata auxa
  try {
    const user = await User.findById(id);
    return res.status(200).json({
      username: user.username,    // password bahek username email ra role pathauni
      email: user.email,
      role: user.role,
    });

  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}


export const updateProfile = async (req, res) => {
  const { username, email } = req.body;
  const id = req.userId;
  try {
    const user = await User.findById(id);
    user.username = username || user.username; //if username pathako xa vani naya username basxa natra puranai basxa
    user.email = email || user.email;
    await user.save();

    return res.status(200).json({ message: 'profile updated successfully' });
  } catch (err) {
    return res.status(400).json({ message: `${err}` });
  }
}