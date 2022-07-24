const Product = require("../models/product");
// const Cart = require("../models/cart");
// const Order = require("../models/order")

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};
// findByPk is method to find single entry using primary key
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
    .then((rows) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  // console.log(req.user);
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
      cart.getProducts().then((product) => {
        res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: product,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchCart = cart;
      fetchCart
        .getProducts({ where: { id: prodId } })
        .then((products) => {
          let product;
          if (products.length > 0) {
            product = products[0];
            console.log(products[0]);
          }
          let newQuantity = 1;
          if (product) {
            const oldQuantity = product.cartItem.quantity;
           
            newQuantity = oldQuantity + 1;
            console.log("old" + newQuantity);
            return fetchCart.addProducts(product,{through: { quantity: newQuantity }});
          }
          return Product.findByPk(prodId)
            .then((product) => {
              return fetchCart.addProducts(product, {
                through: { quantity: newQuantity },
              });
            })
        .then((data) => {
          return fetchCart.addProducts(product, { quantity: newQuantity });
        });
    })
    .then(() => {
      res.redirect("/cart");
    })
  })
    .catch((err) => {
      console.log(err);
    });

  // const prodId = req.body.productId;
  // Product.findByPk(prodId).then( product => {
  //   Cart.addProduct(prodId, product.price);
  // }).catch(err=> {console.log(err);});
  //   res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart().then(cart=>{
    return cart.getProducts({where:{id:prodId}})
  }).then(products=>{
    const product = products[0];
    return product.cartItem.destroy();
  }).then(result =>{
    res.redirect("/cart");
  }).catch(err=>{
    console.log(err);
  })
  Product.findByPk(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect("/cart");
  });
};

exports.postOrder = (req,res,next)=>{
  let fetchCart;
  req.user.getCart().then(cart=>{
    fetchCart = cart;
    return cart.getProducts();
  }).then(product=>{
    return req.user.createOrder().then(order=>{
      order.addProducts(product.map(product=>{
        product.orderItem={quantity:product.cartItem.quantity};
        return product;
      }))
    }).catch(err=>{console.log(err);})
  }).then(result=>{
    return fetchCart.setProducts(null);
   
  }).then(result=>{
    res.redirect("/orders");
  }).catch(err=>{console.log(err);})
}


exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']}).then(orders=>{
    console.log(orders);
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders:orders
    });
  }).catch(err=>{
    console.log(err);
  })
 
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
