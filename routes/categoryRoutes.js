const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddlewares');
const {
  addCategory, getCategories, updateCategory, deleteCategory
} = require('../controllers/categoryController');

router.post('/category', auth, addCategory);
router.get('/categories', auth, getCategories);
router.put('/category/:categoryId', auth, updateCategory);
router.delete('/category/:categoryId', auth, deleteCategory);

module.exports = router;
