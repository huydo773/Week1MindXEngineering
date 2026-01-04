# Metrics Documentation

## Overview

This document describes how to **access** and **interpret** both **production metrics** and **product metrics** for the application.  
The goal is to help developers and stakeholders monitor system health, performance, and user behavior effectively.

---

## 1. Production Metrics (Azure Application Insights)

### 1.1 How to Access Production Metrics

1. Go to **Azure Portal**
2. Select the correct **Resource Group**
3. Open **Application Insights**
4. Use the following sections:
   - **Failures**
   - **Performance**
   - **Logs**
   - **Availability**

---

### 1.2 Key Production Metrics & Interpretation

#### HTTP Status Codes
| Status Code | Meaning | Interpretation |
|------------|--------|---------------|
| 200 | OK | Request processed successfully |
| 304 | Not Modified | Cache hit, not an error |
| 404 | Not Found | Invalid route or missing resource (alert configured) |
| 5xx | Server Error | Backend failure, critical issue |

#### Performance Metrics
- **Response Time**
  - < 500ms → Healthy
  - 500ms – 2s → Acceptable
  - > 2s → Performance issue
- **Dependency Duration**
  - High values may indicate database or external service issues

#### Errors & Logs
- **Exceptions** indicate unhandled errors in backend logic
- **Trace logs** help debug request flows
- **Custom logs** can be queried using KQL

---

### 1.3 Alerts Configuration

- Alert on **HTTP 404 spike**
- Alert on **HTTP 5xx errors**
- Alert when **average response time exceeds threshold**
- Alert when **availability check fails**

These alerts help detect incidents early and reduce downtime.

---

## 2. Product Metrics (Google Analytics – GA4)

### 2.1 How to Access Product Metrics

1. Go to **Google Analytics**
2. Select the correct **GA4 Property**
3. Navigate to:
   - **Realtime**
   - **Engagement**
   - **Events**
   - **Conversions**

---

### 2.2 Key Product Metrics & Interpretation

#### User Metrics
- **Active Users**
  - Indicates real user traffic
- **New vs Returning Users**
  - Measures user retention

#### Engagement Metrics
- **Engagement Rate**
  - High → users find value
  - Low → UX or content issue
- **Average Engagement Time**
  - Indicates how long users stay on the app

#### Event Metrics
- **Key Events**
  - Login Click
  - Login Success
  - Logout
- Used to analyze user behavior flow

#### Conversion Metrics
- High event count but low conversion → funnel drop-off
- Used to identify business and UX problems

---

## 3. Summary

- **Production Metrics** focus on system stability, performance, and errors
- **Product Metrics** focus on user behavior and business value
- Both metrics together provide a complete view of application health

This documentation ensures that all team members can easily access and correctly interpret application metrics.
