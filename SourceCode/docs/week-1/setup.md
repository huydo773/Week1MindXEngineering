# Environment & Dependency Setup  
**MindX Engineer Onboarding – Week 1**  
**Monorepo (API + Web) – AKS – No Helm**

---

## 1. Objectives

This document provides a **complete guide to setting up the development and deployment environment** for Week 1, including:

- Backend API (Node.js + Express + TypeScript)
- Frontend Web App (React + TypeScript)
- Docker & Azure Container Registry (ACR)
- Azure Kubernetes Service (AKS)
- NGINX Ingress (raw YAML, no Helm)
- HTTPS via Cloudflare
- Dependency management (`node_modules`)

After completing this setup, developers will be able to:
- Run the project locally
- Build and push Docker images
- Deploy a full-stack application to AKS
- Fully complete all Week 1 objectives

---

## 2. System Requirements

### 2.1 Operating System
- Windows 10/11 (PowerShell or WSL2)
- macOS
- Linux (Ubuntu 20.04+)

### 2.2 Minimum Hardware

| Component | Requirement |
|---------|------------|
| CPU | 4 cores |
| RAM | ≥ 8GB |
| Disk | ≥ 20GB free |

---

## 3. Required Tools

### 3.1 Git

```bash
git --version
```

---

### 3.2 Node.js & npm

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 LTS |
| npm | ≥ 9 |

```bash
node -v
npm -v
```

---

### 3.3 Docker

```bash
docker --version
docker ps
```

> ⚠️ Docker daemon must be running

---

### 3.4 Azure CLI

```bash
az version
az login
az account show
```

🔧 **Sys Admin Check**
- `subscriptionId` must be visible
- If not, request **Contributor** access

---

### 3.5 kubectl

```bash
kubectl version --client
```

Install kubectl:

```bash
az aks install-cli
```

---

## 4. Azure Access & Permissions

### 4.1 Azure Subscription

**Required role**
- Contributor (or higher)

Permission test:

```bash
az group create --name test-rg --location eastus
```

---

### 4.2 Azure Container Registry (ACR)

```bash
az acr list
az acr login --name <acr-name>
```

---

### 4.3 AKS Access

```bash
az aks get-credentials \
  --resource-group <rg> \
  --name <aks-name>

kubectl get nodes
```

---

## 5. Git Ignore (MANDATORY)

```gitignore
node_modules/
.env
dist
build
```

---

## 6. Backend API – Node.js / Express / TypeScript

### 6.1 Initialization

```bash
cd apps/api
npm init -y
```

---

### 6.2 Runtime Dependencies

```bash
npm install express cors dotenv jsonwebtoken
```

---

### 6.3 Development Dependencies

```bash
npm install -D \
  typescript ts-node nodemon \
  @types/node @types/express @types/cors @types/jsonwebtoken
```

---

### 6.4 API Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

---

### 6.5 Health Check Endpoint

```ts
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});
```

---

## 7. Frontend – React + TypeScript (Vite)

### 7.1 Create Project

```bash
cd apps
npx create-react-app web --template typescript
cd web
npm install
```

---

### 8.2 Runtime Dependencies

```bash
npm install axios react-router-dom
```

---


---

## 9. Installing Dependencies After Cloning

```bash
git clone <repo>
cd repo-root

cd apps/api && npm install
cd ../web && npm install
```

---

## 10. Docker & node_modules

### 10.1 Rules

- ❌ Do NOT commit `node_modules`
- ❌ Do NOT copy `node_modules` from local machine
- ✅ Run `npm install` inside Dockerfile

---

### 10.2 Dockerfile Pattern

```dockerfile
COPY package*.json ./
RUN npm install --production
COPY . .
```

---

## 11. NGINX Ingress

```bash
kubectl create namespace ingress-nginx
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml
```

---

## 12. HTTPS with Cloudflare

- DNS **A record** → Ingress External IP
- Enable **Proxy (Orange Cloud)**
- SSL Mode: **Full (Strict)**

➡️ Ingress uses internal HTTP, Cloudflare handles HTTPS termination
