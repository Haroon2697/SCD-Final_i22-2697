# Microservices Blog Application

A secure, containerized blog application built with microservices architecture.

## Services

1. **Auth Service (Port 3001)**
   - User registration
   - User login
   - JWT token verification
   - Health and readiness endpoints

2. **Blog Service (Port 3002)**
   - Create, read, and delete blogs
   - Protected endpoints for blog creation and deletion
   - Public endpoints for reading blogs
   - Health and readiness endpoints

3. **Comment Service (Port 3003)**
   - Add comments to blogs (authenticated users only)
   - Fetch comments by blog ID (public)
   - Delete comments (owner only)
   - Health and readiness endpoints

4. **Profile Service (Port 3004)**
   - Update user profile information
   - Fetch user profile data
   - Protected endpoints for profile updates
   - Health and readiness endpoints

5. **API Gateway (Port 3000)**
   - Single entry point for all microservices
   - Request routing
   - JWT verification
   - Health and readiness endpoints

## Security Features

- JWT-based authentication
- Protected endpoints with middleware verification
- Environment variables for sensitive data
- Docker secrets for JWT token
- CORS enabled
- Input validation
- Owner-only access for deletions
- Container security scanning
- Health and readiness checks

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository
2. Generate JWT secret:
   ```bash
   mkdir -p secrets
   openssl rand -base64 32 > secrets/jwt_secret.txt
   ```
3. Run the application:
   ```bash
   docker-compose up --build
   ```

## Health Checks

Each service provides health and readiness endpoints:
- GET `/health` - Returns service health status
- GET `/ready` - Returns service readiness status

## Networks

The application uses two Docker networks:
- `frontend` - For external access through the API Gateway
- `backend` - For internal communication between services

## CI/CD Pipeline

The application includes a GitHub Actions workflow that:

1. **Testing**
   - Runs unit tests for all services
   - Performs security scanning with Snyk
   - Scans containers with Trivy

2. **Building**
   - Builds Docker images for all services
   - Pushes images to Docker Hub

3. **Deployment**
   - Updates deployment configuration
   - Deploys to production server

### Required Secrets

Add the following secrets to your GitHub repository:
- `DOCKERHUB_USERNAME` - Docker Hub username
- `DOCKERHUB_TOKEN` - Docker Hub access token
- `DEPLOY_HOST` - Production server hostname
- `DEPLOY_USERNAME` - Production server SSH username
- `DEPLOY_KEY` - Production server SSH private key
- `SNYK_TOKEN` - Snyk API token

## API Endpoints

### Auth Service
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/verify` - Verify JWT token
- GET `/health` - Health check
- GET `/ready` - Readiness check

### Blog Service
- POST `/api/blogs` - Create new blog (protected)
- GET `/api/blogs` - Get all blogs
- GET `/api/blogs/:id` - Get blog by ID
- DELETE `/api/blogs/:id` - Delete blog (owner only)
- GET `/health` - Health check
- GET `/ready` - Readiness check

### Comment Service
- POST `/api/comments` - Add comment (protected)
- GET `/api/comments/blog/:blogId` - Get comments by blog ID
- DELETE `/api/comments/:id` - Delete comment (owner only)
- GET `/health` - Health check
- GET `/ready` - Readiness check

### Profile Service
- PUT `/api/profile` - Update profile (protected)
- GET `/api/profile/me` - Get own profile (protected)
- GET `/api/profile/user/:userId` - Get user profile
- GET `/health` - Health check
- GET `/ready` - Readiness check

## Development

To run services individually for development:

1. Install dependencies:
   ```bash
   cd service_directory
   npm install
   ```

2. Start service:
   ```bash
   npm run dev
   ```

## Production Deployment

The application is containerized and ready for production deployment:

1. Ensure all required secrets are set in GitHub
2. Push changes to the main branch
3. GitHub Actions will automatically:
   - Run tests and security scans
   - Build and push Docker images
   - Deploy to production

## Monitoring

Monitor service health using the health check endpoints:
```bash
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Blog Service
curl http://localhost:3003/health  # Comment Service
curl http://localhost:3004/health  # Profile Service
``` 