const fs = require('fs');

// Load existing data
const content = fs.readFileSync('src/lib/textbookData.js', 'utf8');
const jsonMatch = content.match(/export const textbookData = ([\s\S]*);/);
let currentData = [];
if (jsonMatch) {
  try {
    currentData = JSON.parse(jsonMatch[1]);
  } catch (e) {
    console.error('JSON parse error:', e);
  }
}

// Generate Grade 8 Textbooks (Ngữ Văn 8 & Toán 8)
const nv8_t1_topics = [
  'Tôi đi học - Thanh Tịnh', 'Trong lòng mẹ - Nguyên Hồng', 'Lão Hạc - Nam Cao',
  'Tức nước vỡ bờ - Ngô Tất Tố', 'Chiếc lá cuối cùng - O. Henry', 'Hai cây phong - Ai-tơ-ma-tốp',
  'Thông tin về Ngày Trái Đất năm 2000', 'Ôn tập Giữa học kỳ 1 Ngữ Văn 8', 'Ôn dịch thuốc lá',
  'Bài toán dân số', 'Vào nhà ngục Quảng Đông cảm tác - Phan Bội Châu', 'Đập đá ở Côn Lôn - Phan Châu Trinh',
  'Muốn làm thằng Cuội - Tản Đà', 'Hai chữ nước nhà - Trần Tuấn Khải', 'Nhớ rừng - Thế Lữ',
  'Ông đồ - Vũ Đình Liên', 'Quê hương - Tế Hanh', 'Ôn tập Cuối học kỳ 1 Ngữ Văn 8'
];

const nv8_t2_topics = [
  'Khi con tu hú - Tố Hữu', 'Tức cảnh Pác Bó - Hồ Chí Minh', 'Ngắm trăng - Hồ Chí Minh',
  'Đi đường - Hồ Chí Minh', 'Chiếu dời đô - Lý Công Uẩn', 'Hịch tướng sĩ - Trần Quốc Tuấn',
  'Nước Đại Việt ta - Nguyễn Trãi', 'Bàn luận về phép học - Nguyễn Thiếp', 'Ôn tập Giữa học kỳ 2 Ngữ Văn 8',
  'Thuế máu - Nguyễn Ái Quốc', 'Đi bộ chu du - Rút-xô', 'Ông Giuốc-đanh mặc lễ phục - Mô-li-e',
  'Lựa chọn trật tự từ trong câu', 'Văn bản nghị luận xã hội', 'Văn bản thuyết minh danh lam thắng cảnh',
  'Ôn tập tổng hợp Ngữ Văn 8', 'Tổng kết môn Ngữ Văn Lớp 8'
];

const toan8_t1_topics = [
  'Đa thức và các phép toán đơn thức, đa thức', 'Hằng đẳng thức đáng nhớ (Bình phương một tổng, hiệu)',
  'Hằng đẳng thức đáng nhớ (Lập phương một tổng, hiệu)', 'Phân tích đa thức thành nhân tử bằng phương pháp đặt nhân tử chung',
  'Phân tích đa thức thành nhân tử bằng phương pháp dùng hằng đẳng thức', 'Phân thức đại số và tính chất cơ bản',
  'Cộng và trừ phân thức đại số', 'Nhân và chia phân thức đại số', 'Ôn tập Giữa học kỳ 1 Toán 8',
  'Tứ giác và Tổng các góc của một tứ giác', 'Hình thang, Hình thang cân', 'Đường trung bình của tam giác, của hình thang',
  'Hình bình hành và tính chất', 'Hình chữ nhật và tính chất', 'Hình thoi và tính chất',
  'Hình vuông và tính chất', 'Diện tích đa thức, hình chữ nhật, hình tam giác', 'Ôn tập Cuối học kỳ 1 Toán 8'
];

const toan8_t2_topics = [
  'Phương trình bậc nhất một ẩn ax + b = 0', 'Phương trình đưa được về dạng ax + b = 0',
  'Phương trình tích A(x).B(x) = 0', 'Phương trình chứa ẩn ở mẫu thức',
  'Giải bài toán bằng cách lập phương trình (Dạng chuyển động)', 'Giải bài toán bằng cách lập phương trình (Dạng năng suất, công việc)',
  'Bất phương trình bậc nhất một ẩn', 'Ôn tập Giữa học kỳ 2 Toán 8',
  'Định lý Ta-lét trong tam giác', 'Định lý đảo và hệ quả của định lý Ta-lét',
  'Tính chất đường phân giác của tam giác', 'Tam giác đồng dạng (Trường hợp C-C-C)',
  'Tam giác đồng dạng (Trường hợp C-G-C)', 'Tam giác đồng dạng (Trường hợp G-G)',
  'Hình hộp chữ nhật, Thể tích hình hộp chữ nhật', 'Hình lăng trụ đứng tam giác, tứ giác',
  'Ôn tập tổng hợp Toán 8'
];

