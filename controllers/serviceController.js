const db = require('../models/db');

// Add Service
exports.addService = (req, res) => {
    try {
        const { name, type, priceOptions } = req.body;
        const { categoryId } = req.params;

        // Validation
        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Service name is required' });
        }
        if (!type || type.trim() === '') {
            return res.status(400).json({ error: 'Service type is required' });
        }
        if (!Array.isArray(priceOptions) || priceOptions.length === 0) {
            return res.status(400).json({ error: 'priceOptions must be a non-empty array' });
        }
        for (const p of priceOptions) {
            if (typeof p.duration !== 'number' || p.duration <= 0) {
                return res.status(400).json({ error: 'Each priceOption.duration must be a positive number' });
            }
            if (typeof p.price !== 'number' || p.price < 0) {
                return res.status(400).json({ error: 'Each priceOption.price must be a non-negative number' });
            }
            if (!p.type || typeof p.type !== 'string') {
                return res.status(400).json({ error: 'Each priceOption.type is required and must be a string' });
            }
        }

        // Insert service
        db.query(
            'INSERT INTO services (category_id, name, type) VALUES (?, ?, ?)',
            [categoryId, name.trim(), type.trim()],
            (err, result) => {
                if (err) return res.status(500).json({ error: err });

                const serviceId = result.insertId;
                const values = priceOptions.map(p => [
                    serviceId,
                    p.duration,
                    p.price,
                    p.type.trim()
                ]);

                // Insert price options
                db.query(
                    'INSERT INTO price_options (service_id, duration, price, type) VALUES ?',
                    [values],
                    (err) => {
                        if (err) return res.status(500).json({ error: err });
                        res.json({ message: 'Service added', id: serviceId });
                    }
                );
            }
        );
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Get All Services in Category
exports.getServices = (req, res) => {
    try {
        const { categoryId } = req.params;

        // Validation
        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        db.query(`SELECT s.id AS service_id,s.name AS service_name,s.type AS service_type,s.category_id, po.id AS price_id,
            po.duration,
            po.price,
            po.type AS price_type
        FROM 
            services s
        LEFT JOIN 
            price_options po ON s.id = po.service_id
        WHERE 
            s.category_id = ?
        `,
            [categoryId],
            (err, results) => {
                if (err) return res.status(500).json({ error: err });
                res.json(results);
            }
        );
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Delete Service
exports.deleteService = (req, res) => {
    try {
        const { serviceId } = req.params;

        // Validation
        if (!serviceId || isNaN(serviceId)) {
            return res.status(400).json({ error: 'Invalid service ID' });
        }

        db.query('DELETE FROM services WHERE id = ?', [serviceId], (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: 'Service deleted' });
        });
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Update Service and Price Options
exports.updateService = (req, res) => {
    try {
        const { categoryId, serviceId } = req.params;
        const { name, type, priceOptions } = req.body;

        // Validation
        if (!categoryId || isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        if (!serviceId || isNaN(serviceId)) {
            return res.status(400).json({ error: 'Invalid service ID' });
        }
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Service name is required' });
        }
        if (!type || type.trim() === '') {
            return res.status(400).json({ error: 'Service type is required' });
        }
        if (!Array.isArray(priceOptions)) {
            return res.status(400).json({ error: 'priceOptions must be an array' });
        }
        

        // Update service
        db.query(
            'UPDATE services SET name = ?, type = ? WHERE id = ? AND category_id = ?',
            [name.trim(), type.trim(), serviceId, categoryId],
            (err) => {
                if (err) return res.status(500).json({ error: err });

                // Remove old price options
                db.query('DELETE FROM price_options WHERE service_id = ?', [serviceId], (err) => {
                    if (err) return res.status(500).json({ error: err });

                    // Insert new price options
                    const values = priceOptions.map(p => [
                        serviceId,
                        p.duration,
                        p.price,
                        p.type.trim()
                    ]);

                    db.query(
                        'INSERT INTO price_options (service_id, duration, price, type) VALUES ?',
                        [values],
                        (err) => {
                            if (err) return res.status(500).json({ error: err });
                            res.json({ message: 'Service updated' });
                        }
                    );
                });
            }
        );
    } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
