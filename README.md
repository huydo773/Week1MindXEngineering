# Documentation for Local Development and Deployment Process

## Project Overview
-Create a Node.js / TypeScript API, containerize it, and push it to Azure Container Registry (ACR)

-Deploy the API to Azure Web App (optional) and AKS

-Configure Ingress Controller for public access

-Create a React frontend connected to the API

-Add authentication (OpenID)

-Deploy HTTPS with a custom domain using cert-manager

## Prerequisites
-Azure Subscription with contributor or owner permissions

-Docker installed

-Node.js + npm

-kubectl installed and configured

-Git repository access

-DNS access for creating A/CNAME records (for HTTPS)

## Tech Stack
- **Frontend:** CSS, React
- **Backend:** Node.js / Express (or your backend framework)  
- **Containerization:** Docker  
- **Deployment:** Azure Web App, Azure Container Registry (ACR)
### Quick checks:
```bash
az account show
kubectl cluster-info
```
    

## Step 1: API + ACR +Azure

### 1.1 Create Simple API
-Node.js + TypeScript + Express
-Endpoints: + GET /api/health
            + GET /api/hello
-Add build and start scripts in package.json            

### 1.2 Dockerize API
```backend dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
```
### 1.3 Azure Container Registry
```bash
az acr create --name backend --resource-group mindx-intern-07-rg
 --sku Basic
az acr login --name backend
az acr create --name frontend --resource-group mindx-intern-07-rg
 --sku Basic
az acr login --name frontend
```
### 1.4 Build & Push Image
```bash
docker build -t backend.azurecr.io/api:v1 .
docker push  backend.azurecr.io/api:v1 .
```
## Step 2: AKS Deployment
### 2.1 Create AKS Cluster
```bash
az aks create --name mindx-intern-cluster-AKS --resource-group mindx-intern-07-rg --node-count 1 --generate-ssh-keys
```
### 2.2 Configure Access
```bash
az aks get-credentials --name mindx-intern-cluster-AKS --resource-group mindx-intern-07-rg 
kubectl get nodes
```
### 2.3 Kubernetes Manifest
```backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
        version: v2
    spec:
      imagePullSecrets:
        - name: backend-acr-secret
      containers:
        - name: backend
          image: backend.azurecr.io/api:v1
          imagePullPolicy: Always
          ports:
            - containerPort: 3000
          env:
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: jwt-secret
                  key: jwt-secret-key

            - name: OPENID_CLIENT_ID
              valueFrom:
                secretKeyRef:
                  name: openid-secret
                  key: OPENID_CLIENT_ID
            - name: OPENID_CLIENT_SECRET
              valueFrom:
                secretKeyRef:
                  name: openid-secret
                  key: OPENID_CLIENT_SECRET
            - name: OPENID_REDIRECT_URI
              valueFrom:
                secretKeyRef:
                  name: openid-secret
                  key: OPENID_REDIRECT_URI      
```

```backend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  type: ClusterIP
  selector:
    app: backend
    version: v2
  ports:
    - port: 3000
      targetPort: 3000
```
### 2.4 Deploy
```bash
kubectl apply -f backend-deployment.yaml
kubectl get pods backend-deployment
kubectl apply -f backend-service.yaml
```

### 2.5 Test Internal Access
```bash
kubectl port-forward svc/api-service 3000:3000
curl http://localhost:3000/api/health
```

## Step 3: Ingress Controller
### 3.1 Install Nginx Ingress
```bash
kubectl create namespace ingress-nginx
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

### 3.2 Create Ingress Resource
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
      -http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 3000
```

### 3.3 Verify
```bash
kubectl get ingress
curl http://<EXTERNAL_IP>/api/health
```
## Step 4:React Frontend

### 4.1 Create React App
```bash
npx create-react-app frontend --template typescript
cd frontend
```
### 4.2 Dockerize React
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
### 4.3 Kubernetes Manifest & Deploy
```frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
        version: v2
    spec:
      imagePullSecrets:
        - name: frontend-acr-secret
      containers:
        - name: frontend
          image: mindxIntern07.azurecr.io/web:v1
          imagePullPolicy: Always
          ports:
            - containerPort: 80
```
```frontend-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  type: LoadBalancer
  selector:
    app: frontend
    version: v2
  ports:
    - port: 80
      targetPort: 80
```
### Update api-ingress:
```api-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: default
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
      -http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 3000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

```
### 4.4 Verify
Access http://<EXTERNAL_IP>/

## Step 5:Authentication with OpenID (id-dev.mindx.edu.vn)

### 5.1 Install Dependencies
```bash
npm install express axios jsonwebtoken jwks-rsa
```
### 5.2 Step Explaintion(Flow)
5.2.1 User clicks “Login” → triggers OpenID login flow on frontend.

5.2.2 Redirect to OpenID provider (https://id-dev.mindx.edu.vn) → user enters credentials.

5.2.3 Authorization code is returned to frontend callback URL.

5.2.4 Frontend exchanges code for ID token (JWT) → can be done via backend or directly in frontend (PKCE recommended).

5.2.5 Frontend stores ID token (sessionStorage / localStorage).

5.2.6 For protected API requests, frontend sends Authorization header with Bearer token:

5.2.7 Authorization: Bearer <ID_TOKEN>


5.2.8 Backend middleware (authenticateToken) verifies token signature using OpenID public keys (.well-known/jwks.json).

5.2.9 If valid, backend attaches decoded user info to req.user → route proceeds.

5.2.10 Backend responds with protected data.

## Step 6: HTTPS / Custom Domain

### 6.1 DNS Configuration

Add A/CNAME record pointing to ingress external IP

### 6.2 Install Cert-Manager
```bash
kubectl create namespace cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.crds.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml
kubectl get pods -n cert-manager
```

### 6.3 Create ClusterIssuer.yaml
```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-dns
spec:
  acme:
    email: dohuy2915@gmail.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-dns-key
    solvers:
    - dns01:
        cloudflare:
          email: dohuy2915@gmail.com
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
```
```bash
kubectl create secret generic cloudflare-api-token-secret \
  --from-literal=api-token='<YOUR_CLOUDFLARE_API_TOKEN>' \
  -n cert-manager
kubectl apply -f clusterissuer.yaml
```

### 6.4 Update api-ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-dns 
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - quanghuy-07.id.vn
      secretName: web-tls1
  rules:
    - host: quanghuy-07.id.vn
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 3000
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-service
                port:
                  number: 80

```

### 6.5 Verify certificate 
```bash
kubectl get certificate -n default
```


## Troubleshooting
-CORS Issues: Ensure backend Access-Control-Allow-Origin header matches frontend URL

-Port Conflicts: Check if local ports 3000 or 8080 are free

-Container Issues: Use docker logs <container-id> to debug
-OpenID / Authentication Issues: Verify client_id and redirect_uri match OpenID provider config.
-HTTPS / TLS Issues :Verify DNS A record points to Ingress external IP.

