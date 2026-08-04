-- =====================================================================
--  MIGRATION: cho phép bố mẹ giao thẳng BÀI HỌC TRONG APP
-- =====================================================================
--
--  VÌ SAO CẦN:
--  Ba khu nội dung của app (📚 Góc đọc sách, 🧮 Toán tư duy, 🌍 Khám phá)
--  đều khoá bài: con chỉ mở được một bài khi bố mẹ ĐÃ GIAO bài đó VÀ con
--  đã học xong bài liền trước. Trước đây cách duy nhất để "giao" là bố mẹ
--  tự gõ một nhiệm vụ có tiêu đề chứa đúng nguyên văn tên bài — với hơn 50
--  chủ đề/truyện thì gần như không ai làm nổi, nên phần lớn nội dung nằm
--  sau ổ khoá vĩnh viễn.
--
--  Hai cột dưới đây cho phép một hàng `tasks` trỏ thẳng vào nội dung:
--    task_type   null      -> nhiệm vụ đời thường (việc nhà, tự lập...)
--                'book'    -> bài trong khu Góc đọc sách
--                'math'    -> chủ đề Toán tư duy
--                'explore' -> chủ đề Khám phá thế giới
--    content_ref null      -> mở CẢ KHU, con tự học lần lượt
--                '<id>'    -> mở đúng một bài (id của truyện/chủ đề)
--
--  CỐ Ý KHÔNG ĐẶT CHECK cho task_type: sau này thêm khu nội dung mới sẽ
--  không phải chạy migration nữa, và một giá trị lạ chỉ đơn giản là không
--  mở khoá được gì cả — vô hại, không làm hỏng dữ liệu.
--
--  CÁCH CHẠY: dán toàn bộ file này vào SQL Editor của Supabase rồi Run.
--  Chạy lại nhiều lần vẫn an toàn.
-- =====================================================================

alter table tasks add column if not exists task_type   text;
alter table tasks add column if not exists content_ref text;

-- Luật khoá bài luôn hỏi theo (bé nào, khu nào) nên đánh chỉ mục đúng cặp đó.
create index if not exists tasks_child_type_idx on tasks (child_id, task_type);

-- Kiểm tra nhanh sau khi chạy (phải thấy đủ task_type và content_ref):
--   select column_name, data_type
--   from information_schema.columns
--   where table_name = 'tasks'
--   order by ordinal_position;
