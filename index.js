const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let taxRate = 5;
let discountPercentage = 10;
let loyaltyRate = 2;

app.use(express.static('static'));

app.get('/cart-total', (req, res) => {
  let newItemPrice = parseFloat(req.query.newItemPrice);
  let cartTotal = parseFloat(req.query.cartTotal);
  let totalCartPrice = newItemPrice + cartTotal;
  res.send(totalCartPrice.toString());
});

function membershipDiscount(cartTotal, isMember) {
  let afterDiscount = cartTotal - cartTotal * (discountPercentage / 100);
  if (isMember) {
    return afterDiscount;
  } else {
    return 'no discount is applied';
  }
}

app.get('/membership-discount', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  let isMember = req.query.isMember === 'true';
  res.send(membershipDiscount(cartTotal, isMember).toString());
});

function calculateTaxAmount(cartTotal) {
  let taxAmount = cartTotal * (taxRate / 100);
  return taxAmount;
}

app.get('/calculate-tax', (req, res) => {
  let cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculateTaxAmount(cartTotal).toString());
});

function estimateDeliveryTime(shippingMethod, distance) {
  let timeStandard = distance / 50;
  let timeExpress = distance / 100;
  if (shippingMethod === 'express') {
    return timeExpress;
  } else {
    return timeStandard;
  }
}

app.get('/estimate-delivery', (req, res) => {
  let shippingMethod = req.query.shippingMethod;
  let distance = parseFloat(req.query.distance);
  res.send(estimateDeliveryTime(shippingMethod, distance).toString());
});

function calculateShippingCost(weight, distance) {
  let shippingCost = weight * distance * 0.1;
  return shippingCost;
}

app.get('/shipping-cost', (req, res) => {
  let weight = req.query.weight;
  let distance = req.query.distance;
  res.send(calculateShippingCost(weight, distance).toString());
});

function calculateLoyaltyPoints(purchaseAmount) {
  return loyaltyRate * purchaseAmount;
}

app.get('/loyalty-points', (req, res) => {
  let purchaseAmount = parseFloat(req.query.purchaseAmount);
  res.send(calculateLoyaltyPoints(purchaseAmount).toString());
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
