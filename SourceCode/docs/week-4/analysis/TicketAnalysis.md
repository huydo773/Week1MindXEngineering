# 🔹 Week 4 – Data Analysis Report

## 1. Overview

Phân tích này được thực hiện dựa trên tập dữ liệu gồm 131 ticket helpdesk, được import từ file dữ liệu mẫu vào hệ thống Odoo Helpdesk.

**Phân tích tập trung vào:**
- Xác định các mô hình/lỗi lặp lại
- Phân tích sự phân bổ ticket theo trạng thái và mức độ ưu tiên
- Nhóm các issue dựa trên **tiêu đề ticket**
- Đánh giá mức độ ảnh hưởng tổng thể của các issue lặp lại

## 2. Ticket Summary Analysis

### 2.1 Total Tickets
- **Tổng số ticket:** 131

### 2.2 Ticket Distribution by Stage

| Giai đoạn     | Số lượng ticket   | Phần trăm  |
|---------------|-------------------|------------|
| New           | 100               | ~76%       |
| In Progress   | 15                | ~11%       |
| On Hold       | 16                | ~12%       |
| **Tổng**      | **131**           | 100%       |

**Phân tích:**
- Phần lớn ticket vẫn đang ở trạng thái **New**, cho thấy tồn đọng (backlog) lớn.
- Phân bổ này phản ánh đặc thù của dữ liệu mẫu được import, chưa thể hiện đầy đủ hiệu suất vận hành thực tế.
- Tuy nhiên, dữ liệu vẫn cung cấp cái nhìn hữu ích về khối lượng ticket và mức độ tải công việc.

### 2.3 Ticket Distribution by Priority

| Độ ưu tiên      | Số lượng Ticket   | Phần trăm  |
|-----------------|-------------------|------------|
| Low             | 40                | ~31%       |
| Medium          | 9                 | ~7%        |
| High            | 42                | ~32%       |
| Urgent          | 40                | ~31%       |
| **Tổng**        | **131**           | 100%       |

**Phân tích:**
- **Ticket mức độ High và Urgent chiếm khoảng 63%** tổng số ticket.
- Điều này cho thấy phần lớn các issue được báo cáo đều có **ảnh hưởng đáng kể đến hoạt động vận hành**.


## 3. Category and Issue Analysis

### 3.1 Category Analysis

Do hệ thống chưa được cấu hình trường Category chính thức, các ticket được phân tích dựa trên tags và việc nhóm nội dung.

| Category / Issue       |  Số lượng  Ticket |
|------------------------|-------------------|
| Unspecified            | 64                |
| CRM                    | 25                |
| LMS                    | 20                |
| TMS                    | 9                 |
| Email-related issues   | 5                 |
| General Bugs           | 5                 |
| Others                 | 3–4               |

**Phân tích:**
- Gần **49% ticket chưa được phân loại**, cho thấy việc tạo ticket còn thiếu chuẩn hóa.
- **CRM, LMS và TMS** là các hệ thống phát sinh nhiều issue nhất.
- Đây đều là các hệ thống cốt lõi trong vận hành hằng ngày, do đó các issue liên quan có **mức độ ảnh hưởng tổng thể cao**.


### 3.2 Issue lặp lại

#### 🔹 Các issue lặp lại nhiều nhất & Kế hoạch hành động

 1. **Tech Test**

- **Số lượng ticket:** 3
- **Mô tả:**
  - Các ticket liên quan đến test kỹ thuật, test kịch bản hoặc email test.
- **Đánh giá tác động:**
  - Không ảnh hưởng trực tiếp đến production
  - Tuy nhiên làm tăng số lượng ticket, gây nhiễu dữ liệu báo cáo

- **Root cause(Giả định):**
  - Chưa tách biệt rõ giữa ticket test và ticket vận hành thực tế

- **Action đề xuất:**
  - Tạo tag riêng cho ticket test (ví dụ: `[TEST]`)
  - Loại trừ ticket test khỏi các dashboard phân tích vận hành

- **Owner:** Helpdesk Admin  
- **Timeline:** 1–2 ngày  
- **Ưu tiên:** Trung bình (dễ làm, effort thấp)

2. **Không tạo được phiếu Dropout (BU PXL I)**

- **Số lượng ticket:** 2
- **Ví dụ tiêu đề:**
  - “BU PXL I KHÔNG TẠO ĐƯỢC PHIẾU DROPOUT”

- **Đánh giá tác động:**
  - Ảnh hưởng trực tiếp đến quy trình quản lý sinh viên
  - Gây gián đoạn công việc hành chính và đào tạo

- **Root cause (giả định):**
  - Lỗi validate dữ liệu khi tạo phiếu Dropout  
  - Hoặc phân quyền chưa đúng cho role BU PXL I

- **Action đề xuất:**
  - Rà soát logic validate của chức năng tạo Dropout
  - Kiểm tra và chuẩn hóa phân quyền cho các role liên quan

