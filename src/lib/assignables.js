// Danh mục các KHU NỘI DUNG bố mẹ có thể giao cho con.
//
// VÌ SAO CẦN MỘT NGUỒN SỰ THẬT DUY NHẤT:
// Trước đây mô tả của từng khu (tiền tố id ảo, nhãn hiển thị, tên môn ghi vào
// lịch sử học) nằm rải rác bên trong App.jsx — có chỗ hardcode 'book-', có chỗ
// hardcode 'explore'. Giao diện bố mẹ và luật khoá bài phía con vì thế rất dễ
// lệch nhau: chỉ cần một bên đổi nhãn là bên kia mở khoá sai. Gom hết vào đây
// để "giao bài" và "mở khoá bài" luôn đọc cùng một bộ dữ liệu.

import { booksData } from './booksData'
import { mathData } from './mathData'
import { exploreData } from './exploreData'

/**
 * kind        giá trị ghi vào tasks.task_type và learning_sessions.kind
 * prefix      tiền tố của id ảo trong completions.task_id
 * icon/label  hiển thị cho bố mẹ và con
 * subject     tên môn mặc định khi ghi lịch sử học
 * data        { kids: [...], teens: [...] } — mỗi phần tử có { id, title, emoji, stars }
 * tab         tên tab của con để điều hướng tới
 * redoIcon    emoji dùng khi con ôn lại bài cũ
 * note        lời ghi vào completions.child_note
 */
export const LEARNING_AREAS = {
  book: {
    kind: 'book',
    prefix: 'book-',
    icon: '📚',
    label: 'Góc đọc sách',
    subject: 'Đọc sách',
    data: booksData,
    tab: 'books',
    redoIcon: '📖',
    note: (title) => `Bé đã đọc xong và trả lời đúng câu hỏi của bài: ${title}`,
  },
  math: {
    kind: 'math',
    prefix: 'math-',
    icon: '🧮',
    label: 'Toán tư duy',
    subject: 'Toán tư duy',
    data: mathData,
    tab: 'math',
    redoIcon: '🧮',
    note: (title) => `Bé đã hoàn thành học toán tư duy và trả lời đúng các thử thách của chủ đề: ${title}`,
  },
  explore: {
    kind: 'explore',
    prefix: 'explore-',
    icon: '🌍',
    label: 'Khám phá',
    subject: 'Khám phá thế giới',
    data: exploreData,
    tab: 'explore',
    redoIcon: '🌍',
    note: (title) => `Bé đã khám phá xong chủ đề kiến thức: ${title}`,
  },
}

// Thứ tự hiện trong giao diện giao bài của bố mẹ (nhẹ nhất -> nặng nhất).
export const AREA_ORDER = ['book', 'math', 'explore']

/**
 * Danh sách bài của một khu theo nhóm tuổi.
 *
 * THỨ TỰ MẢNG CHÍNH LÀ THỨ TỰ MỞ KHOÁ của con, nên tuyệt đối không sắp xếp lại
 * ở đây: mọi thay đổi thứ tự sẽ làm xáo trộn tiến độ các bé đang học giữa dở.
 */
export function areaItems(kind, ageGroup) {
  return LEARNING_AREAS[kind]?.data?.[ageGroup] || []
}

/** Nhãn ngắn cho một nhiệm vụ trỏ vào nội dung, ví dụ "🌍 Khám phá". */
export function areaBadge(kind) {
  const area = LEARNING_AREAS[kind]
  return area ? `${area.icon} ${area.label}` : ''
}
