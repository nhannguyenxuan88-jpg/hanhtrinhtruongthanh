// Sân chơi Toán tư duy — chia hai nhánh theo độ tuổi.
//
// VÌ SAO CHIA kids / teens:
// Trước đây đây là một mảng phẳng toàn chủ đề mức lớp 2, nhưng app dùng chung
// cho cả bạn lớp 8. Bạn ấy mở tab Toán ra và thấy "Cộng trừ trong phạm vi 20"
// thì vừa vô ích vừa chạm tự ái. Nhánh teens gắn với những thứ tuổi đó dùng
// thật: phần trăm - lãi suất, xác suất, đọc biểu đồ, hình học thực tế.
//
// Mỗi chủ đề: 3 bước lý thuyết (lesson.steps) rồi tới 5 câu trắc nghiệm.
// Con phải trả lời đúng mới sang câu tiếp, nên sao được chấm theo số câu
// đúng NGAY LẦN ĐẦU (xem src/lib/learning.js).

export const mathData = {
  kids: [
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
    },
    {
      id: 'chude_7',
      title: 'Chủ đề 7: Đo lường - Độ dài, Khối lượng, Dung tích',
      emoji: '📏',
      stars: 5,
      lesson: {
        title: 'Bí Kíp Đo Lường Mọi Thứ Quanh Em',
        badge: '📐 CM - KG - LÍT',
        steps: [
          {
            title: '1. Đơn vị đo độ dài: cm, dm, m',
            desc: 'Đổi đơn vị luôn theo bậc thang: mỗi bậc nhân hoặc chia cho 10. Từ lớn xuống nhỏ thì nhân, từ nhỏ lên lớn thì chia.',
            formula: '1 m = 10 dm = 100 cm   ➜   3 m 5 cm = 305 cm',
            tip: '💡 Mẹo nhớ: 1 gang tay bé khoảng 15 cm, 1 bước chân khoảng 40 cm!'
          },
          {
            title: '2. Đơn vị đo khối lượng: gam và ki-lô-gam',
            desc: 'Cân nặng đo bằng kg (nặng) và g (nhẹ). Khi cộng trừ, hai số phải cùng đơn vị mới tính được.',
            formula: '1 kg = 1000 g   ➜   2 kg + 500 g = 2500 g = 2 kg 500 g',
            tip: '⚖️ Một hộp sữa tươi khoảng 180 g, một bao gạo nhỏ 5 kg!'
          },
          {
            title: '3. Đơn vị đo dung tích: lít',
            desc: 'Lít đo lượng nước, sữa, dầu chứa trong bình. Cộng trừ lít giống hệt cộng trừ số thường, chỉ cần viết đơn vị "l" ở kết quả.',
            formula: 'Can 5 l rót ra 2 l  ➜  5 l - 2 l = 3 l còn lại',
            tip: '🥤 Một chai nước suối thường là 500 ml, hai chai là 1 lít!'
          }
        ]
      },
      quizzes: [
        {
          question: 'Bạn Nam cao 1 m 25 cm. Chiều cao của bạn Nam là bao nhiêu xăng-ti-mét?',
          equation: '1 m 25 cm = ❓ cm',
          options: ['105 cm', '125 cm', '150 cm', '1025 cm'],
          correctAnswer: 1,
          explanation: '🎉 Chuẩn rồi! 1 m = 100 cm, cộng thêm 25 cm nữa là 125 cm.'
        },
        {
          question: 'Mẹ mua 1 kg thịt và 400 g cá. Hỏi mẹ xách tất cả bao nhiêu gam?',
          equation: '1 kg + 400 g = ❓ g',
          options: ['500 g', '1040 g', '1400 g', '4000 g'],
          correctAnswer: 2,
          explanation: '🌟 Giỏi lắm! Đổi 1 kg = 1000 g, rồi 1000 + 400 = 1400 g.'
        },
        {
          question: 'Một sợi dây dài 90 cm, bé cắt đi 3 dm. Hỏi sợi dây còn lại dài bao nhiêu xăng-ti-mét?',
          equation: '90 cm - 3 dm = ❓ cm',
          options: ['87 cm', '60 cm', '30 cm', '57 cm'],
          correctAnswer: 1,
          explanation: '🎈 Xuất sắc! Đổi 3 dm = 30 cm trước đã, rồi 90 - 30 = 60 cm.'
        },
        {
          question: 'Thùng thứ nhất có 12 lít nước, thùng thứ hai ít hơn thùng thứ nhất 5 lít. Cả hai thùng có bao nhiêu lít?',
          equation: 'Thùng 2 = 12 - 5 ➜ Tổng = 12 + ❓',
          options: ['17 l', '19 l', '24 l', '7 l'],
          correctAnswer: 1,
          explanation: '👏 Tuyệt! Thùng hai có 12 - 5 = 7 l. Cả hai thùng: 12 + 7 = 19 l.'
        },
        {
          question: 'Vật nào dưới đây hợp lý nhất khi nói "nặng khoảng 3 kg"?',
          equation: '❓ ≈ 3 kg',
          options: ['Một cái bút chì', 'Một quả dưa hấu nhỏ', 'Một hạt gạo', 'Một chiếc xe máy'],
          correctAnswer: 1,
          explanation: '🏆 Đúng rồi! Bút chì chỉ vài gam, hạt gạo cực nhẹ, xe máy tới cả trăm kg. Quả dưa hấu nhỏ mới khoảng 3 kg.'
        }
      ]
    },
    {
      id: 'chude_8',
      title: 'Chủ đề 8: Tiền Việt Nam & Bài toán mua bán',
      emoji: '💵',
      stars: 5,
      lesson: {
        title: 'Bí Kíp Tính Tiền Như Người Lớn',
        badge: '🏪 ĐI CHỢ CÙNG MẸ',
        steps: [
          {
            title: '1. Nhận biết các tờ tiền Việt Nam',
            desc: 'Tiền Việt Nam có các mệnh giá quen thuộc: 1000, 2000, 5000, 10 000, 20 000, 50 000, 100 000 đồng. Ghép nhiều tờ nhỏ lại sẽ thành một tờ lớn.',
            formula: '5000 + 5000 = 10 000 đ   |   2 tờ 20 000 = 40 000 đ',
            tip: '💡 Nhớ mẹo: cứ 2 tờ 5000 đổi được 1 tờ 10 000 đồng!'
          },
          {
            title: '2. Tính tiền phải trả khi mua nhiều món',
            desc: 'Cộng giá tất cả các món lại là ra số tiền phải trả. Nếu mua nhiều món giống nhau thì dùng phép nhân cho nhanh.',
            formula: '3 cuốn vở x 6000 đ  ➜  6000 x 3 = 18 000 đ',
            tip: '🛒 Mua nhiều món giống nhau ➜ dùng phép nhân, đừng cộng dài!'
          },
          {
            title: '3. Tính tiền thừa được trả lại',
            desc: 'Tiền thừa = Số tiền đưa cho cô bán hàng − Số tiền phải trả. Đây chính là phép trừ.',
            formula: 'Đưa 50 000 đ, mua hết 18 000 đ  ➜  50 000 - 18 000 = 32 000 đ',
            tip: '⭐ Luôn đếm lại tiền thừa trước khi rời quầy con nhé!'
          }
        ]
      },
      quizzes: [
        {
          question: 'Bé có 2 tờ 10 000 đồng và 3 tờ 5000 đồng. Hỏi bé có tất cả bao nhiêu tiền?',
          equation: '10 000 x 2 + 5000 x 3 = ❓',
          options: ['25 000 đ', '30 000 đ', '35 000 đ', '50 000 đ'],
          correctAnswer: 2,
          explanation: '🎉 Giỏi quá! 10 000 x 2 = 20 000, 5000 x 3 = 15 000. Tổng: 20 000 + 15 000 = 35 000 đồng.'
        },
        {
          question: 'Một cây bút giá 4000 đồng. Bé mua 5 cây bút thì phải trả bao nhiêu tiền?',
          equation: '4000 x 5 = ❓',
          options: ['9000 đ', '16 000 đ', '20 000 đ', '25 000 đ'],
          correctAnswer: 2,
          explanation: '🌟 Chính xác! 4000 x 5 = 20 000 đồng.'
        },
        {
          question: 'Bé đưa cô bán hàng 50 000 đồng để mua hộp sữa 27 000 đồng. Cô phải trả lại bé bao nhiêu?',
          equation: '50 000 - 27 000 = ❓',
          options: ['13 000 đ', '23 000 đ', '33 000 đ', '27 000 đ'],
          correctAnswer: 1,
          explanation: '🎈 Đúng rồi! Tiền thừa = 50 000 - 27 000 = 23 000 đồng.'
        },
        {
          question: 'Bé để dành mỗi tuần 5000 đồng. Sau 8 tuần bé để dành được bao nhiêu tiền?',
          equation: '5000 x 8 = ❓',
          options: ['13 000 đ', '35 000 đ', '40 000 đ', '45 000 đ'],
          correctAnswer: 2,
          explanation: '👏 Tuyệt vời! 5000 x 8 = 40 000 đồng. Kiên trì tiết kiệm là mua được thứ mình thích đó con!'
        },
        {
          question: 'Bé có 30 000 đồng, muốn mua quyển truyện 22 000 đồng và cây bút 12 000 đồng. Điều gì xảy ra?',
          equation: '22 000 + 12 000 = 34 000 so với 30 000 ➜ ❓',
          options: [
            'Đủ tiền và còn thừa 4000 đồng',
            'Vừa đủ tiền, không thừa đồng nào',
            'Thiếu 4000 đồng, phải bỏ bớt một món',
            'Thiếu 12 000 đồng'
          ],
          correctAnswer: 2,
          explanation: '🏆 Suy luận giỏi lắm! Tổng phải trả 34 000 đ mà bé chỉ có 30 000 đ, vậy còn thiếu 34 000 - 30 000 = 4000 đồng.'
        }
      ]
    },
    {
      id: 'chude_9',
      title: 'Chủ đề 9: Giải toán có lời văn nhiều bước',
      emoji: '📝',
      stars: 5,
      lesson: {
        title: 'Bí Kíp Đọc Đề Không Bị Lừa',
        badge: '🔍 4 BƯỚC GIẢI TOÁN ĐỐ',
        steps: [
          {
            title: '1. Gạch chân dữ kiện và câu hỏi',
            desc: 'Đọc đề 2 lần. Lần một hiểu câu chuyện, lần hai gạch chân các con số và câu hỏi cuối cùng đề muốn hỏi gì.',
            formula: 'Anh có 15 viên bi. Em ít hơn anh 4 viên. Hỏi CẢ HAI có mấy viên?',
            tip: '💡 Câu hỏi hỏi "cả hai" thì chắc chắn phải làm 2 phép tính đó con!'
          },
          {
            title: '2. Dịch từ khoá thành phép tính',
            desc: '"Nhiều hơn" ➜ cộng. "Ít hơn" ➜ trừ. "Gấp ... lần" ➜ nhân. "Chia đều" ➜ chia. Nhưng phải xem ai nhiều hơn ai!',
            formula: 'Em ít hơn anh 4 viên  ➜  Em = 15 - 4 = 11 viên',
            tip: '⚠️ Bẫy hay gặp: thấy chữ "ít hơn" là trừ ngay, mà quên hỏi trừ của ai!'
          },
          {
            title: '3. Làm từng bước, mỗi bước một câu lời giải',
            desc: 'Tìm cái chưa biết trước, rồi mới trả lời câu hỏi chính. Viết lời giải cho từng bước để không bị nhầm.',
            formula: 'Bước 1: Em có 15 - 4 = 11 viên. Bước 2: Cả hai có 15 + 11 = 26 viên.',
            tip: '⭐ Làm xong luôn đọc lại: "Kết quả này có hợp lý không?"'
          }
        ]
      },
      quizzes: [
        {
          question: 'Anh có 15 viên bi, em ít hơn anh 4 viên. Hỏi cả hai anh em có tất cả bao nhiêu viên bi?',
          equation: 'Em = 15 - 4 ➜ Cả hai = 15 + ❓',
          options: ['11 viên', '19 viên', '26 viên', '30 viên'],
          correctAnswer: 2,
          explanation: '🎉 Xuất sắc! Em có 15 - 4 = 11 viên. Cả hai có 15 + 11 = 26 viên bi.'
        },
        {
          question: 'Trong vườn có 8 cây cam, số cây bưởi gấp 3 lần số cây cam. Hỏi vườn có tất cả bao nhiêu cây?',
          equation: 'Bưởi = 8 x 3 ➜ Tổng = 8 + ❓',
          options: ['24 cây', '32 cây', '11 cây', '16 cây'],
          correctAnswer: 1,
          explanation: '🌟 Giỏi lắm! Bưởi có 8 x 3 = 24 cây. Cả vườn: 8 + 24 = 32 cây.'
        },
        {
          question: 'Mẹ có 36 cái bánh, chia đều vào 4 hộp. Sau đó mẹ tặng đi 2 hộp. Hỏi mẹ còn lại bao nhiêu cái bánh?',
          equation: '36 : 4 = 9 bánh/hộp ➜ Còn 2 hộp ➜ ❓',
          options: ['9 cái', '18 cái', '27 cái', '32 cái'],
          correctAnswer: 1,
          explanation: '🎈 Chuẩn! Mỗi hộp 36 : 4 = 9 cái. Còn lại 2 hộp: 9 x 2 = 18 cái bánh.'
        },
        {
          question: 'Lan có 25 000 đồng. Lan mua vở hết 12 000 đồng, rồi mẹ cho thêm 10 000 đồng. Hỏi Lan có bao nhiêu tiền?',
          equation: '25 000 - 12 000 + 10 000 = ❓',
          options: ['13 000 đ', '23 000 đ', '3000 đ', '47 000 đ'],
          correctAnswer: 1,
          explanation: '👏 Tuyệt vời! Làm lần lượt: 25 000 - 12 000 = 13 000, rồi 13 000 + 10 000 = 23 000 đồng.'
        },
        {
          question: 'Một đàn có 20 con gà và chó, đếm được tất cả 6 con chó. Hỏi cả đàn có bao nhiêu cái chân?',
          equation: 'Gà = 20 - 6 = 14 con (2 chân) | Chó = 6 con (4 chân)',
          options: ['40 chân', '52 chân', '60 chân', '80 chân'],
          correctAnswer: 1,
          explanation: '🏆 Siêu lắm! Gà: 14 x 2 = 28 chân. Chó: 6 x 4 = 24 chân. Tổng: 28 + 24 = 52 cái chân.'
        }
      ]
    },
    {
      id: 'chude_1001_1',
      title: 'Chủ đề 10: [1001 Toán Tư Duy] Tính nhanh phạm vi 20 & Dãy số quy luật',
      emoji: '⚡',
      stars: 6,
      lesson: {
        title: 'Mẹo Tính Nhanh Nhóm Tròn Chục & Dãy Số Quy Luật',
        badge: '📘 1001 TOÁN TƯ DUY LỚP 2',
        steps: [
          {
            title: '1. Mẹo tính nhanh nhóm các số tạo thành tròn chục (10)',
            desc: 'Cộng (trừ) các số có kết quả là số tròn chục trước rồi mới tính với các số còn lại.',
            formula: '4 + 5 + 6  ➜  (4 + 6) + 5  ➜  10 + 5 = 15',
            tip: '💡 Ghép các cặp số bạn thân (1+9, 2+8, 3+7, 4+6, 5+5) tạo thành 10!'
          },
          {
            title: '2. Tìm quy luật dãy số tăng/giảm thần tốc',
            desc: 'Quan sát hai số liền nhau: nếu tăng thì lấy số sau trừ số trước để tìm khoảng cách rồi cộng tiếp. Nếu giảm thì làm phép trừ.',
            formula: 'Dãy: 3, 6, 9, ❓  ➜  6 - 3 = 3 (Tăng 3)  ➜  9 + 3 = 12',
            tip: '🚀 Dãy số tăng dần thì cộng thêm, giảm dần thì trừ đi!'
          },
          {
            title: '3. Bài toán ngược (Tìm cái ban đầu & đã dùng)',
            desc: 'Tìm cái ban đầu ➜ làm phép cộng. Tìm cái đã dùng (đã bán, đã mất) ➜ làm phép trừ.',
            formula: 'Có 11 bao gạo, bán đi ❓ bao còn lại 6 bao  ➜  11 - 6 = 5 bao đã bán',
            tip: '⭐ Đọc kỹ câu hỏi để xác định tìm cái ban đầu hay cái đã mất!'
          }
        ]
      },
      quizzes: [
        {
          question: 'Điền số thích hợp vào chỗ chấm để tính nhanh: 8 + 6 + 2 = ❓',
          equation: '(8 + 2) + 6 = ❓',
          options: ['14', '16', '18', '15'],
          correctAnswer: 1,
          explanation: '🎉 Tuyệt vời! Ghép (8 + 2) = 10, rồi lấy 10 + 6 = 16.'
        },
        {
          question: 'Hai số tiếp theo của dãy số quy luật: 5, 10, 15, 20, ❓, ❓ là số nào?',
          equation: 'Dãy số tăng 5 đơn vị ➜ 20 + 5 = ❓',
          options: ['22 ; 24', '25 ; 30', '21 ; 26', '25 ; 35'],
          correctAnswer: 1,
          explanation: '🌟 Chính xác! Dãy số đếm nhảy 5 đơn vị: 20 + 5 = 25 và 25 + 5 = 30.'
        },
        {
          question: 'Cửa hàng có 15 thùng sữa, sau khi bán đi một số thùng thì còn 7 thùng. Hỏi cửa hàng đã bán bao nhiêu thùng?',
          equation: '15 - 7 = ❓ thùng sữa',
          options: ['6 thùng', '8 thùng', '9 thùng', '7 thùng'],
          correctAnswer: 1,
          explanation: '👏 Đúng rồi! Số thùng đã bán = 15 - 7 = 8 thùng sữa.'
        }
      ]
    },
    {
      id: 'chude_1001_2',
      title: 'Chủ đề 11: [1001 Toán Tư Duy] Phép cộng trừ có nhớ & Ba điểm thẳng hàng',
      emoji: '📏',
      stars: 6,
      lesson: {
        title: 'Bí Kíp Phép Tính Có Nhớ & Kiểm Tra Thẳng Hàng',
        badge: '📘 1001 TOÁN TƯ DUY LỚP 2',
        steps: [
          {
            title: '1. Quy tắc cộng có nhớ trong phạm vi 100',
            desc: 'Cộng từ phải sang trái. Nếu tổng từ 10 trở lên, viết chữ số hàng đơn vị và nhớ 1 sang lượt cộng tiếp theo.',
            formula: '27 + 28  ➜  7+8=15 (viết 5 nhớ 1)  ➜  2+2+1 = 5  ➜  55',
            tip: '✨ Nhớ cộng thêm 1 vào hàng chục bé nhé!'
          },
          {
            title: '2. Quy tắc trừ có nhớ trong phạm vi 100',
            desc: 'Nếu hàng đơn vị không trừ được, mượn 1 chục (cộng 10) để trừ rồi nhớ trả 1 sang số trừ.',
            formula: '52 - 27  ➜  12-7=5 (nhớ 1)  ➜  5-(2+1) = 2  ➜  25',
            tip: '💡 Mượn 1 chục thì phải trả 1 sang hàng chục số trừ!'
          },
          {
            title: '3. Ba điểm thẳng hàng',
            desc: 'Khi 3 điểm cùng nằm trên một đường thẳng thì ta nói ba điểm đó thẳng hàng.',
            formula: '⚫ (A) ────── ⚫ (B) ────── ⚫ (C)   ➜  A, B, C thẳng hàng',
            tip: '📐 Đặt thước kẻ nếu cả 3 điểm cùng chạm thước là thẳng hàng.'
          }
        ]
      },
      quizzes: [
        {
          question: 'Thực hiện phép cộng có nhớ: 47 + 38 = ❓',
          equation: '7+8=15 (viết 5 nhớ 1), 4+3+1=8 ➜ ❓',
          options: ['75', '85', '83', '87'],
          correctAnswer: 1,
          explanation: '🎉 Đỉnh quá! 7+8=15 (viết 5 nhớ 1), 4+3=7 thêm 1 là 8 ➜ Kết quả = 85.'
        },
        {
          question: 'Kết quả của phép trừ có nhớ: 63 - 28 = ❓',
          equation: '13-8=5 (nhớ 1), 6-(2+1)=3 ➜ ❓',
          options: ['35', '45', '38', '43'],
          correctAnswer: 0,
          explanation: '🌟 Chuẩn xác! 13-8=5, trả 1 vào 2 thành 3, 6-3=3 ➜ Kết quả = 35.'
        }
      ]
    },
    {
      id: 'chude_1001_5',
      title: 'Chủ đề 12: [1001 Toán Tư Duy] Mẹo đọc giờ kém & Bài toán trồng cây',
      emoji: '⏰',
      stars: 6,
      lesson: {
        title: 'Mẹo Đổi Giờ Kém Thần Tốc & Bài Toán Trồng Cây',
        badge: '📘 1001 TOÁN TƯ DUY LỚP 2',
        steps: [
          {
            title: '1. Mẹo tính số phút trên đồng hồ',
            desc: 'Số phút trên đồng hồ = (Số mà kim phút chỉ vào) x 5.',
            formula: 'Kim ngắn chỉ số 5, kim dài chỉ số 6  ➜  Phút = 6 x 5 = 30 phút  ➜  5 giờ 30',
            tip: '💡 Khoảng cách giữa 2 số liền nhau trên mặt đồng hồ luôn bằng 5 phút!'
          },
          {
            title: '2. Mẹo nói giờ kém chính xác',
            desc: 'Khi kim phút vượt quá số 6 (lớn hơn 30 phút), ta đổi sang giờ kém:',
            formula: 'Giờ kém = (Giờ hiện tại + 1) giờ kém (60 - Số phút hiện tại) phút',
            tip: '⏱️ Ví dụ: 7 giờ 35 phút  ➜  (7+1) giờ kém (60-35) phút  ➜  8 giờ kém 25 phút!'
          },
          {
            title: '3. Bài toán trồng cây 2 đầu đường',
            desc: 'Trồng cây trên đoạn đường ở cả 2 đầu: Số cây = (Độ dài đường : Khoảng cách) + 1.',
            formula: 'Đường dài 30m, cây cách 5m  ➜  30 : 5 = 6 khoảng  ➜  6 + 1 = 7 cây (1 bên)',
            tip: '🌲 Nếu trồng 2 bên đường thì bé lấy số cây 1 bên x 2!'
          }
        ]
      },
      quizzes: [
        {
          question: 'Đồng hồ chỉ 6 giờ 40 phút. Nói theo cách giờ kém là bao nhiêu?',
          equation: '(6 + 1) giờ kém (60 - 40) phút = ❓',
          options: ['7 giờ kém 20 phút', '6 giờ kém 20 phút', '7 giờ kém 40 phút', '8 giờ kém 20 phút'],
          correctAnswer: 0,
          explanation: '🎉 Chuẩn rồi! (6 + 1) = 7 giờ, (60 - 40) = 20 phút ➜ 7 giờ kém 20 phút.'
        },
        {
          question: 'Một đoạn đường dài 40m, hai đầu đường đều trồng cây. Mỗi cây cách nhau 10m. Hỏi trồng tất cả bao nhiêu cây trên 1 bên đường?',
          equation: '(40 : 10) + 1 = ❓ cây',
          options: ['4 cây', '5 cây', '6 cây', '8 cây'],
          correctAnswer: 1,
          explanation: '🌟 Bé giỏi quá! Số khoảng = 40 : 10 = 4. Số cây = 4 + 1 = 5 cây.'
        }
      ]
    },
    {
      id: 'chude_1001_6',
      title: 'Chủ đề 13: [1001 Toán Tư Duy] Phép chia chu kỳ dư & Bài toán đếm hình',
      emoji: '🧩',
      stars: 6,
      lesson: {
        title: 'Bí Kíp Phép Chia Chu Kỳ Dư & Đếm Đoạn Thẳng Không Sót',
        badge: '📘 1001 TOÁN TƯ DUY LỚP 2',
        steps: [
          {
            title: '1. Xác định sự vật theo chu kỳ lặp lại bằng số dư',
            desc: 'Bước 1: Tìm độ dài chu kỳ lặp lại (N). Bước 2: Lấy số thứ tự cần tìm chia cho N lấy số dư.',
            formula: 'Chu kỳ 3 màu (Đỏ-Xanh-Vàng). Hạt 14 : 3 = 4 dư 2 ➜ Hạt màu thứ 2 (Xanh)',
            tip: '💡 Dư 1 ➜ vật 1, Dư 2 ➜ vật 2, Dư 0 (chia hết) ➜ vật cuối chu kỳ!'
          },
          {
            title: '2. Phương pháp đếm đoạn thẳng thần tốc',
            desc: 'Đánh số 1, 2, 3... vào các khoảng nhỏ. Tổng số đoạn thẳng = 1 + 2 + 3 + ...',
            formula: '3 đoạn nhỏ trên 1 đường  ➜  Tổng đoạn = 1 + 2 + 3 = 6 đoạn thẳng',
            tip: '📐 Công thức đếm đoạn: n x (n+1) / 2 với n là số khoảng nhỏ!'
          }
        ]
      },
      quizzes: [
        {
          question: 'Dãy cờ treo theo thứ tự: Đỏ, Vàng, Xanh, Đỏ, Vàng, Xanh... Lá cờ thứ 20 là cờ màu gì?',
          equation: '20 chia 3 (chu kỳ 3 màu) = 6 dư 2 ➜ Màu thứ 2 là màu ❓',
          options: ['Màu Đỏ', 'Màu Vàng', 'Màu Xanh', 'Màu Tím'],
          correctAnswer: 1,
          explanation: '🎉 Đỉnh cao! 20 : 3 = 6 dư 2. Lá cờ thứ 2 trong chu kỳ (Đỏ, Vàng, Xanh) là màu Vàng!'
        },
        {
          question: 'Trên một đường thẳng có 4 điểm A, B, C, D nối tiếp nhau tạo thành 3 đoạn nhỏ. Hỏi có tất cả bao nhiêu đoạn thẳng?',
          equation: 'Công thức: 1 + 2 + 3 = ❓ đoạn',
          options: ['4 đoạn', '5 đoạn', '6 đoạn', '7 đoạn'],
          correctAnswer: 2,
          explanation: '🌟 Chuẩn xác! Đếm 3 đoạn đơn, 2 đoạn đôi, 1 đoạn ba: 3 + 2 + 1 = 6 đoạn thẳng.'
        }
      ]
    }
  ],

  // Nhánh tuổi teen (lớp 6+): toán gắn với quyết định thật của lứa tuổi —
  // tiền bạc, rủi ro, đọc số liệu trên báo, đo đạc ngoài đời.
  teens: [
    {
      id: 'tduy_logic',
      title: 'Suy luận logic & Tìm quy luật',
      subtitle: 'Rèn cách lập luận chặt chẽ, không đoán mò',
      emoji: '🧩',
      stars: 8,
      lesson: {
        title: 'Lập Luận Có Căn Cứ',
        badge: '🧠 TƯ DUY LOGIC',
        steps: [
          {
            title: '1. Suy luận loại trừ',
            desc: 'Khi có nhiều khả năng, hãy loại dần những khả năng mâu thuẫn với dữ kiện. Cái còn lại cuối cùng — dù trông khó tin — chính là đáp án.',
            formula: 'A không phải bác sĩ. B không phải bác sĩ. ➜ C là bác sĩ.',
            tip: '💡 Lập bảng đánh dấu ✓ / ✗ cho từng khả năng sẽ nhìn ra ngay.'
          },
          {
            title: '2. Tìm quy luật của dãy số',
            desc: 'Xét hiệu hai số liền nhau. Nếu hiệu không đều, thử xét tỉ số, hoặc xem số sau là tổng hai số trước.',
            formula: '1, 1, 2, 3, 5, 8, ... ➜ mỗi số = tổng hai số liền trước ➜ 13',
            tip: '🔍 Ba cách thử theo thứ tự: hiệu ➜ tỉ số ➜ quan hệ với các số trước.'
          },
          {
            title: '3. Mệnh đề đảo không đương nhiên đúng',
            desc: '"Nếu trời mưa thì đường ướt" là đúng, nhưng "đường ướt nên trời đã mưa" thì chưa chắc — có thể ai đó vừa rửa sân.',
            formula: 'P ➜ Q đúng KHÔNG có nghĩa Q ➜ P đúng',
            tip: '⚠️ Lỗi suy luận này bị lợi dụng rất nhiều trong quảng cáo và tin giả.'
          }
        ]
      },
      quizzes: [
        {
          question: 'Số tiếp theo của dãy: 2, 6, 12, 20, 30, ... là số nào?',
          equation: 'Hiệu: 4, 6, 8, 10 ➜ hiệu tiếp theo = ❓',
          options: ['40', '42', '44', '36'],
          correctAnswer: 1,
          explanation: '✅ Các hiệu tăng đều 2 đơn vị: 4, 6, 8, 10, 12. Vậy số tiếp theo là 30 + 12 = 42.'
        },
        {
          question: 'An, Bình, Chi mỗi bạn học một môn khác nhau: Toán, Văn, Anh. An không học Toán. Bình học Anh. Vậy Chi học môn gì?',
          equation: 'Bình = Anh ➜ An ∈ {Văn} (vì An ≠ Toán) ➜ Chi = ❓',
          options: ['Toán', 'Văn', 'Anh', 'Không xác định được'],
          correctAnswer: 0,
          explanation: '✅ Bình học Anh. An không học Toán nên An học Văn. Môn còn lại là Toán, thuộc về Chi.'
        },
        {
          question: 'Biết "Mọi học sinh giỏi đều chăm chỉ". Bạn Nam rất chăm chỉ. Kết luận nào ĐÚNG?',
          equation: 'Giỏi ➜ Chăm chỉ. Nam chăm chỉ ➜ ❓',
          options: [
            'Nam chắc chắn là học sinh giỏi',
            'Nam chắc chắn không giỏi',
            'Chưa thể kết luận Nam có giỏi hay không',
            'Nam vừa giỏi vừa không giỏi'
          ],
          correctAnswer: 2,
          explanation: '✅ Đây đúng là bẫy mệnh đề đảo. Giỏi thì chăm chỉ, nhưng chăm chỉ chưa chắc đã giỏi — chưa đủ dữ kiện để kết luận.'
        },
        {
          question: 'Một cái ao có bèo, mỗi ngày diện tích bèo tăng gấp đôi. Sau 30 ngày bèo phủ kín ao. Hỏi ngày thứ mấy bèo phủ được nửa ao?',
          equation: 'Gấp đôi mỗi ngày ➜ ngày trước khi đầy thì được ❓',
          options: ['Ngày 15', 'Ngày 20', 'Ngày 29', 'Ngày 25'],
          correctAnswer: 2,
          explanation: '✅ Vì mỗi ngày gấp đôi, nên ngày liền trước lúc đầy ao chính là lúc nửa ao: ngày thứ 29. Tăng theo cấp số nhân luôn phản trực giác như vậy.'
        },
        {
          question: 'Ba hộp: một hộp toàn bi đỏ, một hộp toàn bi xanh, một hộp lẫn cả hai. Cả ba hộp đều dán nhãn SAI. Cần bốc ít nhất mấy viên để biết chắc nhãn đúng của cả ba hộp?',
          equation: 'Bốc từ hộp dán nhãn "lẫn lộn" ➜ ❓ viên',
          options: ['1 viên', '2 viên', '3 viên', 'Không thể biết được'],
          correctAnswer: 0,
          explanation: '✅ Chỉ cần 1 viên, bốc từ hộp dán nhãn "lẫn lộn". Vì nhãn sai nên hộp đó thuần một màu — màu viên bốc ra cho biết ngay hộp đó là gì, hai hộp còn lại suy ra bằng loại trừ.'
        }
      ]
    },
    {
      id: 'tduy_phan_tram',
      title: 'Tỉ lệ, Phần trăm & Lãi suất',
      subtitle: 'Hiểu đúng con số trên bảng giảm giá và sổ tiết kiệm',
      emoji: '💹',
      stars: 8,
      lesson: {
        title: 'Phần Trăm Trong Đời Sống',
        badge: '💰 TIỀN BẠC & SỐ LIỆU',
        steps: [
          {
            title: '1. Ba dạng bài phần trăm gốc',
            desc: 'Mọi bài phần trăm đều quy về một trong ba câu hỏi: tìm phần trăm của một số, tìm tổng khi biết phần trăm, hoặc tìm tỉ lệ phần trăm giữa hai số.',
            formula: 'a% của b = b x a/100   |   Tỉ lệ = (phần / tổng) x 100%',
            tip: '💡 Mẹo nhẩm: 10% là chia 10, 5% là một nửa của 10%, 15% = 10% + 5%.'
          },
          {
            title: '2. Giảm giá liên tiếp không cộng dồn',
            desc: 'Giảm 20% rồi giảm tiếp 10% KHÔNG bằng giảm 30%. Lần giảm thứ hai tính trên giá đã giảm, chứ không phải giá gốc.',
            formula: '100 ➜ giảm 20% = 80 ➜ giảm tiếp 10% = 72 (tức giảm 28%, không phải 30%)',
            tip: '🛍️ Đây là mẹo tâm lý các cửa hàng hay dùng — biết rồi thì khó bị hớ.'
          },
          {
            title: '3. Lãi kép: tiền sinh ra tiền',
            desc: 'Lãi đơn chỉ tính trên vốn gốc. Lãi kép cộng lãi vào gốc rồi kỳ sau tính lãi trên tổng mới — nên càng để lâu càng tăng nhanh.',
            formula: 'Sau n kỳ: A = V x (1 + r)ⁿ   (V: vốn, r: lãi suất mỗi kỳ)',
            tip: '⭐ Đây là lý do gửi tiết kiệm sớm có lợi, và cũng là lý do nợ tín dụng rất nguy hiểm.'
          }
        ]
      },
      quizzes: [
        {
          question: 'Một chiếc áo giá 450 000 đồng đang giảm 20%. Giá phải trả là bao nhiêu?',
          equation: '450 000 x (100% - 20%) = ❓',
          options: ['90 000 đ', '360 000 đ', '380 000 đ', '430 000 đ'],
          correctAnswer: 1,
          explanation: '✅ Giảm 20% nghĩa là trả 80%: 450 000 x 0,8 = 360 000 đồng.'
        },
        {
          question: 'Cửa hàng ghi "Giảm 20%, giảm tiếp 10% cho hoá đơn". Một món 1 000 000 đồng cuối cùng còn bao nhiêu?',
          equation: '1 000 000 x 0,8 x 0,9 = ❓',
          options: ['700 000 đ', '720 000 đ', '750 000 đ', '800 000 đ'],
          correctAnswer: 1,
          explanation: '✅ 1 000 000 x 0,8 = 800 000, rồi 800 000 x 0,9 = 720 000 đồng. Tổng mức giảm thực là 28%, không phải 30%.'
        },
        {
          question: 'Lớp có 40 học sinh, trong đó 14 bạn tham gia câu lạc bộ thể thao. Tỉ lệ phần trăm là bao nhiêu?',
          equation: '(14 / 40) x 100% = ❓',
          options: ['28%', '30%', '35%', '40%'],
          correctAnswer: 2,
          explanation: '✅ 14 : 40 = 0,35 ➜ 35% học sinh của lớp.'
        },
        {
          question: 'Gửi tiết kiệm 10 000 000 đồng, lãi suất 6%/năm, lãi nhập gốc. Sau 2 năm nhận về bao nhiêu (làm tròn nghìn)?',
          equation: '10 000 000 x (1 + 0,06)² = ❓',
          options: ['11 200 000 đ', '11 236 000 đ', '11 600 000 đ', '12 000 000 đ'],
          correctAnswer: 1,
          explanation: '✅ 10 000 000 x 1,06 x 1,06 = 11 236 000 đồng. Nhiều hơn lãi đơn (11 200 000) đúng 36 000 đồng — đó là phần "lãi của lãi".'
        },
        {
          question: 'Giá xăng tăng 25%, sau đó giảm 20%. So với ban đầu, giá hiện tại thế nào?',
          equation: 'x ➜ x·1,25 ➜ x·1,25·0,8 = ❓',
          options: [
            'Cao hơn ban đầu 5%',
            'Đúng bằng ban đầu',
            'Thấp hơn ban đầu 5%',
            'Cao hơn ban đầu 25%'
          ],
          correctAnswer: 1,
          explanation: '✅ 1,25 x 0,8 = 1,0 — quay về đúng giá ban đầu. Tăng x% rồi giảm y% không triệt tiêu nhau trừ khi tính đúng như thế này.'
        }
      ]
    },
    {
      id: 'tduy_xac_suat',
      title: 'Xác suất & Đọc hiểu biểu đồ',
      subtitle: 'Không bị số liệu đánh lừa',
      emoji: '🎲',
      stars: 8,
      lesson: {
        title: 'Con Số Biết Nói Dối',
        badge: '📊 XÁC SUẤT & THỐNG KÊ',
        steps: [
          {
            title: '1. Xác suất của biến cố',
            desc: 'Với các kết quả đồng khả năng, xác suất = số kết quả thuận lợi chia cho tổng số kết quả có thể xảy ra. Giá trị luôn nằm giữa 0 và 1.',
            formula: 'P(A) = số kết quả thuận lợi / tổng số kết quả   ➜   P(mặt 6) = 1/6',
            tip: '🎲 Xúc xắc không có trí nhớ: vừa ra 6 ba lần thì lần sau vẫn là 1/6.'
          },
          {
            title: '2. Trung bình cộng có thể che giấu sự thật',
            desc: 'Trung bình cộng bị kéo lệch bởi giá trị cực đoan. Khi dữ liệu lệch, trung vị (số ở giữa) mô tả trung thực hơn.',
            formula: 'Lương: 5, 6, 6, 7, 100 triệu ➜ Trung bình 24,8 | Trung vị 6',
            tip: '📌 Nghe "thu nhập trung bình" hãy hỏi ngay: trung vị là bao nhiêu?'
          },
          {
            title: '3. Tương quan không phải nhân quả',
            desc: 'Hai đại lượng cùng tăng chưa chắc cái này gây ra cái kia — có thể do một nguyên nhân thứ ba, hoặc trùng hợp ngẫu nhiên.',
            formula: 'Doanh số kem ↑ và số vụ đuối nước ↑ ➜ nguyên nhân chung: trời nóng',
            tip: '⚠️ Biểu đồ cắt trục tung không từ 0 làm chênh lệch nhỏ trông như khổng lồ.'
          }
        ]
      },
      quizzes: [
        {
          question: 'Gieo một con xúc xắc 6 mặt cân đối. Xác suất được số chấm chẵn là bao nhiêu?',
          equation: 'Thuận lợi: {2, 4, 6} ➜ P = ❓',
          options: ['1/6', '1/3', '1/2', '2/3'],
          correctAnswer: 2,
          explanation: '✅ Có 3 kết quả thuận lợi trên 6 kết quả: 3/6 = 1/2.'
        },
        {
          question: 'Hộp có 5 bi đỏ và 15 bi xanh. Lấy ngẫu nhiên 1 viên, xác suất được bi đỏ là bao nhiêu?',
          equation: 'P = 5 / (5 + 15) = ❓',
          options: ['1/3', '1/4', '1/5', '1/15'],
          correctAnswer: 1,
          explanation: '✅ Tổng 20 viên, thuận lợi 5 viên: 5/20 = 1/4 = 25%.'
        },
        {
          question: 'Dãy điểm kiểm tra: 3, 5, 5, 6, 6, 6, 9. Trung vị của dãy là bao nhiêu?',
          equation: 'Sắp thứ tự, lấy giá trị ở giữa (vị trí thứ 4) ➜ ❓',
          options: ['5', '6', '5,7', '9'],
          correctAnswer: 1,
          explanation: '✅ Dãy có 7 giá trị, trung vị là giá trị thứ 4 khi đã sắp xếp — chính là 6.'
        },
        {
          question: 'Một xúc xắc vừa ra mặt 6 liên tiếp 4 lần. Lần gieo thứ 5, xác suất ra mặt 6 là bao nhiêu?',
          equation: 'Các lần gieo độc lập ➜ P = ❓',
          options: ['Nhỏ hơn 1/6 vì đã ra quá nhiều', '1/6 như mọi lần', 'Lớn hơn 1/6 vì đang "may"', '1/30'],
          correctAnswer: 1,
          explanation: '✅ Vẫn đúng 1/6. Tin rằng "sắp đổi vận" là ngộ nhận con bạc — mỗi lần gieo hoàn toàn độc lập với quá khứ.'
        },
        {
          question: 'Nghiên cứu thấy: thành phố nào nhiều nhà sách hơn thì tỉ lệ tội phạm cũng cao hơn. Kết luận nào hợp lý nhất?',
          equation: 'Tương quan ≠ ❓',
          options: [
            'Nhà sách làm tăng tội phạm',
            'Nên đóng bớt nhà sách để giảm tội phạm',
            'Cả hai cùng tăng theo dân số thành phố',
            'Người đọc sách dễ phạm tội hơn'
          ],
          correctAnswer: 2,
          explanation: '✅ Thành phố đông dân thì vừa nhiều nhà sách vừa nhiều vụ việc. Dân số là biến thứ ba gây ra cả hai — tương quan không phải nhân quả.'
        }
      ]
    },
    {
      id: 'tduy_hinh_hoc',
      title: 'Hình học thực tế: Diện tích, Thể tích, Pythagore',
      subtitle: 'Đo đạc và ước lượng ngoài đời',
      emoji: '📐',
      stars: 8,
      lesson: {
        title: 'Hình Học Dùng Được Ngay',
        badge: '📏 ĐO ĐẠC THỰC TẾ',
        steps: [
          {
            title: '1. Định lý Pythagore',
            desc: 'Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông. Dùng để tính khoảng cách không đo trực tiếp được.',
            formula: 'a² + b² = c²   ➜   3² + 4² = 5²   (bộ ba 3-4-5)',
            tip: '💡 Thợ xây dùng đúng bộ ba 3-4-5 để kiểm tra góc tường có vuông không.'
          },
          {
            title: '2. Diện tích và chu vi không tỉ lệ với nhau',
            desc: 'Cùng một chu vi, hình vuông cho diện tích lớn nhất trong các hình chữ nhật. Tăng cạnh gấp đôi thì diện tích gấp 4, không phải gấp 2.',
            formula: 'Cạnh x2 ➜ Diện tích x4 ➜ Thể tích x8',
            tip: '📦 Đây là lý do hộp to gấp đôi chứa được gấp 8 lần đồ.'
          },
          {
            title: '3. Thể tích hình hộp và hình trụ',
            desc: 'Thể tích = diện tích đáy nhân chiều cao. Quy tắc này đúng cho cả hình hộp chữ nhật lẫn hình trụ.',
            formula: 'V hộp = a x b x h   |   V trụ = π x r² x h',
            tip: '🧊 1 dm³ = 1 lít — mẹo đổi thể tích sang dung tích rất hay dùng.'
          }
        ]
      },
      quizzes: [
        {
          question: 'Một cái thang dài 5 m dựng vào tường, chân thang cách tường 3 m. Thang chạm tường ở độ cao bao nhiêu?',
          equation: 'h² = 5² - 3² = ❓',
          options: ['2 m', '4 m', '4,5 m', '8 m'],
          correctAnswer: 1,
          explanation: '✅ h² = 25 - 9 = 16 ➜ h = 4 m. Đúng bộ ba Pythagore quen thuộc 3-4-5.'
        },
        {
          question: 'Mảnh đất hình chữ nhật dài 12 m, rộng 8 m. Cần bao nhiêu mét hàng rào để rào quanh?',
          equation: 'Chu vi = (12 + 8) x 2 = ❓',
          options: ['20 m', '40 m', '48 m', '96 m'],
          correctAnswer: 1,
          explanation: '✅ Chu vi = (12 + 8) x 2 = 40 m. Lưu ý câu hỏi hỏi hàng rào (chu vi), không phải diện tích.'
        },
        {
          question: 'Bể cá hình hộp chữ nhật dài 8 dm, rộng 5 dm, cao 4 dm. Bể chứa tối đa bao nhiêu lít nước?',
          equation: 'V = 8 x 5 x 4 (dm³), biết 1 dm³ = 1 lít ➜ ❓',
          options: ['80 lít', '120 lít', '160 lít', '17 lít'],
          correctAnswer: 2,
          explanation: '✅ V = 8 x 5 x 4 = 160 dm³ = 160 lít.'
        },
        {
          question: 'Một hình vuông có cạnh tăng gấp đôi. Diện tích mới so với diện tích cũ thế nào?',
          equation: 'S = a² ➜ (2a)² = ❓',
          options: ['Gấp 2 lần', 'Gấp 3 lần', 'Gấp 4 lần', 'Gấp 8 lần'],
          correctAnswer: 2,
          explanation: '✅ (2a)² = 4a² — diện tích gấp 4 lần. Nếu là khối lập phương thì thể tích gấp 8 lần.'
        },
        {
          question: 'Với 20 m hàng rào rào một mảnh đất hình chữ nhật, kích thước nào cho diện tích LỚN NHẤT?',
          equation: 'Chu vi 20 m ➜ dài + rộng = 10 m ➜ ❓',
          options: ['9 m x 1 m', '7 m x 3 m', '6 m x 4 m', '5 m x 5 m'],
          correctAnswer: 3,
          explanation: '✅ Lần lượt: 9, 21, 24, 25 m². Với chu vi cố định, hình vuông luôn cho diện tích lớn nhất.'
        }
      ]
    }
  ],
}

