export const mathData = [
  {
    id: 'chude_1',
    title: 'Chủ đề 1: Cộng trừ trong phạm vi 20',
    emoji: '🧮',
    stars: 5,
    lesson: {
      title: 'Bí Kíp Tính Nhanh Trong Phạm Vi 20',
      badge: '⚡ MẸO HỌC TOÁN SIÊU TỐC',
      steps: [
        {
          title: '1. Nhóm các số tạo thành tròn chục (10)',
          desc: 'Khi gặp phép cộng nhiều số, bé hãy ghép 2 số có tổng bằng 10 để tính siêu nhanh nhé!',
          formula: '4 + 5 + 6  ➜  (4 + 6) + 5  ➜  10 + 5 = 15',
          tip: '💡 Cặp số bạn thân tạo thành 10: (1+9), (2+8), (3+7), (4+6), (5+5)!'
        },
        {
          title: '2. Quy luật dãy số thông minh',
          desc: 'Quan sát 2 số liền nhau xem tăng hay giảm bao nhiêu đơn vị để điền số tiếp theo.',
          formula: '3 , 6 , 9 , ❓  ➜  Mỗi số +3  ➜  9 + 3 = 12',
          tip: '🚀 Dãy số tăng thì bé cộng thêm, giảm thì bé trừ đi nhé!'
        },
        {
          title: '3. Số liền trước & Số liền sau',
          desc: 'Số liền trước kém 1 đơn vị (bên trái), số liền sau hơn 1 đơn vị (bên phải).',
          formula: 'Số liền trước (34)  ⬅  [ 35 ]  ➡  Số liền sau (36)',
          tip: '⭐ Số liền trước = Số đó - 1 | Số liền sau = Số đó + 1'
        }
      ]
    },
    quizzes: [
      {
        question: 'Điền số thích hợp vào chỗ chấm để tính nhanh siêu tốc:',
        equation: '7 + 5 + 3 = ❓',
        options: ['12', '15', '10', '14'],
        correctAnswer: 1,
        explanation: '🎉 Tuyệt vời! Bé ghép (7 + 3) = 10, sau đó 10 + 5 = 15 cực chuẩn!'
      },
      {
        question: 'Ba số tiếp theo của dãy số tăng dần dưới đây là số nào?',
        equation: '2 , 4 , 6 , 8 , ❓ , ❓ , ❓',
        options: ['9 ; 10 ; 11', '10 ; 12 ; 14', '10 ; 11 ; 12', '12 ; 14 ; 16'],
        correctAnswer: 1,
        explanation: '🌟 Bé giỏi quá! Dãy số đếm nhảy 2 đơn vị: 8+2=10, 10+2=12, 12+2=14.'
      },
      {
        question: 'Trên cành cây có 8 con chim 🐦, sau đó có thêm 7 con chim bay đến. Hỏi có tất cả bao nhiêu con chim?',
        equation: '8 + 7 = ❓ con chim',
        options: ['13 con', '14 con', '15 con', '16 con'],
        correctAnswer: 2,
        explanation: '🎈 Chính xác! Phép tính: 8 + 7 = 15 con chim trên cành.'
      },
      {
        question: 'Đàn gà có 16 con gà con 🐤, 7 con mải chơi đi lạc. Hỏi còn lại bao nhiêu con gà con?',
        equation: '16 - 7 = ❓ con gà',
        options: ['8 con', '9 con', '10 con', '7 con'],
        correctAnswer: 1,
        explanation: '👏 Đúng rồi! Phép tính trừ: 16 - 7 = 9 con gà con còn lại.'
      },
      {
        question: 'Biết a là số liền sau của 35. Hỏi số liền trước của a là số mấy?',
        equation: 'a là số liền sau 35 ➜ Số liền trước của a = ❓',
        options: ['34', '36', '35', '37'],
        correctAnswer: 2,
        explanation: '🏆 Siêu lắm! a = 36 (liền sau 35). Số liền trước của 36 chính là 35!'
      }
    ]
  },
  {
    id: 'chude_2',
    title: 'Chủ đề 2: Cộng trừ trong phạm vi 100 & Hình học',
    emoji: '📐',
    stars: 5,
    lesson: {
      title: 'Bí Kíp Phép Tính Có Nhớ & Hình Học',
      badge: '📏 TOÁN HÌNH & THỜI GIAN',
      steps: [
        {
          title: '1. Phép cộng có nhớ trong phạm vi 100',
          desc: 'Cộng từ phải sang trái. Nếu tổng từ 10 trở lên, viết hàng đơn vị và nhớ 1 sang hàng chục.',
          formula: '35 + 35  ➜  5+5=10 (viết 0 nhớ 1)  ➜  3+3+1 = 7  ➜  70',
          tip: '✨ Đừng quên cộng thêm 1 nhớ vào hàng chục bé nhé!'
        },
        {
          title: '2. Phép trừ có nhớ trong phạm vi 100',
          desc: 'Nếu hàng đơn vị không trừ được, mượn 1 chục (cộng 10) để trừ rồi nhớ trả 1 sang số trừ.',
          formula: '75 - 68  ➜  15-8=7 (nhớ 1)  ➜  7-(6+1) = 0  ➜  7',
          tip: '💡 Mượn 1 chục ở hàng đơn vị thì phải nhớ trả 1 vào hàng chục số trừ!'
        },
        {
          title: '3. Điểm & Ba điểm thẳng hàng',
          desc: 'Ba điểm cùng nằm trên 1 đường thẳng được gọi là ba điểm thẳng hàng.',
          formula: '⚫ (A) ────── ⚫ (B) ────── ⚫ (C)   ➜  A, B, C thẳng hàng',
          tip: '🎯 Dùng thước kẻ nối qua 3 điểm, nếu thẳng tắp nghĩa là thẳng hàng!'
        }
      ]
    },
    quizzes: [
      {
        question: 'Thực hiện phép cộng có nhớ siêu nhanh:',
        equation: '35 + 35 = ❓',
        options: ['60', '70', '65', '80'],
        correctAnswer: 1,
        explanation: '🎉 Đỉnh quá! 5+5=10 (viết 0 nhớ 1), 3+3=6 thêm 1 là 7. Kết quả = 70!'
      },
      {
        question: 'Trong khu vườn có 24 quả cam 🍊 và 28 quả táo 🍎. Hỏi có tất cả bao nhiêu quả?',
        equation: '24 + 28 = ❓ quả',
        options: ['52 quả', '42 quả', '50 quả', '48 quả'],
        correctAnswer: 0,
        explanation: '🌟 Chuẩn xác! Phép tính cộng: 24 + 28 = 52 quả trái cây.'
      },
      {
        question: 'Kết quả của phép tính trừ có nhớ dưới đây là bao nhiêu?',
        equation: '75 - 68 = ❓',
        options: ['17', '7', '15', '12'],
        correctAnswer: 1,
        explanation: '🎈 Đúng rồi! Lấy 15 - 8 = 7, trả 1 vào 6 thành 7, 7 - 7 = 0. Kết quả = 7!'
      },
      {
        question: 'Mẹ có 45 quả trứng 🥚, đã bán đi 28 quả. Hỏi mẹ còn lại bao nhiêu quả trứng?',
        equation: '45 - 28 = ❓ quả trứng',
        options: ['27 quả', '17 quả', '15 quả', '23 quả'],
        correctAnswer: 1,
        explanation: '👏 Xuất sắc! Phép tính trừ: 45 - 28 = 17 quả trứng.'
      },
      {
        question: 'Phát biểu nào sau đây đúng về ba điểm thẳng hàng?',
        equation: '⚫───⚫───⚫ ❓',
        options: [
          'Ba điểm nằm ở 3 góc tam giác',
          'Ba điểm cùng nằm trên 1 đường thẳng',
          'Ba điểm nằm xếp thành hình tròn'
        ],
        correctAnswer: 1,
        explanation: '🏆 Đúng rồi! Khi 3 điểm cùng nằm trên 1 đường thẳng thì gọi là 3 điểm thẳng hàng.'
      }
    ]
  },
  {
    id: 'chude_3',
    title: 'Chủ đề 3: Phép nhân, phép chia & Hình học',
    emoji: '✖️',
    stars: 5,
    lesson: {
      title: 'Bí Kíp Phép Nhân & Chia Tuyệt Đỉnh',
      badge: '⚡ BIẾN TỔNG THÀNH TÍCH',
      steps: [
        {
          title: '1. Chuyển tổng nhiều số giống nhau thành Phép Nhân',
          desc: 'Nếu có nhiều số giống nhau cộng lại, bé lấy số đó nhân với số lần xuất hiện.',
          formula: '4 + 4 + 4  ➜  (có 3 số 4)  ➜  4 x 3 = 12',
          tip: '💡 Phép nhân giúp bé tính tổng nhanh gấp 10 lần phép cộng dài!'
        },
        {
          title: '2. Phép Chia đều dễ thương',
          desc: 'Muốn chia đều số đồ vật cho các bạn, bé dùng phép chia nhé!',
          formula: '30 học sinh chia làm các hàng 5 học sinh  ➜  30 : 5 = 6 hàng',
          tip: '🚀 Dấu hiệu phép chia: "Chia đều", "Chia thành các phần bằng nhau".'
        },
        {
          title: '3. Tìm thành phần chưa biết (Tìm x, y)',
          desc: 'Muốn tìm số bị chia (x), lấy thương nhân số chia. Tìm số chia, lấy số bị chia chia cho thương.',
          formula: 'x : 5 = 6  ➜  x = 6 x 5 = 30',
          tip: '⭐ Tìm Số Bị Chia = Thương x Số Chia'
        }
      ]
    },
    quizzes: [
      {
        question: 'Chuyển tổng sau thành phép nhân rồi tính kết quả:',
        equation: '4 + 4 + 4 = ❓',
        options: ['4 x 4 = 16', '4 x 3 = 12', '3 x 4 = 12', '4 + 3 = 7'],
        correctAnswer: 1,
        explanation: '🎉 Chuẩn lắm! Có 3 số 4 cộng lại ➜ Phép nhân 4 x 3 = 12!'
      },
      {
        question: 'Phép nhân nào dưới đây cho kết quả bằng 12?',
        equation: '❓ x ❓ = 12',
        options: ['2 x 5', '5 x 3', '2 x 6', '2 x 7'],
        correctAnswer: 2,
        explanation: '🌟 Tuyệt vời! Bảng nhân 2: 2 x 6 = 12.'
      },
      {
        question: 'Trong phép chia 28 : 7 = 4, số 7 đóng vai trò là gì?',
        equation: '28 (Số bị chia) : 7 (❓) = 4 (Thương)',
        options: ['Số bị chia', 'Số chia', 'Thương', 'Số hạng'],
        correctAnswer: 1,
        explanation: '🎈 Bé giỏi quá! Trong phép chia: 28 là Số bị chia, 7 là Số chia, 4 là Thương.'
      },
      {
        question: 'Lớp có 30 bạn học sinh 🎒, xếp thành các hàng 5 bạn. Hỏi xếp được bao nhiêu hàng?',
        equation: '30 : 5 = ❓ hàng',
        options: ['5 hàng', '6 hàng', '7 hàng', '8 hàng'],
        correctAnswer: 1,
        explanation: '👏 Đúng rồi! Phép tính chia: 30 : 5 = 6 hàng.'
      },
      {
        question: 'Thử thách tìm x giấu mặt:',
        equation: 'x : 5 = 12 : 2   ➜   x = ❓',
        options: ['x = 30', 'x = 25', 'x = 15', 'x = 20'],
        correctAnswer: 0,
        explanation: '🏆 Siêu thế! Vế phải 12:2 = 6. Ta có x : 5 = 6 ➜ x = 6 x 5 = 30!'
      }
    ]
  },
  {
    id: 'chude_4',
    title: 'Chủ đề 4: Phép tính trong phạm vi 1000',
    emoji: '🔢',
    stars: 5,
    lesson: {
      title: 'Bí Kíp Chinh Phục Số Có 3 Chữ Số',
      badge: '🚀 CỘNG TRỪ TRONG PHẠM VI 1000',
      steps: [
        {
          title: '1. Đọc và viết số có 3 chữ số',
          desc: 'Cấu tạo số gồm: Hàng Trăm + Hàng Chục + Hàng Đơn Vị.',
          formula: '3 trăm , 6 chục , 2 đơn vị  ➜  Số [ 362 ]',
          tip: '💡 Đọc từ hàng trăm ➜ hàng chục ➜ hàng đơn vị!'
        },
        {
          title: '2. Cộng trừ số có 3 chữ số',
          desc: 'Tính lần lượt từ phải sang trái (Đơn vị ➜ Chục ➜ Trăm).',
          formula: '112 + 104 + 161  ➜  (2+4+1=7) (1+0+6=7) (1+1+1=3)  ➜  377',
          tip: '✨ Đặt tính thẳng hàng các chữ số cùng hàng với nhau!'
        },
        {
          title: '3. Tìm thành phần chưa biết (x, y)',
          desc: 'Muốn tìm số bị trừ, lấy hiệu + số trừ. Muốn tìm số trừ, lấy số bị trừ - hiệu.',
          formula: 'x - 643 = 261  ➜  x = 261 + 643  ➜  904',
          tip: '⭐ Tìm Số Bị Trừ = Hiệu + Số Trừ'
        }
      ]
    },
    quizzes: [
      {
        question: 'Viết số phù hợp biết số đó gồm 6 chục, 3 trăm và 2 đơn vị:',
        equation: '3 Trăm + 6 Chục + 2 Đơn vị = ❓',
        options: ['632', '362', '326', '263'],
        correctAnswer: 1,
        explanation: '🎉 Chuẩn xác! 3 trăm, 6 chục, 2 đơn vị ghép thành số 362.'
      },
      {
        question: 'Tính tổng của 3 số tròn xinh:',
        equation: '112 + 104 + 161 = ❓',
        options: ['377', '375', '367', '357'],
        correctAnswer: 0,
        explanation: '🌟 Bé giỏi quá! Cộng lần lượt: 112 + 104 + 161 = 377.'
      },
      {
        question: 'Tính tổng của số lớn nhất có 2 chữ số (99) và số nhỏ nhất có 3 chữ số khác nhau (102):',
        equation: '99 + 102 = ❓',
        options: ['201', '199', '223', '202'],
        correctAnswer: 0,
        explanation: '🎈 Quá chuẩn! Số lớn nhất có 2 chữ số là 99, số nhỏ nhất 3 chữ số khác nhau là 102. 99 + 102 = 201!'
      },
      {
        question: 'Cánh đồng A thu 335kg táo 🍎, nhiều hơn cánh đồng B 58kg. Hỏi cánh đồng B thu bao nhiêu kg?',
        equation: '335 - 58 = ❓ kg táo',
        options: ['393 kg', '277 kg', '293 kg', '287 kg'],
        correctAnswer: 1,
        explanation: '👏 Đúng rồi! Cánh đồng B ít hơn A 58kg: 335 - 58 = 277 kg táo.'
      },
      {
        question: 'Tìm x biết x là số bị trừ giấu mặt:',
        equation: 'x - 643 = 261   ➜   x = ❓',
        options: ['x = 904', 'x = 804', 'x = 382', 'x = 482'],
        correctAnswer: 0,
        explanation: '🏆 Tuyệt đỉnh! Muốn tìm số bị trừ x = 261 + 643 = 904.'
      }
    ]
  },
  {
    id: 'chude_5',
    title: 'Chủ đề 5: Thời gian. Trồng cây. Tuổi',
    emoji: '🌳',
    stars: 5,
    lesson: {
      title: 'Bí Kíp Giải Toán Thời Gian & Trồng Cây',
      badge: '⏰ TOÁN THỰC TẾ CUỘC SỐNG',
      steps: [
        {
          title: '1. Đổi giờ 12h sang 24h thần tốc',
          desc: '1 ngày có 24 giờ. Từ 1 giờ chiều trở đi, bé lấy số giờ + 12 nhé!',
          formula: '3 giờ chiều  ➜  3 + 12  ➜  15 giờ',
          tip: '💡 1 ngày = 24 giờ | 1 tuần = 7 ngày | 1 giờ = 60 phút'
        },
        {
          title: '2. Bài toán Trồng cây 2 đầu đường',
          desc: 'Trồng cây trên đường thẳng ở cả 2 đầu: Số cây = Số khoảng + 1.',
          formula: 'Đường dài 20m, mỗi cây cách 5m  ➜  20 : 5 = 4 khoảng  ➜  4 + 1 = 5 cây (1 bên)',
          tip: '🚀 Nếu trồng 2 bên đường thì bé nhân đôi số cây lên nhé!'
        },
        {
          title: '3. Bí mật Tuổi tác không đổi',
          desc: 'Mỗi năm mọi người đều tăng thêm 1 tuổi, nên hiệu số tuổi giữa 2 người KHÔNG BAO GIỜ thay đổi!',
          formula: 'Bố 35 tuổi, Nam 7 tuổi  ➜  Hiệu: 35 - 7 = 28 tuổi  ➜  Sau 5 năm vẫn hơn 28 tuổi',
          tip: '⭐ Dù bao nhiêu năm trôi qua, bố vẫn luôn hơn con số tuổi cố định đó!'
        }
      ]
    },
    quizzes: [
      {
        question: 'Đổi đơn vị thời gian: 2 ngày bằng bao nhiêu giờ?',
        equation: '2 ngày = ❓ giờ',
        options: ['24 giờ', '48 giờ', '36 giờ', '12 giờ'],
        correctAnswer: 1,
        explanation: '🎉 Đúng rồi! 1 ngày = 24 giờ, nên 2 ngày = 24 x 2 = 48 giờ.'
      },
      {
        question: 'Tàu chạy 8 giờ từ Sài Gòn. Tàu xuất phát lúc 7 giờ sáng. Hỏi tàu đến nơi lúc mấy giờ chiều?',
        equation: '7 giờ sáng + 8 giờ = 15 giờ   ➜   15 giờ = ❓ giờ chiều',
        options: ['1 giờ chiều', '2 giờ chiều', '3 giờ chiều', '4 giờ chiều'],
        correctAnswer: 2,
        explanation: '🌟 Xuất sắc! 7 + 8 = 15 giờ. Đổi sang giờ chiều: 15 - 12 = 3 giờ chiều.'
      },
      {
        question: 'Nếu ngày 15 tháng 2 là Thứ Ba thì Thứ Ba tuần sau là ngày mấy tháng 2?',
        equation: 'Ngày 15 + 7 ngày (1 tuần) = Ngày ❓',
        options: ['Ngày 20', 'Ngày 22', 'Ngày 21', 'Ngày 23'],
        correctAnswer: 1,
        explanation: '🎈 Chuẩn lắm! Sau 1 tuần (7 ngày), Thứ Ba tuần sau sẽ là ngày 15 + 7 = 22 tháng 2.'
      },
      {
        question: 'Đường dài 20m, trồng cây 2 bên đường, mỗi cây cách 5m (trồng cả 2 đầu). Có tất cả bao nhiêu cây?',
        equation: '(20 : 5 + 1) x 2 bên = ❓ cây',
        options: ['5 cây', '10 cây', '9 cây', '6 cây'],
        correctAnswer: 1,
        explanation: '👏 Đỉnh cao! 1 bên trồng 20:5+1 = 5 cây. 2 bên đường trồng: 5 x 2 = 10 cây!'
      },
      {
        question: 'Hiện nay Nam 7 tuổi, bố Nam 35 tuổi. Hỏi sau 5 năm nữa, bố hơn Nam bao nhiêu tuổi?',
        equation: 'Hiệu số tuổi = 35 - 7 = ❓ tuổi',
        options: ['28 tuổi', '33 tuổi', '30 tuổi', '25 tuổi'],
        correctAnswer: 0,
        explanation: '🏆 Quá giỏi! Hiệu số tuổi không thay đổi theo thời gian. Bố luôn hơn Nam 35 - 7 = 28 tuổi!'
      }
    ]
  },
  {
    id: 'chude_6',
    title: 'Chủ đề 6: Đếm hình. Logic & Quy luật',
    emoji: '🧩',
    stars: 5,
    lesson: {
      title: 'Bí Kíp Đếm Hình & Tư Duy Logic',
      badge: '🧩 THỬ THÁCH TRÍ DIỆU KỲ',
      steps: [
        {
          title: '1. Phương pháp Đếm hình không bao giờ sót',
          desc: 'Đánh số các hình đơn lẻ (1, 2, 3...), sau đó đếm hình đơn lẻ rồi đếm các hình ghép lại từ 2 hay 3 hình nhỏ.',
          formula: 'Đếm hình đơn  ➜  Đếm hình đôi  ➜  Cộng tất cả lại',
          tip: '💡 Đánh số vào từng hình nhỏ sẽ giúp bé không bao giờ đếm lặp!'
        },
        {
          title: '2. Bài toán chia thuyền qua sông',
          desc: 'Mỗi chuyến thuyền chở tối đa N người (gồm 1 người lái đò), nên số khách chở được mỗi chuyến = N - 1.',
          formula: 'Thuyền chở 6 người (có 1 lái đò)  ➜  Mỗi chuyến chở 5 khách  ➜  30 khách : 5 = 6 chuyến',
          tip: '🚀 Đừng quên trừ đi 1 người lái đò trên thuyền bé nhé!'
        },
        {
          title: '3. Tìm quy luật chu kỳ màu sắc',
          desc: 'Tìm nhóm màu lặp lại (chu kỳ), lấy vị trí chia cho độ dài chu kỳ để xem phần dư.',
          formula: '(Đỏ - Xanh - Vàng)  ➜  Chu kỳ 3 màu  ➜  Hạt 14 : 3 = 4 dư 2 (Màu thứ 2: Xanh)',
          tip: '⭐ Số dư = 1 (màu 1), dư = 2 (màu 2), dư = 0 (màu cuối chu kỳ).'
        }
      ]
    },
    quizzes: [
      {
        question: 'Cần dùng ít nhất bao nhiêu cây bút chì ✏️ để xếp thành một hình tứ giác?',
        equation: 'Hình tứ giác (4 cạnh) ➜ Cần ❓ cây bút chì',
        options: ['3 cây', '4 cây', '5 cây', '6 cây'],
        correctAnswer: 1,
        explanation: '🎉 Chuẩn rồi! Hình tứ giác có 4 cạnh nên cần ít nhất 4 cây bút chì!'
      },
      {
        question: 'Có 30 người qua sông. Thuyền chở tối đa 6 người (kể cả lái đò). Cần ít nhất mấy chuyến thuyền?',
        equation: '30 khách : (6 - 1 lái đò) = ❓ chuyến',
        options: ['5 chuyến', '6 chuyến', '7 chuyến', '8 chuyến'],
        correctAnswer: 1,
        explanation: '🌟 Bé thông minh quá! Mỗi chuyến chở được 6 - 1 = 5 khách. Cần 30 : 5 = 6 chuyến thuyền!'
      },
      {
        question: 'Vòng hạt màu theo chu kỳ: Đỏ - Xanh - Vàng - Đỏ - Xanh - Vàng... Hỏi hạt thứ 14 có màu gì?',
        equation: '14 : 3 (độ dài chu kỳ) = 4 dư 2 ➜ Hạt thứ 2 trong chu kỳ là màu ❓',
        options: ['Màu Đỏ', 'Màu Xanh', 'Màu Vàng', 'Màu Tím'],
        correctAnswer: 1,
        explanation: '🎈 Xuất sắc! 14 chia 3 dư 2. Hạt thứ 2 trong chu kỳ (Đỏ, Xanh, Vàng) chính là màu Xanh!'
      },
      {
        question: 'Một con lừa kêu 1 tiếng làm lộ 1 luống dưa hấu. Hỏi nếu lừa kêu 5 tiếng thì làm lộ mấy luống?',
        equation: '1 tiếng = 1 luống ➜ 5 tiếng = ❓ luống',
        options: ['4 luống', '5 luống', '10 luống', '6 luống'],
        correctAnswer: 1,
        explanation: '👏 Đúng rồi! Tỉ lệ thuận: 1 tiếng lộ 1 luống ➜ 5 tiếng lộ 5 luống dưa hấu.'
      },
      {
        question: 'Có bao nhiêu đoạn thẳng nối từ 3 điểm thẳng hàng A, B, C?',
        equation: '⚫ (A) ────── ⚫ (B) ────── ⚫ (C)',
        options: ['1 đoạn thẳng', '2 đoạn thẳng', '3 đoạn thẳng', '4 đoạn thẳng'],
        correctAnswer: 2,
        explanation: '🏆 Đỉnh cao! Các đoạn thẳng là AB, BC và đoạn lớn AC. Tổng cộng có 3 đoạn thẳng!'
      }
    ]
  }
]
