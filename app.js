const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');

const shopRouter = require('./routes/shop');

const errorController = require('./controller/error');

const app = express();

const sequelize = require('./util/database');

const Product = require('./models/products');
const User = require('./models/user');
const Cart = require('./models/carts');
const CartItem = require('./models/cart-items');
const Order = require('./models/order');
const OrderItem = require('./models/order-items');

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        console.log(req.url);
        next();
    }).catch(err => {
        console.log(err);
    });
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRouter);

app.use(shopRouter);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize.sync()
    .then(result => {
        return User.findByPk(1);
        app.listen(3000);
    }).then(user => {
        if (!user) {
            return User.create({ name: 'Krishna', email: 'test@test.com' });
        }
        return user;
    }).then(user => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
