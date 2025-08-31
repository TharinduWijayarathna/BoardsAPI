# Boards REST API

A simple REST API for managing board items (TODO tasks) with stages.

## Features

- Create new board items
- Update item stages (1: To Do, 2: In Progress, 3: Done)
- SQLite3 database storage
- Full test coverage

## API Endpoints

### POST /boards
Creates a new board item.

**Request Body:**
```json
{
  "title": "Create a new project"
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Create a new project", 
  "stage": 1
}
```

### PUT /boards/:id
Updates the stage of an existing board item.

**Request Body:**
```json
{
  "stage": 2
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Create a new project",
  "stage": 2
}
```

**Response (400):** Invalid stage value (must be 1, 2, or 3)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Run tests:
```bash
npm test
```

## Project Structure

```
├── app.js              # Main application file
├── models/
│   └── boardModel.js   # Database model
├── routes/
│   └── boards.js       # API routes
├── package.json
└── README.md
```