// Bổ sung các câu chuyện Cổ Tích Về Lô-Gíc (Kurio Logic Stories)
export const logicStories = [
  {
    id: 'logic_story_1',
    title: 'Cổ tích Lô-gíc 01: Cuộc bầu cử chọn thủ lĩnh rừng xanh',
    emoji: '🦁',
    coverBadge: 'TRUYỆN TRANH LÔ-GÍC',
    summary: 'Sư Tử tổ chức cuộc bầu cử công bằng. Các muông thú phải dùng lập luận để chọn ra người lãnh đạo thông thái nhất!',
    pages: [
      {
        page: 1,
        title: 'Ngày hội bầu cử của Vương quốc Rừng Xanh 🌳',
        text: 'Muôn loài tập hợp lại dưới gốc cây cổ thụ. Có 3 ứng viên tranh cử: Cáo Ma Thuật 🦊, Voi Dũng Cảm 🐘 và Khỉ Thông Thái 🐵. Sư Tử đưa ra thử thách logic để tìm thủ lĩnh.',
        dialogue: {
          character: 'Sư Tử',
          avatar: '🦁',
          text: 'Ai trả lời đúng câu đố chọn biểu tượng giống nhau của các bạn sẽ thắng cuộc!'
        }
      },
      {
        page: 2,
        title: 'Thử thách phát hiện điểm chung ✦',
        text: 'An có (▲, ◯, ▢). Minh có (♥, ▢, ★). Chi có (★, ▲, ✦). Hai ứng viên Minh và Chi có điểm chung duy nhất ở biểu tượng nào?',
        dialogue: {
          character: 'Khỉ Thông Thái',
          avatar: '🐵',
          text: 'Thưa Sư Tử, Minh có ngôi sao ★ và Chi cũng có ngôi sao ★!'
        }
      }
    ],
    quiz: {
      question: 'Minh và Chi cùng giống nhau hình biểu tượng nào?',
      options: ['Hình tam giác ▲', 'Hình vuông ▢', 'Hình ngôi sao ★', 'Hình trái tim ♥'],
      correctAnswer: 2,
      explanation: '🎉 Đúng rồi! Minh sở hữu (♥, ▢, ★) và Chi sở hữu (★, ▲, ✦). Điểm chung duy nhất là hình ngôi sao ★!'
    }
  },
  {
    id: 'logic_story_2',
    title: 'Cổ tích Lô-gíc 02: Bí mật kẻ ăn vụng cá',
    emoji: '🐱',
    coverBadge: 'VỤ ÁN LÔ-GÍC',
    summary: 'Mẹ mèo vừa nướng 3 con cá ngon lành thì 1 con biến mất! Hãy giúp Thám tử Mèo Mèo dùng phương pháp suy luận loại trừ tìm ra đáp án.',
    pages: [
      {
        page: 1,
        title: 'Bữa trưa mất tích dưới mái nhà 🏠',
        text: 'Có 3 nghi phạm: Mèo Vàng 🐱, Chó Đốm 🐶 và Cáo Nhỏ 🦊. Mèo Vàng ngủ cả buổi. Chó Đốm bị xích ở cổng. Cáo Nhỏ vừa chạy ra từ bếp với vết mỡ trên mép!',
        dialogue: {
          character: 'Thám tử Mèo',
          avatar: '🕵️',
          text: 'Dựa vào vết mỡ và chứng cứ vắng mặt, ai mới là thủ phạm thực sự?'
        }
      }
    ],
    quiz: {
      question: 'Dựa vào các chứng cứ trên, ai đã lấy con cá?',
      options: ['Mèo Vàng 🐱', 'Chó Đốm 🐶', 'Cáo Nhỏ 🦊', 'Không ai cả'],
      correctAnswer: 2,
      explanation: '🎉 Xuất sắc! Mèo Vàng ngủ, Chó Đốm bị xích ở xa, chỉ có Cáo Nhỏ có dấu mỡ ở mép nên Cáo Nhỏ là thủ phạm.'
    }
  },
  {
    id: 'logic_story_3',
    title: 'Cổ tích Lô-gíc 03: Lạc vào Xứ sở Bánh Ngọt',
    emoji: '🧁',
    coverBadge: 'PHIÊU LƯU KỲ DIỆU',
    summary: 'Bé Bông lạc vào Vương quốc Bánh Ngọt và phải vượt qua Ma trận Hạt Dẻ để tìm đường về nhà!',
    pages: [
      {
        page: 1,
        title: 'Cánh cổng kẹo sô-cô-la 🍫',
        text: 'Muốn qua cổng, Bé Bông phải đếm chính xác số hạt dẻ xung quanh ô ma trận có số 3.',
        dialogue: {
          character: 'Công chúa Kẹo',
          avatar: '👸',
          text: 'Xung quanh ô điền số 3 có bao nhiêu hạt dẻ nào Bé Bông?'
        }
      }
    ],
    quiz: {
      question: 'Ô số 3 ở giữa có xung quanh bao nhiêu hạt dẻ?',
      options: ['1 hạt', '2 hạt', '3 hạt dẻ 🌰', '4 hạt'],
      correctAnswer: 2,
      explanation: '🎉 Bé giỏi quá! Ô có số 3 nghĩa là có đúng 3 hạt dẻ kề bên ô đó!'
    }
  }
]

