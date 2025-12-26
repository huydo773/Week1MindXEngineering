# Documentation for Local Development and Deployment Process

## Project Overview
This project consists of a **frontend (web client)** and a **backend (API server)**.  
The frontend communicates with the backend via **REST API endpoints**.

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript, React (if applicable)  
- **Backend:** Node.js / Express (or your backend framework)  
- **Database:** MySQL / MongoDB (if applicable)  
- **Containerization:** Docker  
- **Deployment:** Azure Web App, Azure Container Registry (ACR)  

## Local Development

### Backend
```bash
# Clone repository
git clone <repo-url>
cd backend

# Install dependencies
npm install

# Start server
npm run dev
Backend URL: http://localhost:3000
```
Frontend
```
cd frontend

# Install dependencies
npm install

# Start development server
npm start
Frontend URL: http://localhost:8080
```
## Docker Development

# Build Docker Images
```
docker build -t api:v1 .
docker build -t web:v1 .
```
# Run Containers
```
docker run -p 3000:3000 api:v1
docker run -p 8080:80 web:v1
```
## Deployment Process
## Step 1: Push Docker Images to Azure Container Registry
```
docker tag api:v1 webapp2.azurecr.io/api:v1
docker tag web:v1 mindxintern07.azurecr.io/web:v1
docker push webapp2.azurecr.io/api:v1
docker push mindxintern07.azurecr.io/web:v1
```
## Step 2: Deploy to Azure Web App
-Create Web Apps for frontend and backend

-Configure Web App to pull images from ACR

-Set environment variables in Azure Web App

-Start Web Apps

## Step 3: Verify Deployment
-Access the frontend URL

-Test API endpoints

-Check logs for errors

## Troubleshooting
-CORS Issues: Ensure backend Access-Control-Allow-Origin header matches frontend URL

-Port Conflicts: Check if local ports 3000 or 8080 are free

-Container Issues: Use docker logs <container-id> to debug

