const Product = require('../models/products');
const Cart = require('../models/carts');

exports.getAddProducts = (req, res, next) => {
    console.log('Add Product');
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        path: '/add-product',
        editing: false
    });
}

exports.getEditProducts = (req, res, next) => {
    const productId = req.params.productId;
    console.log('Edit Product', productId);
    req.user
            .getProducts({ where: { id: productId } })
            .then(products => {
                const product = products[0];
                    res.render('admin/edit-product', {
                        docTitle: 'Edit Product',
                        path: '/edit-product',
                        editing: true,
                        product: product
                    });
            }).catch(err => {
                console.log(err);
            });
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;

    Product.findByPk(productId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();
    }).catch(err => {
        console.log(err);
    }).then(result => {
        console.log('UPDATED PRODUCT');
        res.redirect('/products/admin');
    }).catch(err => {
        console.log(err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByPk(productId).then(product => {
        return product.destroy();
    }).then(result => {
        console.log('Product Deleted');
        res.redirect('/products/admin');
    }).catch(err => {
        console.log(err);
    });  
}

exports.postAddProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    req.user
        .createProduct({
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl
        })
        .then(result => {
            console.log('Product Created');
            res.redirect('/products');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
        .then(products => {
            res.render('shop/products-list', {
                data: products,
                'docTitle': 'Products'
            });
        }).catch(err => {
            console.log(err);
        });
};

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    console.log('ProductId: ', productId);
    Product.findByPk(productId)
        .then(product => {
            res.render('shop/product-detail', { product: product, docTitle: 'Product Details' });
        })
        .catch(err => console.log(err));
};

exports.getAdminProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.render('admin/products-list', {
            data: products,
            'docTitle': 'Products'
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart => {
        cart.getProducts().then(products => {
            res.render('shop/cart', {
                'docTitle': 'Cart',
                products: products
            });
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                let oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postDeleteCartProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product = products[0];
            return product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCheckout = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/checkout', {
            'docTitle': 'Checkout'
        });
    });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }))
                })
                .catch(err => {
                    console.log(err);
                });

        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: 'products'})
        .then(orders => {
            res.render('shop/orders', {
                orders: orders,
                'docTitle': 'My Orders'
            });
        })
        .catch(err => {
            console.log(err);
        });
};
