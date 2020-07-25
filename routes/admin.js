const express = require('express');

const router = express.Router();

const productsController = require('../controller/products');

router.get('/add-product', productsController.getAddProducts);
router.get('/edit-product/:productId', productsController.getEditProducts);
router.post('/edit-product', productsController.postEditProduct);
router.post('/delete-product', productsController.postDeleteProduct);


router.post('/product', productsController.postAddProducts);

router.get('/products/admin', productsController.getAdminProducts);

module.exports = router;