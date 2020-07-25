const path = require('path');
const express = require('express');

const router = express.Router();

const productsController = require('../controller/products');
const indexController = require('../controller/index');

router.get('/', indexController.getIndex);
router.get('/products', productsController.getProducts);
router.get('/products/:productId', productsController.getProductDetails);
router.get('/cart', productsController.getCart);
router.post('/cart', productsController.postCart);
router.post('/cart-delete-item', productsController.postDeleteCartProduct);
router.get('/checkout', productsController.getCheckout);
router.post('/create-order', productsController.postOrder);
router.get('/orders', productsController.getOrders);

module.exports = router;