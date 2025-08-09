# Compass Backend API

A robust backend API for managing nomination forms with PostgreSQL database integration, built for Flutter applications.

## Features

- 🚀 RESTful API endpoints for nomination management
- 🔒 Input validation and sanitization
- 📊 PostgreSQL database with optimized queries
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)
- 📄 Comprehensive error handling
- 📈 Statistics and analytics endpoints
- 🔍 Pagination support
- 📱 Flutter-ready API responses

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
```bash
cd compass_backend
npm install
```

2. **Database Setup:**
```bash
# Create PostgreSQL database
createdb compass_nominations

# Or using PostgreSQL CLI
psql -U postgres
CREATE DATABASE compass_nominations;
\q
```

3. **Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

4. **Run Database Migrations:**
```bash
npm run migrate
```

5. **Start the Server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Base URL: `http://localhost:3000`

### Nominations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/nominations` | Create new nomination |
| `GET` | `/api/nominations` | Get all nominations (paginated) |
| `GET` | `/api/nominations/:id` | Get nomination by ID |
| `PUT` | `/api/nominations/:id` | Update nomination |
| `DELETE` | `/api/nominations/:id` | Delete nomination |
| `GET` | `/api/nominations/domain/:domain` | Get nominations by domain |
| `GET` | `/api/nominations/stats` | Get statistics |
| `GET` | `/api/nominations/domains` | Get available domains |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

## Request/Response Examples

### Create Nomination

**POST** `/api/nominations`

```json
{
  "name": "John Doe",
  "course": "Computer Science Engineering",
  "phone_no": "9876543210",
  "domain": "Web Dev",
  "email": "john.doe@example.com",
  "insta_id": "johndoe_insta",
  "github_id": "johndoe",
  "gender": "Male"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Nomination submitted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "course": "Computer Science Engineering",
    "phone_no": "9876543210",
    "domain": "Web Dev",
    "email": "john.doe@example.com",
    "insta_id": "johndoe_insta",
    "github_id": "johndoe",
    "gender": "Male",
    "created_at": "2025-08-09T10:30:00.000Z",
    "updated_at": "2025-08-09T10:30:00.000Z"
  }
}
```

### Get All Nominations

**GET** `/api/nominations?page=1&limit=10`

```json
{
  "success": true,
  "message": "Nominations retrieved successfully",
  "data": {
    "nominations": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

### Get Statistics

**GET** `/api/nominations/stats`

```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_nominations": "45",
    "sponsorship_marketing": "8",
    "social_media": "7",
    "ui_ux": "12",
    "app_dev": "6",
    "web_dev": "9",
    "cybersecurity": "3",
    "male_count": "25",
    "female_count": "18",
    "others_count": "2"
  }
}
```

## Database Schema

### Nominations Table

```sql
CREATE TABLE nominations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  course VARCHAR(255) NOT NULL,
  phone_no VARCHAR(20) NOT NULL,
  domain VARCHAR(100) NOT NULL CHECK (
    domain IN (
      'Sponsorship & Marketing',
      'Social Media Team',
      'UI/UX',
      'App Dev',
      'Web Dev',
      'Cybersecurity Team'
    )
  ),
  email VARCHAR(255) NOT NULL UNIQUE,
  insta_id VARCHAR(255),
  github_id VARCHAR(255),
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Others')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Validation Rules

- **Name**: 2-255 characters, required
- **Course**: 2-255 characters, required
- **Phone**: 10-15 digits, required
- **Domain**: Must be one of the predefined domains, required
- **Email**: Valid email format, unique, required
- **Instagram ID**: 1-255 characters, optional
- **GitHub ID**: 1-255 characters, optional
- **Gender**: Male/Female/Others, required

## Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests/15min general, 5 submissions/hour)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ XSS protection

## Flutter Integration

### HTTP Client Setup

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://localhost:3000/api';
  
  static Future<Map<String, dynamic>> createNomination(Map<String, dynamic> data) async {
    final response = await http.post(
      Uri.parse('$baseUrl/nominations'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(data),
    );
    
    return json.decode(response.body);
  }
  
  static Future<Map<String, dynamic>> getNominations({int page = 1, int limit = 10}) async {
    final response = await http.get(
      Uri.parse('$baseUrl/nominations?page=$page&limit=$limit'),
    );
    
    return json.decode(response.body);
  }
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=compass_nominations
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

## Available Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run migrate  # Run database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
