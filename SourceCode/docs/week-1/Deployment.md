# Deployment Process Documentation  
**Azure + AKS Full-Stack Application**

---

## Step 1: API + Azure Container Registry (ACR)

### 1.1 Create Simple API

- Tech stack: **Node.js + TypeScript + Express**
- API endpoints:
  - `GET /api/health`
  - `GET /api/hello`
- Add scripts in `package.json`:
  - `build`
  - `start`

---

### 1.2 Dockerize Backend API

**Dockerfile**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 1.3 Create Azure Container Registry (ACR)
#### 1.3.1 Backend ACR

```bash
az acr create \
  --name backend \
  --resource-group mindx-intern-07-rg \
  --sku Basic

az acr login --name backend
```

### 1.4 Build & Push Backend Image


```bash
docker build -t backend.azurecr.io/api:v1 .

docker push backend.azurecr.io/api:v1
```
## Step 2: AKS Deployment (Backend)
 ### 2.1 Create AKS Cluster
```bash
az aks create \
  --name mindx-intern-cluster-AKS \
  --resource-group mindx-intern-07-rg \
  --node-count 1 \
  --generate-ssh-keys
  ```
 ### 2.2 Configure kubectl Access
```bash
az aks get-credentials \
  --name mindx-intern-cluster-AKS \
  --resource-group mindx-intern-07-rg

kubectl get nodes
```
 ### 2.3 Backend Kubernetes Manifest
backend-deployment.yaml

```yaml
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
```
backend-service.yaml

```yaml
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
 ### 2.4 Deploy Backend
```bash
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

kubectl get pods
kubectl get svc
```
 ### 2.5 Test Internal Access
```bash
kubectl port-forward svc/backend-service 3000:3000
curl http://localhost:3000/api/health
```

## Step 3: Ingress Controller (Nginx)
 ### 3.1 Install Nginx Ingress Controller
 ```bash
kubectl create namespace ingress-nginx

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```
 ### 3.2 Create Backend Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-service
                port:
                  number: 3000
```
 ### 3.3 Verify Ingress
```bash
kubectl get ingress
curl http://<INGRESS_EXTERNAL_IP>/api/health
```
## Step 4: React Frontend Deployment
 ### 4.1 Create React App
 ```bash
npx create-react-app frontend --template typescript
cd frontend
```
 ### 4.2 Dockerize Frontend
Dockerfile

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
Build & push image:

```bash
docker build -t frontend.azurecr.io/web:v1 .
docker push frontend.azurecr.io/web:v1
```
 ### 4.3 Frontend Kubernetes Manifest
```yaml
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
          image: frontend.azurecr.io/web:v1
          ports:
            - containerPort: 80
```            
```yaml
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
### 4.4 Update Ingress (Frontend + Backend)
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
spec:
  rules:
    - http:
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
### 4.5 Verify Deployment
```bash
kubectl get pods
kubectl get svc
kubectl get ingress
Access:
http://<INGRESS_EXTERNAL_IP>/
```
## Step 5: HTTPS & Custom Domain (Production)
### 5.1 DNS Configuration
Add A / CNAME record

Point domain → Ingress External IP

### 5.2 Install cert-manager
```bash
kubectl create namespace cert-manager

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.crds.yaml
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

kubectl get pods -n cert-manager
```
### 5.3 Create ClusterIssuer (DNS-01 – Cloudflare)
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
### 5.4 Update Ingress with TLS
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
### 5.5 Verify HTTPS
```bash
kubectl get certificate
kubectl describe certificate web-tls1
```