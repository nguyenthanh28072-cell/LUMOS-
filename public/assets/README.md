# LUMOS assets v1

Các asset được xử lý trực tiếp từ key visual LUMOS bạn đã gửi.

## Files
- background_desktop.jpg — nền 16:9 cho desktop
- background_mobile.jpg — nền dọc cho mobile
- wand_glow.png — cây đũa + glow, nền trong suốt (tách tự động, có thể cần tinh chỉnh)
- light_burst.png — vùng ánh sáng đầu đũa, nền trong suốt
- particles.png — lớp hạt sáng, nền trong suốt
- source_reference.png — ảnh gốc để đối chiếu

## Gợi ý layer trong web
background
→ particles
→ wand_glow
→ light_burst
→ text LUMOS (render bằng HTML/CSS)

Lưu ý: wand_glow / particles / light_burst là bản tách tự động từ ảnh gốc, nên viền glow có thể còn một chút nền xanh/đen. Đây là bản v1 để dựng prototype; có thể tinh chỉnh mask thủ công sau khi xem trên web.