function generateG8Lessons(startWeek, count, topics, subject) {
  const lessons = [];
  for (let i = 0; i < count; i++) {
    const w = startWeek + i;
    const topic = topics[i % topics.length];
    const isLit = subject === 'Ngữ Văn';

    lessons.push({
      id: `${isLit ? 'nv8' : 'toan8'}_w${w}`,
      week: w,
      title: `Bài ${w}: ${topic}`,
      content: isLit 
        ? `🌅 VĂN BẢN & BÀI HỌC\n\n"${topic.toUpperCase()}"\n\nTrong bài học Tuần ${w}, các em học sinh Lớp 8 cùng tìm hiểu tác phẩm / kiến thức: ${topic}.\n\n📖 NỘI DUNG CHÍNH\n• Tác giả / Hoàn cảnh sáng tác: Tác phẩm mang giá trị nhân văn sâu sắc, phản ánh tâm tư tình cảm và nhân sinh quan cao đẹp.\n• Giá trị nghệ thuật: Sử dụng ngôn từ tinh tế, hình ảnh giàu sức gợi, nhịp điệu uyển chuyển.\n\n---\n\n💬 EM HIỂU BÀI NHƯ THẾ NÀO?\n\n• Nội dung tư tưởng cốt lõi của bài học ${topic} là gì?\n• Những chi tiết nghệ thuật nào làm nổi bật chủ đề văn bản?\n• Ý nghĩa bài học đối với cuộc sống học sinh ngày nay?`
        : `📚 KIẾN THỨC TRỌNG TÂM TOÁN 8\n\n"${topic.toUpperCase()}"\n\n1️⃣ LÝ THUYẾT & CÔNG THỨC\n• Chủ đề Tuần ${w}: ${topic}\n• Nắm vững định nghĩa, tính chất, hằng đẳng thức và quy tắc biến đổi đại số / hình học Lớp 8.\n\n2️⃣ PHƯƠNG PHÁP GIẢI TOÁN\n• Phân tích đề bài, xác định điều kiện xác định (ĐKXĐ).\n• Vận dụng linh hoạt kiến thức để rút gọn, chứng minh hoặc giải phương trình.\n\n---\n\n💬 GHI NHỚ\n• Luôn kiểm tra điều kiện xác định và đối chiếu nghiệm sau khi tính toán.`,
      quizzes: [
        {
          question: isLit 
            ? `Nội dung cốt lõi của bài học "${topic}" (Tuần ${w}) là gì?`
            : `Kiến thức trọng tâm của bài Toán Lớp 8 Tuần ${w} (${topic}) là gì?`,
          options: [
            isLit ? `Thể hiện tinh thần nhân văn và giá trị tư tưởng của bài: ${topic}` : `Vận dụng lý thuyết và công thức: ${topic}`,
            'Không có ý nghĩa giáo dục',
            'Không cần học thuộc',
            'Chỉ là bài đọc giải trí'
          ],
          correctAnswer: 0,
          explanation: `✅ Rất tốt! Bài học Tuần ${w} giúp các em làm chủ kiến thức "${topic}".`
        },
        {
          question: isLit ? 'Yêu cầu khi phân tích một tác phẩm văn học Lớp 8 là gì?' : 'Khi giải bài tập Toán 8, thao tác nào quan trọng nhất?',
          options: [
            isLit ? 'Hiểu cả nội dung tư tưởng và giá trị nghệ thuật đặc sắc' : 'Đọc kỹ đề, xác định điều kiện và tính toán cẩn thận',
            'Chỉ chép lại tóm tắt',
            'Đoán mò kết quả',
            'Bỏ qua các câu hỏi luyện tập'
          ],
          correctAnswer: 0,
          explanation: '✅ Đúng rồi! Rèn luyện tư duy phân tích khoa học và chính xác!'
        },
        {
          question: isLit ? 'Thái độ học tập môn Ngữ Văn 8 tốt nhất là gì?' : 'Lợi ích của việc làm thành thạo bài tập Toán 8 là gì?',
          options: [
            isLit ? 'Chủ động đọc tác phẩm, cảm nhận và suy ngẫm sâu sắc' : 'Rèn tư duy logic, tính cẩn thận và sẵn sàng cho các kỳ thi',
            'Chờ thầy cô đọc chép',
            'Không cần soạn bài trước',
            'Học vẹt không cần hiểu'
          ],
          correctAnswer: 0,
          explanation: '✅ Tuyệt vời! Rèn luyện thói quen tự học và tư duy độc lập!'
        }
      ]
    });
  }
  return lessons;
}

const g8Textbooks = [
  {
    id: 'nv8_tap1',
    subject: 'Ngữ Văn 8',
    grade: 8,
    volume: 'Tập 1 (Tuần 1 - 18)',
    emoji: '📘',
    color: '#0284c7',
    stars: 10,
    lessons: generateG8Lessons(1, 18, nv8_t1_topics, 'Ngữ Văn')
  },
  {
    id: 'nv8_tap2',
    subject: 'Ngữ Văn 8',
    grade: 8,
    volume: 'Tập 2 (Tuần 19 - 35)',
    emoji: '📙',
    color: '#ea580c',
    stars: 10,
    lessons: generateG8Lessons(19, 17, nv8_t2_topics, 'Ngữ Văn')
  },
  {
    id: 'toan8_tap1',
    subject: 'Toán 8',
    grade: 8,
    volume: 'Tập 1 (Tuần 1 - 18)',
    emoji: '📐',
    color: '#7c3aed',
    stars: 10,
    lessons: generateG8Lessons(1, 18, toan8_t1_topics, 'Toán')
  },
  {
    id: 'toan8_tap2',
    subject: 'Toán 8',
    grade: 8,
    volume: 'Tập 2 (Tuần 19 - 35)',
    emoji: '📏',
    color: '#059669',
    stars: 10,
    lessons: generateG8Lessons(19, 17, toan8_t2_topics, 'Toán')
  }
];

const fullData = [...currentData, ...g8Textbooks];

const fileContent = `// Dữ liệu Sách Giáo Khoa Lớp 2 & Lớp 8 - Chương trình mới chuẩn 35 Tuần
export const textbookData = ${JSON.stringify(fullData, null, 2)};
`;

fs.writeFileSync('src/lib/textbookData.js', fileContent, 'utf8');
console.log(`Grade 8 curriculum integrated successfully! Total books in textbookData: ${fullData.length}`);
