// Giọng điệu & giao diện theo độ tuổi.
//
// VÌ SAO CẦN FILE NÀY:
// App được thiết kế cho trẻ tiểu học: xưng "bé", chú cú 🦉 nói chuyện, pháo
// hoa nổ liên tục, phần thưởng kiểu "Phiếu được Bố Mẹ cõng đi dạo".
// Một bạn lớp 8 (13-14 tuổi) sẽ thấy bị coi là trẻ con và bỏ app sau vài ngày —
// không phải vì nhàm chán mà vì chạm vào lòng tự trọng ở tuổi đó.
//
// Giải pháp không phải làm app thứ hai, mà đổi GIỌNG và GIẢM hiệu ứng theo khối
// lớp. Nội dung học và cơ chế sao giữ nguyên.

export const TEEN_GRADE_THRESHOLD = 6

export function isTeenGrade(grade) {
  return (Number(grade) || 2) >= TEEN_GRADE_THRESHOLD
}

// Trẻ tiểu học (lớp 1-5): rực rỡ, nhiều hiệu ứng, xưng "bé"
const KID_TONE = {
  isTeen: false,
  you: 'Bé',
  youLower: 'bé',
  celebrate: true,   // bật pháo hoa confetti
  mascot: true,      // hiện chú cú dẫn dắt
  bodyClass: '',

  headerPrefix: 'Bé: ',
  headerSuffix: ' 🌟',

  tabs: {
    plan: '📅 Hôm nay',
    tasks: '🎯 Nhiệm vụ',
    books: '📚 Đọc sách',
    math: '🧮 Toán vui',
    sgk: '📗 Học SGK',
    review: '🧩 Ôn tập',
    badges: '🏅 Huy hiệu',
    arcade: '🎮 Khu Game',
    shop: '🎁 Đổi quà',
    history: '📖 Nhật ký',
  },

  quizIntro: 'Bé chọn đáp án rồi bấm Kiểm tra nhé! ✨',
  quizWrong: 'Không sao! Bé đọc lại câu hỏi rồi thử lần nữa nhé! 💪',
  readingGate: (s) => `⏳ Bé đọc kỹ bài nhé (còn ${s}s)`,
  readingReady: '🧩 Bắt đầu trắc nghiệm!',
  shopTitle: '🎁 Cửa Hàng Đổi Quà Của Bé',
  reviewTitle: '🧩 Bài cần ôn lại hôm nay',
  reviewIntro: 'Đây là những bài bé còn chưa chắc. Ôn lại một lượt để nhớ thật lâu nhé!',
}

// Tuổi teen (lớp 6+): điềm đạm, tôn trọng, xưng "con", bỏ hiệu ứng trẻ con
const TEEN_TONE = {
  isTeen: true,
  you: 'Con',
  youLower: 'con',
  celebrate: false,
  mascot: false,
  bodyClass: 'teen-mode',

  headerPrefix: '',
  headerSuffix: '',

  tabs: {
    plan: 'Hôm nay',
    tasks: 'Nhiệm vụ',
    books: 'Kỹ năng',
    math: 'Tư duy',
    sgk: 'Bài học',
    review: 'Ôn tập',
    badges: 'Thành tích',
    arcade: 'Giải lao',
    shop: 'Đổi thưởng',
    history: 'Tiến độ',
  },

  quizIntro: 'Chọn đáp án rồi bấm Kiểm tra.',
  quizWrong: 'Chưa đúng. Đọc lại đề và cân nhắc phương án khác.',
  readingGate: (s) => `Đọc kỹ đề trước đã (còn ${s}s)`,
  readingReady: 'Bắt đầu làm bài',
  shopTitle: 'Đổi thưởng',
  reviewTitle: 'Cần ôn lại',
  reviewIntro: 'Những nội dung con còn chưa vững, dựa trên kết quả các lần làm bài trước.',
}

export function getTone(grade) {
  return isTeenGrade(grade) ? TEEN_TONE : KID_TONE
}

/**
 * Phần thưởng đổi trục theo tuổi: trẻ nhỏ thích quà và sự chiều chuộng,
 * tuổi teen coi trọng QUYỀN TỰ CHỦ và được tin tưởng hơn nhiều.
 * Dùng làm gợi ý dựng sẵn cho bố mẹ khi tạo cửa hàng quà.
 */
export const REWARD_SUGGESTIONS = {
  kid: [
    { title: 'Được chọn món ăn tối nay cho cả nhà', emoji: '🍚', cost: 25 },
    { title: 'Được xem hoạt hình thêm 30 phút', emoji: '📺', cost: 30 },
    { title: 'Được Bố/Mẹ chở đi công viên cuối tuần', emoji: '🚲', cost: 30 },
    { title: 'Được ngủ trễ 20 phút tối Thứ 7', emoji: '🌙', cost: 40 },
    { title: 'Phiếu miễn 1 việc nhà tự chọn', emoji: '🎟️', cost: 50 },
    { title: 'Cuối tuần cả nhà về quê thăm Ông Bà', emoji: '👵', cost: 50 },
  ],
  teen: [
    { title: 'Tự quyết định giờ học trong tuần, bố mẹ không nhắc', emoji: '🕐', cost: 40 },
    { title: 'Được đi chơi với bạn buổi chiều cuối tuần', emoji: '🛹', cost: 50 },
    { title: 'Tự chọn hoạt động cho cả nhà vào Chủ nhật', emoji: '🗺️', cost: 45 },
    { title: 'Thêm 1 tiếng dùng máy tính/điện thoại tự do', emoji: '💻', cost: 35 },
    { title: 'Được giữ tiền tiêu vặt tự quản lý cả tháng', emoji: '💰', cost: 80 },
    { title: 'Một buổi không bị hỏi bài, bố mẹ hoàn toàn tin tưởng', emoji: '🤝', cost: 60 },
  ],
}
