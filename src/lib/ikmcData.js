// Kho đề thi Toán Quốc tế Kangaroo (IKMC) các năm từ 2020 đến 2024
// Đáp án chuẩn 5 lựa chọn A, B, C, D, E với giải thích chi tiết

export const ikmcData = [
  {
    year: 2024,
    title: 'Đề thi IKMC 2024 - Level 2 (Lớp 3 & 4)',
    level: 'Level 2',
    totalQuestions: 24,
    timeLimitMinutes: 45,
    badge: 'MỚI NHẤT 2024',
    quizzes: [
      {
        id: 'ikmc_2024_1',
        question: 'Một hình chữ nhật ABCD được chia thành 4 hình chữ nhật nhỏ. Chu vi của ba trong bốn hình chữ nhật nhỏ là 11 cm, 16 cm và 19 cm. Biết rằng chu vi của hình chữ nhật còn lại không phải nhỏ nhất cũng không phải lớn nhất. Tìm chu vi hình chữ nhật ABCD?',
        type: 'geometry',
        options: [
          { key: 'A', text: '28 cm', color: '#f97316' },
          { key: 'B', text: '30 cm', color: '#0284c7' },
          { key: 'C', text: '32 cm', color: '#16a34a' },
          { key: 'D', text: '38 cm', color: '#dc2626' },
          { key: 'E', text: '40 cm', color: '#9333ea' }
        ],
        correctAnswer: 'B',
        explanation: 'Tổng chu vi 4 hình chữ nhật nhỏ bằng 2 lần chu vi hình chữ nhật ABCD. Vì chu vi hình thứ 4 không nhỏ nhất (11) và không lớn nhất (19), nên chu vi hình thứ 4 là 14 cm. Tổng chu vi = 11 + 14 + 16 + 19 = 60 cm. Chu vi ABCD = 60 / 2 = 30 cm.'
      },
      {
        id: 'ikmc_2024_2',
        question: 'Trong giỏ có 5 loại quả: Táo 🍎, Anh đào 🍒, Nho 🍇, Dâu tây 🍓, Chuối 🍌. 5 bạn An, Mai, Chi, Doanh, Loan chọn quả thích. An thích Nho; Mai thích cả 5 loại; Chi thích Nho, Dâu, Chuối; Doanh thích Nho, Chuối; Loan thích Anh đào, Dâu. Mỗi bạn lấy 1 loại quả khác nhau mà mình thích. Hỏi Mai lấy loại quả nào?',
        type: 'logic_fruit',
        options: [
          { key: 'A', text: 'Táo 🍎', color: '#f97316' },
          { key: 'B', text: 'Anh đào 🍒', color: '#0284c7' },
          { key: 'C', text: 'Nho 🍇', color: '#16a34a' },
          { key: 'D', text: 'Dâu tây 🍓', color: '#dc2626' },
          { key: 'E', text: 'Chuối 🍌', color: '#9333ea' }
        ],
        correctAnswer: 'A',
        explanation: 'Xét sự lựa chọn độc nhất: Táo 🍎 là loại quả duy nhất chỉ có Mai thích trong danh sách. Các bạn khác không chọn táo. Do đó Mai bắt buộc lấy quả Táo 🍎 để tất cả 5 bạn đều chọn được quả khác nhau!'
      },
      {
        id: 'ikmc_2024_3',
        question: 'Xét lưới ma trận 3x4 có điền các con số và hạt dẻ 🌰. Số trên mỗi ô cho biết số hạt dẻ ở các ô chung cạnh với ô đó. Ô có số 3 ở hàng 3 cột 2 có 3 hạt dẻ xung quanh. Vị trí nào dưới đây có hạt dẻ?',
        type: 'matrix_grid',
        options: [
          { key: 'A', text: 'Hàng 1, Cột 2', color: '#f97316' },
          { key: 'B', text: 'Hàng 2, Cột 2', color: '#0284c7' },
          { key: 'C', text: 'Hàng 3, Cột 1 và Cột 3', color: '#16a34a' },
          { key: 'D', text: 'Hàng 4, Cột 1', color: '#dc2626' },
          { key: 'E', text: 'Hàng 1, Cột 3', color: '#9333ea' }
        ],
        correctAnswer: 'C',
        explanation: 'Xung quanh ô số 3 (Hàng 3, Cột 2) có 4 ô kề (trên, dưới, trái, phải). Ta xác định được 3 hạt dẻ nằm ở vị trí Hàng 3 Cột 1, Hàng 3 Cột 3 và Hàng 4 Cột 2.'
      },
      {
        id: 'ikmc_2024_4',
        question: 'An, Minh và Chi có các hình đại diện: An có (▲, ◯, ▢), Minh có (♥, ▢, ★), Chi có (★, ▲, ✦). Hỏi Minh và Chi có chung biểu tượng hình nào?',
        type: 'dialogue_logic',
        options: [
          { key: 'A', text: 'Hình tam giác ▲', color: '#f97316' },
          { key: 'B', text: 'Hình vuông ▢', color: '#0284c7' },
          { key: 'C', text: 'Hình ngôi sao ★', color: '#16a34a' },
          { key: 'D', text: 'Hình thoi ✦', color: '#dc2626' },
          { key: 'E', text: 'Hình trái tim ♥', color: '#9333ea' }
        ],
        correctAnswer: 'C',
        explanation: 'Minh có hình ngôi sao ★ (♥, ▢, ★) và Chi cũng có hình ngôi sao ★ (★, ▲, ✦). Cả hai bạn Minh và Chi đều sở hữu hình ngôi sao ★!'
      }
    ]
  },
  {
    year: 2023,
    title: 'Đề thi IKMC 2023 - Level 2 (Lớp 3 & 4)',
    level: 'Level 2',
    totalQuestions: 24,
    timeLimitMinutes: 45,
    badge: 'IKMC 2023',
    quizzes: [
      {
        id: 'ikmc_2023_1',
        question: 'Một cửa hàng bán được 15 chai dầu ăn, mỗi chai chứa 5/2 lít dầu. Biết rằng 1 lít dầu cân nặng 9/10 kg. Hỏi cửa hàng đã bán được tất cả bao nhiêu kg dầu ăn?',
        type: 'fraction_real',
        options: [
          { key: 'A', text: '33,75 kg', color: '#f97316' },
          { key: 'B', text: '30 kg', color: '#0284c7' },
          { key: 'C', text: '35,5 kg', color: '#16a34a' },
          { key: 'D', text: '28,25 kg', color: '#dc2626' },
          { key: 'E', text: '36 kg', color: '#9333ea' }
        ],
        correctAnswer: 'A',
        explanation: 'Tổng số lít dầu = 15 x (5/2) = 75/2 = 37,5 lít. Tổng cân nặng = 37,5 x (9/10) = 33,75 kg.'
      },
      {
        id: 'ikmc_2023_2',
        question: 'Một con sâu róm bò lên cột cao 10m. Ban ngày nó bò lên 3m, ban đêm tụt xuống 2m. Hỏi sau bao nhiêu ngày con sâu róm lên đến đỉnh cột?',
        type: 'logic_step',
        options: [
          { key: 'A', text: '10 ngày', color: '#f97316' },
          { key: 'B', text: '8 ngày', color: '#0284c7' },
          { key: 'C', text: '7 ngày', color: '#16a34a' },
          { key: 'D', text: '9 ngày', color: '#dc2626' },
          { key: 'E', text: '6 ngày', color: '#9333ea' }
        ],
        correctAnswer: 'B',
        explanation: 'Mỗi ngày đêm sâu tiến thêm: 3 - 2 = 1m. Đến cuối ngày thứ 7, sâu bò được 7m. Ngày thứ 8, ban ngày sâu bò thêm 3m nữa: 7 + 3 = 10m tới đỉnh và không bị tụt xuống nữa! Vậy mất 8 ngày.'
      }
    ]
  },
  {
    year: 2022,
    title: 'Đề thi IKMC 2022 - Level 2 (Lớp 3 & 4)',
    level: 'Level 2',
    totalQuestions: 24,
    timeLimitMinutes: 45,
    badge: 'IKMC 2022',
    quizzes: [
      {
        id: 'ikmc_2022_1',
        question: 'Nhóm bạn có 30 người qua sông. Mỗi chuyến đò chở tối đa 6 người kể cả người lái đò. Hỏi cần ít nhất bao nhiêu chuyến đò để đưa toàn bộ 30 khách qua sông?',
        type: 'logic_boat',
        options: [
          { key: 'A', text: '5 chuyến', color: '#f97316' },
          { key: 'B', text: '6 chuyến', color: '#0284c7' },
          { key: 'C', text: '7 chuyến', color: '#16a34a' },
          { key: 'D', text: '8 chuyến', color: '#dc2626' },
          { key: 'E', text: '9 chuyến', color: '#9333ea' }
        ],
        correctAnswer: 'B',
        explanation: 'Mỗi chuyến đò có 1 lái đò, nên chỉ chở thêm 6 - 1 = 5 khách. Cần ít nhất 30 / 5 = 6 chuyến đò.'
      }
    ]
  },
  {
    year: 2021,
    title: 'Đề thi IKMC 2021 - Level 1 (Lớp 1 & 2)',
    level: 'Level 1',
    totalQuestions: 18,
    timeLimitMinutes: 45,
    badge: 'IKMC 2021',
    quizzes: [
      {
        id: 'ikmc_2021_1',
        question: 'Vòng hạt xếp theo quy luật màu sắc: Đỏ - Xanh - Vàng - Đỏ - Xanh - Vàng... Hỏi hạt thứ 14 có màu gì?',
        type: 'pattern',
        options: [
          { key: 'A', text: 'Màu Đỏ', color: '#dc2626' },
          { key: 'B', text: 'Màu Xanh', color: '#0284c7' },
          { key: 'C', text: 'Màu Vàng', color: '#eab308' },
          { key: 'D', text: 'Màu Tím', color: '#9333ea' },
          { key: 'E', text: 'Màu Cam', color: '#f97316' }
        ],
        correctAnswer: 'B',
        explanation: 'Chu kỳ gồm 3 màu. Ta có: 14 chia 3 được 4 dư 2. Hạt thứ 2 trong chu kỳ (Đỏ, Xanh, Vàng) chính là màu Xanh!'
      }
    ]
  },
  {
    year: 2020,
    title: 'Đề thi IKMC 2020 - Level 1 (Lớp 1 & 2)',
    level: 'Level 1',
    totalQuestions: 18,
    timeLimitMinutes: 45,
    badge: 'IKMC 2020',
    quizzes: [
      {
        id: 'ikmc_2020_1',
        question: 'Cần ít nhất bao nhiêu cây bút chì để xếp thành một hình tứ giác khép kín?',
        type: 'shape',
        options: [
          { key: 'A', text: '2 cây', color: '#f97316' },
          { key: 'B', text: '3 cây', color: '#0284c7' },
          { key: 'C', text: '4 cây', color: '#16a34a' },
          { key: 'D', text: '5 cây', color: '#dc2626' },
          { key: 'E', text: '6 cây', color: '#9333ea' }
        ],
        correctAnswer: 'C',
        explanation: 'Hình tứ giác có 4 cạnh nên cần ít nhất 4 cây bút chì ghép nối với nhau.'
      }
    ]
  }
]