- **Owner:** LMS Team  
- **Timeline:** 5–7 ngày  
- **Ưu tiên:** Cao (impact trực tiếp đến vận hành)

 3. **Chức năng gọi điện trên CRM không hoạt động**

- **Số lượng ticket:** 2
- **Ví dụ tiêu đề:**
  - “CRM không bấm gọi được”

- **Đánh giá tác động:**
  - Nhân viên sales không thể liên hệ khách hàng
  - Ảnh hưởng trực tiếp đến hoạt động kinh doanh

- **Root cause (giả định):**
  - Lỗi tích hợp dịch vụ gọi điện (call service)
  - Hoặc thiếu cấu hình/quyền sử dụng chức năng gọi

- **Action đề xuất:**
  - Kiểm tra lại cấu hình tích hợp call service
  - Xác minh quyền gọi của các user CRM

- **Owner:** CRM Team  
- **Timeline:** 3–5 ngày  
- **Ưu tiên:** Rất cao (impact lớn, cần xử lý sớm)

### 🔍 Ưu tiên xử lý dựa trên Impact (ICE Framework – rút gọn)

| Issue | Impact | Effort | Ưu tiên |
|------|--------|--------|--------|
| CRM không gọi được | Cao | Trung bình | ⭐ 1 |
| Dropout không tạo được | Cao | Trung bình | ⭐ 2 |
| Ticket Tech Test | Thấp | Thấp | ⭐ 3 |

**Kết luận:**
> Các issue lặp lại nhiều nhất chủ yếu liên quan đến **chức năng hệ thống cốt lõi (CRM, LMS)** và **quy trình test nội bộ**.  
> Việc ưu tiên xử lý các issue có impact cao trước sẽ giúp cải thiện hiệu quả vận hành và giảm số lượng ticket mức độ High/Urgent.


## 4.Phân tích SLA – First Response Time (Giả định)

### 4.1 Hiện trạng

Hiện tại hệ thống **chưa có chính sách SLA (Service Level Agreement) chính thức** cho chỉ số *First Response Time*.  
Do đó, dữ liệu trong phần này **không phản ánh tình hình vận hành thực tế**, mà được xây dựng dưới dạng **giả định (assumption)** nhằm:
- Thực hành kỹ năng phân tích và đánh giá SLA
- Mô phỏng phương pháp đo lường hiệu quả phản hồi ticket
- Đề xuất định hướng cải thiện cho giai đoạn triển khai thực tế trong tương lai

### 4.2 Giả định SLA được sử dụng

Trong phạm vi báo cáo này, SLA *First Response Time* được **giả định** như sau:

- **SLA First Response:** Phản hồi đầu tiên cho khách hàng trong **≤ 30 phút**
- **Phạm vi áp dụng:** Tất cả ticket trong **giờ làm việc**

### 4.3 Kết quả phân tích (giả định)

Dựa trên tập dữ liệu ticket mẫu, kết quả phân tích SLA First Response Time như sau:

- **Tỷ lệ ticket đạt SLA First Response:** ~ **72%**
- **Tỷ lệ ticket vi phạm SLA:** ~ **28%**

**Nhận định:**

- Phần lớn ticket được phản hồi trong thời gian chấp nhận được theo SLA giả định
- Tuy nhiên, vẫn tồn tại một tỷ lệ đáng kể ticket vi phạm SLA, cho thấy tiềm năng cải thiện nếu hệ thống được vận hành trong môi trường thực tế

### 4.4 Đề xuất cải thiện (định hướng)

- Xây dựng chính sách SLA First Response chính thức (ví dụ: 15–30 phút)
- Thiết lập cơ chế cảnh báo khi ticket có nguy cơ vi phạm SLA
- Phân loại ticket theo mức độ ưu tiên (priority) để tối ưu thời gian phản hồi
- Theo dõi SLA theo từng nhóm hoặc cá nhân để phục vụ đánh giá hiệu suất


## 5. Kết luận

- **76% ticket** vẫn đang ở trạng thái **New**, cho thấy phần lớn ticket chưa được xử lý hoặc phân công.
- **63% ticket** được phân loại ở mức **High** hoặc **Urgent**, phản ánh mức độ ưu tiên cao trong các yêu cầu hỗ trợ.
- Các hệ thống **CRM, LMS và TMS** là nguồn phát sinh ticket nhiều nhất.
- Các vấn đề liên quan đến **tech test, dropout và CRM** xuất hiện lặp đi lặp lại với tần suất cao.
- **Chưa có chính sách SLA First Response chính thức**; phân tích SLA trong báo cáo được xây dựng dựa trên **giả định**, với khoảng **72% ticket đạt SLA** và **28% ticket vi phạm SLA**, cho thấy tiềm năng cải thiện rõ rệt khi hệ thống được vận hành thực tế.





