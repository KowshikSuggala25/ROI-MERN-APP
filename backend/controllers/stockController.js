import { validationResult } from 'express-validator';
import Stock from '../models/Stock.js';

export const getAllStocks = async (req, res) => {
  try {
    const { active, category } = req.query;
    let filter = {};
    
    if (active !== undefined) {
      filter.active = active === 'true';
    }
    
    if (category) {
      filter.category = category;
    }

    const stocks = await Stock.find(filter).sort({ createdAt: -1 });
    res.json({ stocks });
  } catch (error) {
    console.error('Get stocks error:', error);
    res.status(500).json({ message: 'Failed to fetch stocks' });
  }
};

export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    
    res.json({ stock });
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({ message: 'Failed to fetch stock' });
  }
};

export const createStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const stockData = req.body;
    const stock = new Stock(stockData);
    await stock.save();

    res.status(201).json({
      message: 'Stock created successfully',
      stock
    });
  } catch (error) {
    console.error('Create stock error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Stock symbol already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create stock' });
    }
  }
};

export const updateStock = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const stock = await Stock.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json({
      message: 'Stock updated successfully',
      stock
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Failed to update stock' });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    res.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Delete stock error:', error);
    res.status(500).json({ message: 'Failed to delete stock' });
  }
};

export const toggleStockStatus = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    stock.active = !stock.active;
    stock.updatedAt = new Date();
    await stock.save();

    res.json({
      message: `Stock ${stock.active ? 'activated' : 'deactivated'} successfully`,
      stock
    });
  } catch (error) {
    console.error('Toggle stock status error:', error);
    res.status(500).json({ message: 'Failed to toggle stock status' });
  }
};