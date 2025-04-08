const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddlewares');
const {
  addService, getServices, deleteService, updateService
} = require('../controllers/serviceController');

router.post('/category/:categoryId/service', auth, addService);
router.get('/category/:categoryId/services', auth, getServices);
router.delete('/category/:categoryId/service/:serviceId', auth, deleteService);
router.put('/category/:categoryId/service/:serviceId', auth, updateService);

module.exports = router;