// Dữ liệu Bản Đồ Hành Trình (Learning Journey Path Map - Kurio Style)
export const journeyMapData = [
  {
    id: 1, level: 1, title: 'Cộng trừ siêu tốc', status: 'completed', stars: 3, icon: '🧮',
    lesson: {
      badge: '⚡ TÍNH NHẨM SIÊU TỐC',
      title: 'Bí Kíp Nhóm Số Tròn Chục Super Fast',
      subtitle: 'Tách ghép các cặp số có tổng bằng 10, 20 hoặc 100 để tính trong 3 giây!',
      type: 'quick_addition',
      dialogue: { boyQuestion: 'Làm sao để cộng (18 + 25 + 12) trong 2 giây?', girlAnswer: 'Ghép (18 + 12) = 30 trước, rồi 30 + 25 = 55 siêu dễ!' }
    }
  },
  {
    id: 2, level: 2, title: 'Chữ số La Mã & Mẹo Tay', status: 'current', timer: '13:20:35', icon: '🖐️',
    lesson: {
      badge: 'MẸO ĐẾM THỜI GIAN',
      title: 'Số La Mã (I, V, X, L) & Số Ngày Trên Khớp Tay',
      subtitle: 'Thuộc lòng I, V, X, L, C và mẹo đếm tháng 30 hay 31 ngày trên khớp ngón tay!',
      type: 'roman_numerals',
      dialogue: { boyQuestion: 'Tháng 7 và Tháng 8 có bao nhiêu ngày?', girlAnswer: 'Cả hai tháng 7 và 8 đều ở đỉnh khớp tay nên đều có 31 ngày!' }
    }
  },
  { id: 3, level: 3, title: 'Rương Kho Báu 1', status: 'chest', isChest: true, rewardStars: 15, icon: '🎁' },
  {
    id: 4, level: 4, title: 'Dãy Số Quy Luật & Đếm Lịch', status: 'locked', icon: '✊',
    lesson: {
      badge: 'TƯ DUY QUY LUẬT',
      title: 'Nhận Biết Dãy Số Quy Luật & Ngày Tháng',
      subtitle: 'Quan sát khoảng cách giữa các số để điền số tiếp theo chính xác!',
      type: 'number_pattern',
      dialogue: { boyQuestion: 'Dãy số 3, 6, 12, 24... số tiếp theo là gì?', girlAnswer: 'Mỗi số gấp đôi số trước, nên số tiếp theo là 24 x 2 = 48!' }
    }
  },
  {
    id: 5, level: 5, title: 'Ma trận Hạt Dẻ Sudoku', status: 'locked', icon: '🌰',
    lesson: {
      badge: 'MA TRẬN LÔ-GÍC',
      title: 'Ma Trận Ô Số Hạt Dẻ & Phép Suy Luận',
      subtitle: 'Tư duy loại trừ ô trống để lấp đầy bảng số Sudoku mini!',
      type: 'sudoku_matrix',
      dialogue: { boyQuestion: 'Trong ma trận 3x3, mỗi dòng phải chứa đủ 1, 2, 3!', girlAnswer: 'Dòng 1 có 1 và 3 rồi, ô trống còn lại chắc chắn là số 2!' }
    }
  },
  {
    id: 6, level: 6, title: 'Thử Thách Đĩa Cân 5 Loại Quả', status: 'locked', icon: '🍎',
    lesson: {
      badge: 'TƯ DUY CÂN BẰNG',
      title: 'Bài Toán Đĩa Cân & Tỉ Lệ Trọng Lượng',
      subtitle: 'Suy luận logic từ 2 đĩa cân để tìm quả nặng nhất hoặc nhẹ nhất!',
      type: 'scale_balance',
      dialogue: { boyQuestion: '1 Táo = 2 Cam, 1 Cam = 3 Dâu. 1 Táo bằng mấy Dâu?', girlAnswer: 'Thay 2 Cam = 2 x 3 = 6 Dâu! Vậy 1 Táo bằng 6 Dâu!' }
    }
  },
  { id: 7, level: 7, title: 'Luyện thi IKMC Quốc Tế', status: 'locked', icon: '🏆' },
  { id: 8, level: 8, title: 'Đấu Trường Cao Thủ 1v1', status: 'locked', icon: '⚔️' },
  {
    id: 9, level: 9, title: 'Bài Toán Hơn Kém Nhau', status: 'locked', icon: '📏',
    lesson: {
      badge: 'TOÁN ỨNG DỤNG',
      title: 'Giải Bài Toán Về Hơn Kém Nhau',
      subtitle: 'Tìm số lớn, số bé khi biết tổng và hiệu hoặc số hơn kém!',
      type: 'more_less',
      dialogue: { boyQuestion: 'An có 15 bi, Bình nhiều hơn An 6 bi. Bình có bao nhiêu bi?', girlAnswer: 'Muốn tìm số nhiều hơn, lấy số của An cộng thêm 6: 15 + 6 = 21 bi!' }
    }
  },
  {
    id: 10, level: 10, title: 'Xem Đồng Hồ & Giờ Phút', status: 'locked', icon: '⏰',
    lesson: {
      badge: 'ĐO LƯỜNG THỰC TẾ',
      title: 'Đọc Đồng Hồ Kim & Bài Toán Thời Gian',
      subtitle: 'Kim ngắn chỉ giờ, kim dài chỉ phút. 1 giờ = 60 phút!',
      type: 'clock_time',
      dialogue: { boyQuestion: 'Kim ngắn chỉ số 4, kim dài chỉ số 3 là mấy giờ?', girlAnswer: 'Số 3 tương ứng 3 x 5 = 15 phút. Đó là 4 giờ 15 phút!' }
    }
  },
  { id: 11, level: 11, title: 'Rương Kho Báu 2', status: 'chest', isChest: true, rewardStars: 25, icon: '🎁' },
  {
    id: 12, level: 12, title: 'Hình Học & Khối Lập Phương', status: 'locked', icon: '🧊',
    lesson: {
      badge: 'HÌNH HỌC KHÔNG GIAN',
      title: 'Đếm Số Khối Lập Phương Bị Che Khuất',
      subtitle: 'Đếm đủ các khối lập phương ở hàng trước và hàng đằng sau!',
      type: 'cube_counting',
      dialogue: { boyQuestion: 'Làm sao đếm được số khối bị đè bên dưới?', girlAnswer: 'Đếm từng cột từ trên xuống dưới, không bỏ sót cột nào!' }
    }
  },
  {
    id: 13, level: 13, title: 'Đơn Vị Đo Lường (Lít, Kg, m)', status: 'locked', icon: '⚖️',
    lesson: {
      badge: 'ĐO LƯỜNG CHUẨN SGK',
      title: 'Chuyển Đổi Đơn Vị Đo Khối Lượng & Dung Tích',
      subtitle: '1 kg = 1000 g | 1 l = 1000 ml | 1 m = 100 cm',
      type: 'unit_conversion',
      dialogue: { boyQuestion: 'Can 5 lít và can 2 lít đong được 3 lít nước bằng cách nào?', girlAnswer: 'Đổ đầy can 5 lít rồi rót sang can 2 lít, trong can 5 lít còn đúng 3 lít!' }
    }
  },
  {
    id: 14, level: 14, title: 'Bảng Nhân & Tính Nhẩm', status: 'locked', icon: '✖️',
    lesson: {
      badge: 'PHÉP NHÂN NỀN TẢNG',
      title: 'Bản Đồ Bảng Nhân & Mẹo Nhân 5',
      subtitle: 'Mọi số nhân với 5 đều có tận cùng là 0 hoặc 5!',
      type: 'multiplication_tables',
      dialogue: { boyQuestion: 'Mẹo nhớ bảng nhân 5 siêu tốc là gì?', girlAnswer: 'Số chẵn x 5 đuôi là 0, số lẻ x 5 đuôi là 5!' }
    }
  },
  { id: 15, level: 15, title: 'Rương Kho Báu Vàng', status: 'chest', isChest: true, rewardStars: 50, icon: '👑' }
]

