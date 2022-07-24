const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order")
const OrderItem =require("./models/order-item")
const { getProducts } = require('./controllers/admin');

const app = express();

require('dotenv').config()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findByPk(1).then(user =>{
        req.user = user;
        next();
    });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE"});
User.hasOne(Product);

User.hasOne(Cart);
Cart.belongsTo(User);// optional

Product.belongsToMany(Cart, {through: CartItem});
Cart.belongsToMany(Product, {through : CartItem});//optional

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});


sequelize.sync().then(result=>{
    return User.findByPk(1);
}).then(user=>{
    if (!user) {
        User.create({name:"Philip", email:"test@test.com"});
    }
    return user;
}).then(user=>{
    return user.createCart();
    // console.log(result);

}).then(user=>{
    app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))
}).catch((err) => {
    
})
