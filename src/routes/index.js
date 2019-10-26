const express = require('express');
const path = require('path');
const ProductService = require('../services');
const receipt = '../assets/receipt.pdf'

const platziStore = (app) => {
  const router = express.Router();
  app.use('/api/', router);

  const productService = new ProductService();

  router.get('/', (req, res) => {
    //const c = new MongoConnect()
    //c.connect()

    //productsMock.forEach( item => {
    //  c.create("products", item );
    //})

    res.send(`API v2`);
  });

  router.get('/receipts', (req, res, next) => {
    let file = path.join(__dirname, receipt);
    res.sendFile(file);
  });

  router.get('/products', async (req, res, next) => {
    const storeProducts = await productService.getProducts()
    res.status(200).json(storeProducts);
  });

  router.get( '/products/:productId', async function(req, res, next) {    
    const { productId } = req.params;
    try {
      const product = await productService.getProduct({ productId });
      res.status(200).json({
        data: product,
        message: 'product retrieved'
      });
    } catch (err) {      
      next(err);
    }      
  });

  router.post('/products', async function(req, res, next) {
    const { body: product } = req;
    console.log(product);
    try {
      const createdProductId = await productService.createProduct({ product });

      res.status(201).json({
        data: createdProductId,
        message: 'product created'
      });
    } catch (err) {
      next(err);
    }
  });

  router.put(
    '/products/:productId',
    async function(req, res, next) {
      const { productId } = req.params;
      const { body: product } = req;

      try {
        const updatedProductId = await productService.updateProduct({
          productId,
          product
        });

        res.status(200).json({
          data: updatedProductId,
          message: 'product updated'
        });
      } catch (err) {
        next(err);
      }
    }
  );
  
  router.delete('/products/:productId', async function(req, res, next) {
    const { productId } = req.params;

    try {
      const deletedProductId = await productService.deleteProduct({ productId });

      res.status(200).json({
        data: deletedProductId,
        message: 'product deleted'
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  router.get('*', (req, res) => {
    res.status(404).send('Error 404');
  });
}

module.exports = platziStore;