# Challenge API v6 - Replit Configuration

## Overview

This is a modern Challenge Management API built with Node.js, Express, and Prisma ORM. The API provides comprehensive CRUD operations for managing challenges with advanced features like challenge source tracking, filtering, pagination, and interactive API documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Node.js with Express.js for REST API endpoints
- **ORM**: Prisma ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Validation**: Express-validator for request validation
- **Documentation**: Swagger/OpenAPI 3.0 with interactive UI

### API Design Pattern
- RESTful API following standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Consistent response format with success/error indicators
- Comprehensive error handling with specific error codes
- Request/response validation with detailed error messages

### Data Model
The system centers around a Challenge entity with fields including:
- Basic info: name, type, track, description, status
- Timestamps: created, updated, startDate, endDate
- Challenge source tracking: challengeSource (optional string field)
- User tracking: createdBy field

## Key Components

### 1. Server Configuration (`src/server.js`)
- Express server setup with CORS, JSON parsing, and static file serving
- Route mounting for challenges API
- Health check endpoint
- Global error handling middleware
- Swagger UI integration at `/api-docs`

### 2. Challenge Controller (`src/controllers/challengeController.js`)
- Handles all challenge-related business logic
- Implements CRUD operations using Prisma client
- Supports advanced filtering by status, type, track, challengeSource
- Pagination with metadata
- Search functionality

### 3. Validation Middleware (`src/middleware/validation.js`)
- Express-validator rules for challenge creation and updates
- Validates required fields, data types, and constraints
- Special validation for challengeSource field (optional string, max 255 chars)
- Custom error messages for better user experience

### 4. Error Handling (`src/middleware/errorHandler.js`)
- Global error handler for consistent error responses
- Specific handling for Prisma database errors
- Maps database constraint errors to appropriate HTTP status codes
- Provides detailed error information for debugging

### 5. Routes (`src/routes/challenges.js`)
- Defines all challenge-related endpoints
- Applies validation middleware to appropriate routes
- Includes additional utility endpoints (types, tracks)

## Data Flow

1. **Request Processing**:
   - Client sends HTTP request to Express server
   - CORS middleware handles cross-origin requests
   - JSON parsing middleware processes request body
   - Route handler applies validation middleware

2. **Business Logic**:
   - Controller receives validated request
   - Prisma client executes database operations
   - Results are formatted into consistent response structure

3. **Response**:
   - Success responses include data with metadata
   - Error responses include error details and HTTP status codes
   - All responses follow consistent JSON structure

## External Dependencies

### Core Dependencies
- **@prisma/client**: Database ORM client
- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **express-validator**: Request validation
- **swagger-ui-express**: API documentation

### Development Dependencies
- **prisma**: Database toolkit and schema management

## Deployment Strategy

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **PORT**: Server port (defaults to 5000)
- **NODE_ENV**: Environment mode (affects logging level)

### Database Setup
1. Run `npx prisma migrate dev` to apply database migrations
2. Run `npx prisma generate` to generate Prisma client
3. Ensure PostgreSQL database is accessible via DATABASE_URL

### Server Startup
1. Install dependencies: `npm install`
2. Set up database schema and migrations
3. Start server: `npm start` or `node src/server.js`

### API Documentation
- Interactive Swagger UI available at `/api-docs`
- Static documentation files in `/public`
- Swagger specification in `/src/swagger/swagger.json`

### Key Features
- **Challenge Source Tracking**: New challengeSource field tracks challenge origins
- **Advanced Filtering**: Filter challenges by multiple criteria including challengeSource
- **Interactive Dashboard**: Beautiful, responsive dashboard with charts and analytics
- **API Explorer**: Interactive API testing interface with live responses
- **Real-time Charts**: Visual data representation using Chart.js
- **Modern UI/UX**: Bootstrap 5 with gradient designs and animations
- **Pagination**: Efficient data retrieval with page/limit parameters
- **Type Safety**: Prisma ensures type-safe database operations
- **Comprehensive Validation**: Input validation with detailed error messages
- **Error Handling**: Robust error handling with specific error codes

## Recent Changes (July 10, 2025)

### challengeSource Field Implementation - COMPLETED ✅
- **Database Schema**: Added optional `challengeSource String?` field to Challenge model
- **Migration**: Applied database migration successfully with default challenge types/tracks
- **API Integration**: Full CRUD support for challengeSource field in all endpoints
- **Validation**: Added validation rules (optional string, max 255 characters)
- **Filtering**: Implemented challengeSource filtering in GET /challenges endpoint
- **Documentation**: Updated Swagger documentation with challengeSource examples
- **Testing**: Comprehensive validation testing completed (see VALIDATION.md)

### Technical Issues Resolved
- **Express Version**: Downgraded from Express 5.1.0 to 4.18.2 to resolve path-to-regexp compatibility issues
- **Route Ordering**: Fixed route ordering issue (/types and /tracks before /:id routes)
- **Database Connection**: Successfully connected to PostgreSQL with Prisma ORM

### Enhanced Design and UI Implementation - COMPLETED ✅
- **Interactive Dashboard**: Created comprehensive dashboard with real-time charts and analytics
- **API Explorer**: Built interactive API testing interface with live request/response handling
- **Modern Visual Design**: Implemented gradient backgrounds, card-based layouts, and smooth animations
- **Chart Visualizations**: Added Chart.js integration for status, source, type, and track distributions
- **Responsive Layout**: Bootstrap 5 responsive grid system for mobile and desktop compatibility
- **Enhanced Navigation**: Seamless navigation between dashboard, explorer, and documentation
- **Interactive Features**: Filter, search, create, update, and delete challenges through UI
- **Real-time Updates**: Live data refresh and notification system
- **Professional Styling**: Modern color schemes, typography, and visual hierarchy

### Validation Results
All tests passed successfully:
- ✅ Challenge creation with challengeSource field
- ✅ Challenge creation without challengeSource field (optional)
- ✅ Filtering challenges by challengeSource
- ✅ Updating challengeSource via PATCH operations
- ✅ Full CRUD operations maintained
- ✅ API documentation and health checks functional
- ✅ Interactive dashboard with charts and analytics working
- ✅ API explorer with live testing capabilities functional

The architecture prioritizes simplicity, maintainability, and developer experience while providing a robust foundation for challenge management operations with enhanced visual interface and interactive features.