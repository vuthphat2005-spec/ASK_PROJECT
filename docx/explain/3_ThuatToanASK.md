# 3. THUẬT TOÁN TÍNH ĐIỂM NĂNG LỰC (A.S.K) VÀ BIỂU ĐỒ RADAR

Chức năng quan trọng nhất của hệ thống TeamCollab là chấm điểm Năng lực Cá nhân và vẽ biểu đồ hình nhện (Radar Chart). Hệ thống sẽ bóc tách dữ liệu từ các bản ghi công việc hàng ngày và tự động quy ra 3 tham số cốt lõi: **K (Knowledge), A (Attitude), S (Skill)**.

## 3.1 Nguồn cấp dữ liệu cho K (Kiến thức / Chuyên môn)
- **Bản chất**: Kiến thức và chuyên môn được phản ánh qua việc nhân sự hoàn thành các task (MBO) có đạt chất lượng không.
- **Dữ liệu nguồn**: Bảng `muc_tieu_mbo`.
- **Cách tính**:
  Khi Quản lý tiến hành nghiệm thu một mục tiêu MBO (vào mục Đánh giá -> Nghiệm thu MBO), quản lý sẽ nhập điểm vào cột `diem_nghiem_thu` (0-100).
  Điểm K của một nhân sự là **Trung bình cộng của tất cả các `diem_nghiem_thu`** thuộc về nhân sự đó.
  *Ví dụ: User A có 3 MBO được nghiệm thu điểm lần lượt là 80, 90, 100 => Điểm K = (80+90+100) / 3 = 90.*

## 3.2 Nguồn cấp dữ liệu cho A (Thái độ) và S (Kỹ năng mềm)
- **Bản chất**: Thái độ và kỹ năng mềm không thể được đo đếm bằng task, mà phải được đo lường thông qua góc nhìn của đồng nghiệp (360 độ).
- **Dữ liệu nguồn**: Bảng `danh_gia_cheo` kết hợp với `tieu_chi_ask`.
- **Cách tính**:
  1. Đồng nghiệp vào mục Đánh giá 360 độ, chọn một nhân sự và chấm Sao (1-5 sao) cho các tiêu chí.
  2. Hệ thống quy đổi Sao sang Điểm số (Scale 100):
     - 1 sao = 20 điểm
     - 2 sao = 40 điểm
     ...
     - 5 sao = 100 điểm
  3. Dữ liệu được insert vào cột `diem_danh_gia`.
  4. Hệ thống quét qua tất cả dữ liệu đánh giá mà nhân sự đó NHẬN ĐƯỢC:
     - Các đánh giá mà `tieu_chi_ask.nhom` = 'Attitude' sẽ được cộng tổng và chia trung bình để ra **Điểm A**.
     - Các đánh giá mà `tieu_chi_ask.nhom` = 'Skill' sẽ được cộng tổng và chia trung bình để ra **Điểm S**.

## 3.3 Hiển thị trên Radar Chart
Biểu đồ Radar được vẽ bởi thư viện `recharts` trong React:
```javascript
const radarData = [
  { subject: "Knowledge (K)", A: kScore, fullMark: 100 },
  { subject: "Attitude (A)", A: aScore, fullMark: 100 },
  { subject: "Skill (S)", A: sScore, fullMark: 100 },
];
```
- Các tham số (K, A, S) được truyền vào 3 trục của biểu đồ đa giác. 
- Diện tích của đa giác được tô màu bằng Linear Gradient càng lớn, chứng tỏ nhân sự đó càng toàn diện. Mức tối đa (FullMark) của mỗi trục luôn là 100.
