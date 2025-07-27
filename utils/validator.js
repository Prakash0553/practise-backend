import Joi from "joi";
import {  authors, categories } from "../models/Product.js";
import validate from 'express-joi-validation';

export const validates = validate.createValidator({});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(40).required()
});


export const registerSchema = Joi.object({
  username: Joi.string().min(4).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).max(40).required()
});





export const productValSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  rating: Joi.number(),
  category: Joi.string().valid(...categories).required(),
  author: Joi.string().valid(...authors).required()
}).unknown(true);