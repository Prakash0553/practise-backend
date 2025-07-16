import express from 'express';
import { addProduct, getProduct, getProducts, getTop5, removeProducts, reviewProduct, updateProducts } from '../controllers/productController.js';
import { fileCheck, updateFileCheck } from '../middlewares/checkFiles.js';
import { notAllowed } from '../utils/shareFunc.js';
import { checkId } from '../middlewares/checkId.js';
import { productValSchema, validates } from '../utils/validator.js';
import { adminCheck, userCheck } from '../middlewares/userCheck.js';


const router =express.Router();


router.route('/').get(getProducts)
  .post( validates.body(productValSchema), fileCheck, addProduct).all(notAllowed);

router.route('/top-5').get(getTop5, getProducts).all(notAllowed);

router.route('/:id').get(checkId, getProduct).patch(userCheck, adminCheck, checkId,
  updateFileCheck, updateProducts).delete(userCheck, adminCheck, checkId, removeProducts).all(notAllowed);

router.route('/reviews/:id').patch(checkId, reviewProduct).all(notAllowed);
  

export default router;
//slash paxadi pathako id top-5 dynamic value haru req object ko params bata access hunxa




//products related requests
//get, search, add product, delete product, update product, sorting, pagination