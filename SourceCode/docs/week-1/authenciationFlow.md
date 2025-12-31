# Authentication Flow Documentation  
**AKS Full-Stack Application – OpenID Connect**

---

## 1. Overview

This document describes the **end-to-end authentication flow** for a full-stack application deployed on **Azure Kubernetes Service (AKS)**.

The application uses **OpenID Connect (OIDC)** with the following Identity Provider:

https://id-dev.mindx.edu.vn


Authentication follows **modern industry best practices**, using:
- Frontend-driven login (Authorization Code Flow)
- Backend token exchange & validation
- JWT-based API protection

---

## 2. Architecture Overview
User Browser
    |
    v
Frontend (React)
    |
    | OpenID Redirect
    v
MindX OpenID Provider
    |
    | Authorization Code
    v
Frontend → Backend API
    |
    | Token Exchange
    v
Backend (Node.js)
    |   Exchange code for token
    |   Validate & Issue Token
    v
Protected APIs


Ingress Controller routes traffic:
- `/` → React Frontend
- `/api/*` → Backend API

---

## 3. Components Involved

### Frontend (React)
- Handles **Login / Logout UI**
- Initiates **OpenID login redirect**
- Stores authentication state
- Sends JWT token with API requests

### Backend (Node.js API)
- Handles **OpenID callback**
- Exchanges authorization code for tokens
- Validates tokens
- Protects API endpoints using middleware

### OpenID Provider (MindX)
- Authenticates users
- Issues authorization codes
- Issues identity & access tokens

### Ingress Controller (AKS)
- Routes external traffic
- Terminates HTTPS (via cert-manager)

---

## 4. Authentication Flow (Step-by-Step)

### Step 1: User clicks Login

Frontend redirects user to the OpenID provider:

GET https://id-dev.mindx.edu.vn/authorize
?client_id=xxx
&redirect_uri=https://your-domain/auth/callback
&response_type=code
&scope=openid profile email

### Step 2: User authenticates

- User logs in via MindX Identity System
- On success, OpenID redirects back:

https://your-domain/auth/callback?code=AUTH_CODE

### Step 3: Frontend sends code to backend

React sends the authorization code to the backend API:

POST /api/auth/openid
Content-Type: application/json

{
"code": "AUTH_CODE"
}

### Step 4: Backend exchanges code for token

Backend calls the OpenID token endpoint:

POST https://id-dev.mindx.edu.vn/token

Receives:
- `id_token`
- `access_token`
- `expires_in`

---

### Step 5: Backend issues application JWT

Backend performs:
- OpenID response validation
- User info extraction
- Internal **JWT issuance** for the application

---

### Step 6: Frontend stores token

Frontend:
- Stores JWT securely (memory / secure storage)
- Uses JWT for authenticated requests

---

## 5. Authenticated API Requests

Example request:

GET /api/dashboard
Authorization: Bearer <JWT_TOKEN>

Backend middleware:
- Verifies JWT signature
- Checks expiration
- Attaches user context to request

---

## 6. Route Protection

### Frontend
- Protected routes using **React Router**
- Redirect unauthenticated users to `/login`

### Backend
- `authMiddleware`
- Verifies JWT
- Allows or denies access

---

## 7. Logout Flow

Frontend:
- Clears stored JWT
- Redirects user to login page

(No token invalidation is required server-side due to short JWT lifetime)

---

## 8. Security Considerations

- HTTPS enforced via **Ingress + cert-manager**
- Tokens are **never exposed in URL**
- JWT expiration strictly enforced
- Backend validates all protected requests
- No sensitive secrets stored in frontend

---

## 9. Troubleshooting Checklist

| Issue | Check |
|------|------|
| Login redirect fails | Redirect URI mismatch |
| Token invalid | Clock skew / wrong secret |
| API returns 401 | Missing Authorization header |
| Frontend logout fails | Token not cleared |
| HTTPS issues | Ingress TLS / cert-manager |

