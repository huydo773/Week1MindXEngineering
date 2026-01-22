# 🔹 Week 4 – Data Analysis Report

## 1. Overview

This analysis is based on a dataset of **131 helpdesk tickets** imported from a sample ticket data file into the Odoo Helpdesk system
Since the data is imported for practice purposes, certain limitations are acknowledged, such as a high volume of tickets created within a short period and the absence of assignment information.

The analysis focuses on:
- Identifying recurring patterns
- Analyzing ticket distribution by status and priority
- Grouping issues based on **ticket titles**
- Assessing the overall impact of recurring issues

## 2. Ticket Summary Analysis(Week 4)

### 2.1 Total Tickets
- **Total number of tickets:** 131

### 2.2 Ticket Distribution by Stage In week-4

| Stage         | Number of Tickets | Percentage |
|---------------|-------------------|------------|
| New           | 100               | ~76%       |
| In Progress   | 15                | ~11%       |
| On Hold       | 16                | ~12%       |
| **Total**     | **131**           | 100%       |

**Analysis:**
- The majority of tickets remain in the **New** status, indicating a large backlog.
- This distribution reflects the nature of imported sample data rather than real operational performance.
- However, it still provides useful insight into ticket volume and workload.

### 2.3 Ticket Distribution by Priority

| Priority        | Number of Tickets | Percentage |
|-----------------|-------------------|------------|
| Low             | 40                | ~31%       |
| Medium          | 9                 | ~7%        |
| High            | 42                | ~32%       |
| Urgent          | 40                | ~31%       |
| **Total**       | **131**           | 100%       |

**Analysis:**
- **High and Urgent tickets account for approximately 63%** of all tickets.
- This suggests that most reported issues are considered to have significant operational impact.

## 3. Category and Issue Analysis(Week 4)

### 3.1 Category Analysis

Since no official Category field is configured in the system, tickets are analyzed based on **tags and content grouping**.

| Category / Issue Group | Number of Tickets |
|------------------------|-------------------|
| Unspecified            | 64                |
| CRM                    | 25                |
| LMS                    | 20                |
| TMS                    | 9                 |
| Email-related issues   | 5                 |
| General Bugs           | 5                 |
| Others                 | 3–4               |

**Analysis:**
- Nearly **49% of tickets are uncategorized**, indicating a lack of standardization during ticket creation.
- **CRM, LMS, and TMS** are the systems generating the highest number of issues.
- These systems are critical to daily operations, increasing their overall impact.


### 3.2 Recurring Issues (Based on Ticket Titles)

Recurring patterns were identified by analyzing ticket titles.

#### 🔹 Top recurring issues

1. **Tech Test**
   - **Number of tickets:** 3
   - Description:
     - Tickets related to technical testing, test scenarios, or test emails.
   - Observation:
     - Although not production issues, these tickets increase overall ticket volume and should be filtered or separated from operational tickets.

2. **Unable to Create Dropout Ticket (BU PXL I)**
   - **Number of tickets:** 2
   - Example titles:
     - “BU PXL I KHÔNG TẠO ĐƯỢC PHIẾU DROPOUT”
   - Impact:
     - Directly affects student management and administrative processes.
   - Possible cause:
     - System validation errors or permission-related issues.

3. **CRM Call Function Not Working**
   - **Number of tickets:** 2
   - Example titles:
     - “CRM không bấm gọi được”
   - Impact:
     - Affects sales and customer communication.
   - Severity:
     - High operational impact due to interruption of daily CRM activities.

**Conclusion:**
> The most frequent issues are related to system functionality (CRM, Dropout process) and internal testing activities, indicating a need for better separation between test and production tickets.

## 4. Pattern and Trend Analysis(January)

### 4.1 Recurring Patterns
- Many tickets describe the same issue using different wording.
- This indicates:
  - Inconsistent ticket titles
  - Lack of structured ticket submission guidelines

### 4.2 Trend Analysis

#### 4.2.1 Ticket Volume Trend Over Time

| Period  | Number of Tickets |
|--------|-------------------|
| Feb 2026 (T2 2026) | 4 |
| Mar 2026 (T3 2026) | 4 |
| Apr 2026 (T4 2026) | 131 |
| **Total** | **139** |

**Analysis:**
- There is a **significant spike in April 2026**, accounting for more than **94% of total tickets**.
- February and March show very low ticket volumes compared to April.

#### 4.2.2 Response Time Trend

Response-related metrics are only available for **March 2026 (T3 2026)**:

| Metric | Value (hours) |
|------|---------------|
| Time to first response | 0.12 |
| Average response time | 0.12 |
| Time to close | 0.44 |

**Analysis:**
- The response time values are very low, indicating fast system responses.
- However, these metrics are only recorded for a **small dataset (4 tickets)**.

## 5. Key Findings

- 76% of tickets remain in the New status
- 63% of tickets are classified as High or Urgent
- CRM, LMS, and TMS generate the highest number of tickets
- Tech test, dropout, and CRM issues are highly repetitive
- Ticket categorization and title standardization are insufficient

## 6. Recommendations

1. **Standardize Categories or Tags**
   - Require category selection during ticket creation
   - Reduce the number of uncategorized tickets

2. **Standardize Ticket Titles**
   - Use a structured format such as:  
     `[System] – [Issue Type]`

3. **Develop a Knowledge Base**
   - Tech test guidelines and testing procedures
   - Dropout ticket creation issues and resolution steps
   - CRM call functionality troubleshooting and known issues

4. **Shift from Reactive to Preventive Support**
   - Address root causes in core systems
   - Reduce the number of High and Urgent tickets