export function getDynamicQuizForNode(node, grade = 2) {
  const nType = node.lesson?.type || 'quick_addition'

  if (nType === 'quick_addition') {
    const a = Math.floor(Math.random() * 30) + 12
    const b = Math.floor(Math.random() * 30) + 15
    const c = 20 - (a % 10)
    const ans = a + b + c
    return {
      question: `Bé hãy tính nhẩm siêu tốc biểu thức: (${a} + ${b} + ${c}) = ❓`,
      options: [`${ans}`, `${ans - 2}`, `${ans + 5}`, `${ans - 10}`],
      correctAnswer: 0,
      explanation: `🎉 Xuất sắc! Nhóm (${a} + ${c}) = ${a + c}, sau đó + ${b} = ${ans}!`
    }
  }

  if (nType === 'roman_numerals') {
    const vals = [
      { r: 'XIV', n: 14 }, { r: 'XIX', n: 19 }, { r: 'XXIV', n: 24 }, { r: 'XXIX', n: 29 }, { r: 'XLV', n: 45 }
    ]
    const pick = vals[Math.floor(Math.random() * vals.length)]
    return {
      question: `Chữ số La Mã "${pick.r}" biểu diễn số nào trong hệ số thập phân?`,
      options: [`${pick.n}`, `${pick.n + 2}`, `${pick.n - 5}`, `${pick.n + 10}`],
      correctAnswer: 0,
      explanation: `🎉 Chính xác! ${pick.r} chính là số ${pick.n}!`
    }
  }

  if (nType === 'number_pattern') {
    const start = Math.floor(Math.random() * 5) + 2
    const step = Math.floor(Math.random() * 4) + 3
    const n1 = start
    const n2 = start + step
    const n3 = start + step * 2
    const n4 = start + step * 3
    const ans = start + step * 4
    return {
      question: `Tìm số tiếp theo trong dãy số quy luật: ${n1}, ${n2}, ${n3}, ${n4}, ❓`,
      options: [`${ans}`, `${ans + 2}`, `${ans - 3}`, `${ans + 5}`],
      correctAnswer: 0,
      explanation: `🎉 Tuyệt vời! Quy luật là mỗi số sau bằng số trước cộng ${step}. Vậy số tiếp theo là ${ans}!`
    }
  }

  if (nType === 'scale_balance') {
    const apples = Math.floor(Math.random() * 3) + 2
    const oranges = apples * 2
    return {
      question: `Nếu 1 Quả Táo 🍎 nặng bằng 2 Quả Cam 🍊. Vậy ${apples} Quả Táo 🍎 nặng bằng bao nhiêu Quả Cam 🍊?`,
      options: [`${oranges} Quả Cam 🍊`, `${oranges + 2} Quả Cam`, `${oranges - 1} Quả Cam`, `${oranges * 2} Quả Cam`],
      correctAnswer: 0,
      explanation: `🎉 Giỏi quá! 1 Táo = 2 Cam, nên ${apples} Táo = ${apples} x 2 = ${oranges} Cam!`
    }
  }

  if (nType === 'clock_time') {
    const hour = Math.floor(Math.random() * 11) + 1
    const minPos = Math.floor(Math.random() * 4) * 3 + 3 // 3, 6, 9, 12
    const mins = minPos === 12 ? 0 : minPos * 5
    return {
      question: `Đồng hồ có kim ngắn chỉ số ${hour}, kim dài chỉ số ${minPos}. Lúc này là mấy giờ?`,
      options: [
        `${hour} giờ ${mins > 0 ? mins + ' phút' : 'đúng'}`,
        `${hour + 1} giờ 15 phút`,
        `${hour} giờ 45 phút`,
        `${hour - 1} giờ 30 phút`
      ],
      correctAnswer: 0,
      explanation: `🎉 Chuẩn xác! Kim dài chỉ số ${minPos} tương ứng ${mins} phút, vậy đó là ${hour} giờ ${mins > 0 ? mins + ' phút' : 'đúng'}!`
    }
  }

  if (nType === 'more_less') {
    const a = Math.floor(Math.random() * 20) + 10
    const diff = Math.floor(Math.random() * 8) + 2
    const ans = a + diff
    return {
      question: `Bạn An có ${a} hòn bi, bạn Bình có nhiều hơn bạn An ${diff} hòn bi. Hỏi bạn Bình có bao nhiêu hòn bi?`,
      options: [`${ans} hòn bi`, `${ans - diff}`, `${ans + 5}`, `${ans - 2}`],
      correctAnswer: 0,
      explanation: `🎉 Đúng rồi! Muốn tìm số bi của Bình, ta lấy số bi của An cộng với số bi nhiều hơn: ${a} + ${diff} = ${ans} hòn bi!`
    }
  }

  // Fallback default quiz
  return {
    question: `Em hãy chọn đáp án đúng cho phép tính: ${grade * 12} + ${grade * 8} = ❓`,
    options: [`${grade * 20}`, `${grade * 20 - 5}`, `${grade * 20 + 10}`, `${grade * 15}`],
    correctAnswer: 0,
    explanation: `🎉 Đúng rồi! ${grade * 12} + ${grade * 8} = ${grade * 20}!`
  }
}

