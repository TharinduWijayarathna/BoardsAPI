const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class BoardModel {
  constructor() {
    this.db = null;
  }

  // Initialize database connection and create table
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(':memory:', (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.createTable().then(resolve).catch(reject);
        }
      });
    });
  }

  // Create boards table
  async createTable() {
    return new Promise((resolve, reject) => {
      const sql = `
        CREATE TABLE IF NOT EXISTS boards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          stage INTEGER NOT NULL DEFAULT 1
        )
      `;
      
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Boards table created');
          resolve();
        }
      });
    });
  }

  // Create a new board item
  async create(title) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO boards (title, stage) VALUES (?, 1)';
      
      this.db.run(sql, [title], function(err) {
        if (err) {
          reject(err);
        } else {
          // Return the created item
          resolve({
            id: this.lastID,
            title: title,
            stage: 1
          });
        }
      });
    });
  }

  // Update stage of a board item
  async updateStage(id, stage) {
    return new Promise((resolve, reject) => {
      // First check if item exists
      this.db.get('SELECT * FROM boards WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          reject(new Error('Item not found'));
        } else {
          // Update the stage
          const sql = 'UPDATE boards SET stage = ? WHERE id = ?';
          this.db.run(sql, [stage, id], function(err) {
            if (err) {
              reject(err);
            } else {
              // Return updated item
              resolve({
                id: parseInt(id),
                title: row.title,
                stage: stage
              });
            }
          });
        }
      });
    });
  }

  // Get all board items
  async getAll() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM boards ORDER BY id';
      
      this.db.all(sql, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get board item by ID
  async getById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM boards WHERE id = ?';
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
      });
    }
  }
}

// Singleton instance
const boardModel = new BoardModel();

// Initialize database
const initializeDatabase = async () => {
  await boardModel.initialize();
};

module.exports = {
  boardModel,
  initializeDatabase
};