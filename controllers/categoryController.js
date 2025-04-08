const db = require('../models/db');

// Add Category
exports.addCategory = (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Category name is required' });
        }

        db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Category added', id: result.insertId });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get All Categories
exports.getCategories = (req, res) => {
    try {
        db.query('SELECT * FROM categories', (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Update Category
exports.updateCategory = (req, res) => {
    try {
        const { name } = req.body;
        const { categoryId } = req.params;

        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Category name is required' });
        }

        db.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Category updated' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Delete Category
exports.deleteCategory = (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        db.query('SELECT COUNT(*) as count FROM services WHERE category_id = ?', [categoryId], (err, results) => {
            if (err) return res.status(500).json({ error: err });

            if (results[0].count > 0) {
                return res.status(400).json({ message: 'Category not empty' });
            }

            db.query('DELETE FROM categories WHERE id = ?', [categoryId], (err) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Category deleted' });
            });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
