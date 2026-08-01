// Dữ liệu Sách Giáo Khoa Lớp 8 - Bộ Kết nối tri thức với cuộc sống (bản hiện hành, nhúng sẵn câu trắc nghiệm, không cần API)
// Cấu trúc bám sát mục lục chính thức: Toán 8 Tập 1 (Chương I-V, Bài 1-20), Toán 8 Tập 2 (Chương VI-X, Bài 21-39),
// Ngữ văn 8 Tập 1 (Bài 1-5), Ngữ văn 8 Tập 2 (Bài 6-10). Tuần theo PPCT 35 tuần.
export const textbookData8 = [
  {
    "id": "toan8_t1",
    "subject": "Toán",
    "grade": 8,
    "volume": "Tập 1 (Chương I - V)",
    "emoji": "📐",
    "color": "#0ea5e9",
    "stars": 10,
    "lessons": [
      {
        "id": "toan8_t1_bai1",
        "week": 1,
        "title": "Bài 1: Đơn thức",
        "content": "🌅 BÀI HỌC\n\n“ĐƠN THỨC”\n\nĐơn thức là nền tảng đầu tiên của đại số lớp 8: mọi biểu thức đại số phức tạp đều được xây dựng từ những đơn thức.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Đơn thức là biểu thức đại số chỉ gồm một số, hoặc một biến, hoặc một tích giữa số và các biến. Ví dụ: 3x²y, -5, x.\n\n• Đơn thức thu gọn là đơn thức chỉ gồm một hệ số và một phần biến (mỗi biến chỉ xuất hiện một lần). Ví dụ: 2x³y là đơn thức thu gọn, còn 2x·x không phải.\n\n• Hệ số là phần số, phần biến là phần chữ. Ví dụ: đơn thức -7x²y có hệ số -7, phần biến x²y.\n\n• Bậc của đơn thức (có hệ số khác 0) là tổng số mũ của tất cả các biến. Ví dụ: 4x²y³ có bậc 2 + 3 = 5.\n\n• Nhân hai đơn thức: nhân hệ số với hệ số, nhân phần biến với phần biến. Ví dụ: 2x²y · 3xy³ = 6x³y⁴.\n\n• Hai đơn thức đồng dạng là hai đơn thức có cùng phần biến. Ví dụ: 5x²y và -2x²y đồng dạng.",
        "quizzes": [
          {
            "question": "Biểu thức nào sau đây là một đơn thức?",
            "options": ["3x²y - 1", "4x²y", "2x + 3", "5/x"],
            "correctAnswer": 1,
            "explanation": "✅ 4x²y là tích giữa số và biến nên là đơn thức; các biểu thức còn lại chứa phép cộng (đa thức) hoặc biến ở mẫu."
          },
          {
            "question": "Bậc của đơn thức 4x²y³ là:",
            "options": ["5", "6", "2", "12"],
            "correctAnswer": 0,
            "explanation": "✅ Bậc của đơn thức bằng tổng số mũ của các biến: 2 + 3 = 5."
          },
          {
            "question": "Đơn thức nào sau đây đồng dạng với 5x²y³?",
            "options": ["5xy²", "x²y³", "5x²y²", "5x³y²"],
            "correctAnswer": 1,
            "explanation": "✅ Hai đơn thức đồng dạng phải có cùng phần biến x²y³ (hệ số có thể khác nhau)."
          },
          {
            "question": "Kết quả của phép nhân 2x²y · 3xy³ là:",
            "options": ["6x²y³", "5x³y⁴", "6x³y⁴", "6x²y⁴"],
            "correctAnswer": 2,
            "explanation": "✅ Nhân hệ số: 2·3 = 6; nhân phần biến: x²·x = x³, y·y³ = y⁴. Kết quả 6x³y⁴."
          }
        ]
      },
      {
        "id": "toan8_t1_bai2",
        "week": 1,
        "title": "Bài 2: Đa thức",
        "content": "🌅 BÀI HỌC\n\n“ĐA THỨC”\n\nĐa thức là tổng của những đơn thức. Đây là đối tượng trung tâm của chương I.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Đa thức là tổng của những đơn thức. Mỗi đơn thức trong tổng gọi là một hạng tử. Ví dụ: x² + 3x - 2 là đa thức có ba hạng tử.\n\n• Đa thức thu gọn là đa thức không còn hạng tử nào đồng dạng với nhau. Muốn thu gọn, ta cộng các hạng tử đồng dạng lại.\n\n• Bậc của đa thức (dạng thu gọn) là bậc của hạng tử có bậc cao nhất. Ví dụ: đa thức x³ + 2x² - x + 5 có bậc 3.\n\n• Đa thức không là đa thức chỉ gồm hạng tử 0, không có bậc.\n\n• Để tính giá trị của đa thức tại một giá trị của biến, ta thay giá trị đó vào đa thức rồi tính toán.",
        "quizzes": [
          {
            "question": "Bậc của đa thức x³ + 2x² - x + 5 là:",
            "options": ["1", "2", "3", "5"],
            "correctAnswer": 2,
            "explanation": "✅ Bậc của đa thức là bậc của hạng tử cao nhất: hạng tử x³ có bậc 3."
          },
          {
            "question": "Thu gọn đa thức x² + 3x - 2x + 4 ta được:",
            "options": ["x² + x + 4", "x² + 5x + 4", "x² - x + 4", "x² + 3x - 4"],
            "correctAnswer": 0,
            "explanation": "✅ Cộng hai hạng tử đồng dạng: 3x - 2x = x. Kết quả x² + x + 4."
          },
          {
            "question": "Giá trị của đa thức P(x) = x² - 2x + 1 tại x = 3 là:",
            "options": ["4", "2", "6", "9"],
            "correctAnswer": 0,
            "explanation": "✅ Thay x = 3: 3² - 2·3 + 1 = 9 - 6 + 1 = 4."
          },
          {
            "question": "Đa thức nào sau đây có hạng tử bậc cao nhất là bậc 2?",
            "options": ["x³ - 1", "x² + 2x - 1", "x + 5", "x⁴ - x"],
            "correctAnswer": 1,
            "explanation": "✅ Đa thức x² + 2x - 1 có hạng tử cao nhất là x² (bậc 2)."
          }
        ]
      },
      {
        "id": "toan8_t1_bai3",
        "week": 2,
        "title": "Bài 3: Phép cộng và phép trừ đa thức",
        "content": "🌅 BÀI HỌC\n\n“PHÉP CỘNG VÀ PHÉP TRỪ ĐA THỨC”\n\nCộng, trừ đa thức chính là “gom” các hạng tử đồng dạng lại với nhau.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Cộng hai đa thức: viết các hạng tử nối nhau bằng dấu +, rồi thu gọn các hạng tử đồng dạng.\n\n• Trừ hai đa thức: lấy đa thức thứ nhất cộng với đa thức đối của đa thức thứ hai. Đa thức đối của A là -A (đổi dấu mọi hạng tử).\n\n• Chỉ cộng trừ được các hạng tử đồng dạng (cùng phần biến).\n\n• Ví dụ: (x² + 3x) + (2x² - x) = 3x² + 2x; (2a + 3b) - (a - b) = a + 4b.\n\n→ Nhờ cộng trừ đa thức, ta có thể tính toán các biểu thức trong khoa học và đời sống.",
        "quizzes": [
          {
            "question": "Kết quả của (x² + 3x) + (2x² - x) là:",
            "options": ["3x² + 2x", "3x² + 4x", "x² + 2x", "3x² - 2x"],
            "correctAnswer": 0,
            "explanation": "✅ (x² + 2x²) + (3x - x) = 3x² + 2x."
          },
          {
            "question": "Kết quả của (4x²y - 2xy) - (2x²y + xy) là:",
            "options": ["2x²y - 3xy", "2x²y + xy", "6x²y - 3xy", "2x²y - xy"],
            "correctAnswer": 0,
            "explanation": "✅ Đổi dấu đa thức thứ hai rồi thu gọn: (4x²y - 2x²y) + (-2xy - xy) = 2x²y - 3xy."
          },
          {
            "question": "Tổng của hai đa thức A = x² + 2x - 1 và B = 2x² - 3x + 4 là:",
            "options": ["3x² - x + 3", "3x² + x + 3", "x² - 5x + 3", "3x² - x - 3"],
            "correctAnswer": 0,
            "explanation": "✅ (x² + 2x²) + (2x - 3x) + (-1 + 4) = 3x² - x + 3."
          },
          {
            "question": "Kết quả của (2a + 3b) - (a - b) là:",
            "options": ["a + 4b", "a + 2b", "3a + 2b", "a - 4b"],
            "correctAnswer": 0,
            "explanation": "✅ (2a - a) + (3b + b) = a + 4b. Nhớ đổi dấu -b thành +b khi bỏ ngoặc."
          }
        ]
      },
      {
        "id": "toan8_t1_bai4",
        "week": 2,
        "title": "Bài 4: Phép nhân đa thức",
        "content": "🌅 BÀI HỌC\n\n“PHÉP NHÂN ĐA THỨC”\n\nNhân đa thức giúp biến đổi biểu thức phức tạp thành dạng thu gọn quen thuộc.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Nhân đơn thức với đa thức: nhân đơn thức với từng hạng tử của đa thức rồi cộng kết quả. Ví dụ: 2x(x² - 3x + 1) = 2x³ - 6x² + 2x.\n\n• Nhân đa thức với đa thức: nhân từng hạng tử của đa thức này với từng hạng tử của đa thức kia rồi cộng các tích lại.\n\n• Ví dụ: (x + 2)(x - 3) = x·x + x·(-3) + 2·x + 2·(-3) = x² - x - 6.\n\n• Sau khi nhân, luôn nhớ thu gọn các hạng tử đồng dạng.\n\n→ Phép nhân đa thức là công cụ để biểu diễn và tính toán trong nhiều bài toán thực tế.",
        "quizzes": [
          {
            "question": "Kết quả của 2x(x² - 3x + 1) là:",
            "options": ["2x³ - 6x² + 2x", "2x³ - 3x + 1", "2x² - 6x + 2", "2x³ - 6x² + 1"],
            "correctAnswer": 0,
            "explanation": "✅ Nhân 2x với từng hạng tử: 2x·x² = 2x³, 2x·(-3x) = -6x², 2x·1 = 2x."
          },
          {
            "question": "Kết quả của (x + 2)(x - 3) là:",
            "options": ["x² - x - 6", "x² + x - 6", "x² - 5x - 6", "x² - 6"],
            "correctAnswer": 0,
            "explanation": "✅ x·x + x·(-3) + 2·x + 2·(-3) = x² - 3x + 2x - 6 = x² - x - 6."
          },
          {
            "question": "Kết quả của (2x + 1)(x² - x) là:",
            "options": ["2x³ - 2x² + x² - x", "2x³ - x² - x", "2x³ + x² - x", "2x³ - x² + x"],
            "correctAnswer": 1,
            "explanation": "✅ 2x·x² + 2x·(-x) + 1·x² + 1·(-x) = 2x³ - 2x² + x² - x = 2x³ - x² - x."
          },
          {
            "question": "Tích của (x - 1)(x + 1) bằng:",
            "options": ["x² - 1", "x² + 1", "x² - 2x + 1", "x² + 2x + 1"],
            "correctAnswer": 0,
            "explanation": "✅ x·x + x·1 - 1·x - 1·1 = x² - 1 (đây chính là hiệu hai bình phương)."
          }
        ]
      },
      {
        "id": "toan8_t1_bai5",
        "week": 3,
        "title": "Bài 5: Phép chia đa thức cho đơn thức",
        "content": "🌅 BÀI HỌC\n\n“PHÉP CHIA ĐA THỨC CHO ĐƠN THỨC”\n\nChia đa thức cho đơn thức giúp rút gọn biểu thức, tương tự như việc rút gọn phân số.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Điều kiện: mỗi hạng tử của đa thức phải chia hết cho đơn thức (phần biến của đơn thức phải có mặt trong phần biến của mỗi hạng tử).\n\n• Quy tắc: chia từng hạng tử của đa thức cho đơn thức rồi cộng các kết quả lại.\n\n• Chia đơn thức cho đơn thức: chia hệ số cho hệ số, chia từng phần biến (lấy số mũ trừ đi).\n\n• Ví dụ: 12x⁵y³ : 4x²y = 3x³y²; (15x⁴ + 10x³) : 5x² = 3x² + 2x.\n\n→ Phép chia đa thức được dùng khi đơn giản hóa các công thức trong vật lí và kinh tế.",
        "quizzes": [
          {
            "question": "Kết quả của 12x⁵y³ : 4x²y là:",
            "options": ["3x³y²", "8x³y²", "3x⁷y⁴", "3x³y³"],
            "correctAnswer": 0,
            "explanation": "✅ 12:4 = 3; x⁵:x² = x³; y³:y = y². Kết quả 3x³y²."
          },
          {
            "question": "Kết quả của (15x⁴ + 10x³) : 5x² là:",
            "options": ["3x² + 2x", "3x² + 10x", "15x² + 2x", "3x² + 2x³"],
            "correctAnswer": 0,
            "explanation": "✅ Chia từng hạng tử: 15x⁴:5x² = 3x²; 10x³:5x² = 2x. Kết quả 3x² + 2x."
          },
          {
            "question": "Kết quả của (8a³b - 4ab) : 2ab là:",
            "options": ["4a² - 2", "4a² - 4ab", "6a²b - 2", "4a³ - 2ab"],
            "correctAnswer": 0,
            "explanation": "✅ 8a³b:2ab = 4a²; 4ab:2ab = 2. Kết quả 4a² - 2."
          },
          {
            "question": "Để đa thức chia hết cho đơn thức, cần điều kiện gì?",
            "options": ["Mọi hạng tử đều chia hết cho đơn thức", "Đa thức phải có ít nhất 3 hạng tử", "Đơn thức phải có hệ số bằng 1", "Đa thức phải là đa thức thu gọn"],
            "correctAnswer": 0,
            "explanation": "✅ Điều kiện chia hết là mỗi hạng tử của đa thức đều chia hết cho đơn thức."
          }
        ]
      },
      {
        "id": "toan8_t1_bai6",
        "week": 4,
        "title": "Bài 6: Hiệu hai bình phương. Bình phương của một tổng hay một hiệu",
        "content": "🌅 BÀI HỌC\n\n“HẰNG ĐẲNG THỨC ĐÁNG NHỚ (1)”\n\nBa hằng đẳng thức đầu tiên giúp khai triển và biến đổi nhanh các biểu thức bình phương.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n1️⃣ Bình phương của một tổng: (a + b)² = a² + 2ab + b²\n\n2️⃣ Bình phương của một hiệu: (a - b)² = a² - 2ab + b²\n\n3️⃣ Hiệu hai bình phương: a² - b² = (a - b)(a + b)\n\n• Áp dụng: (x + 3)² = x² + 6x + 9; x² - 16 = (x - 4)(x + 4).\n\n• Mẹo tính nhanh: 101² = (100 + 1)² = 10000 + 200 + 1 = 10201.\n\n→ Hằng đẳng thức giúp tính nhẩm nhanh và là nền tảng để phân tích đa thức thành nhân tử.",
        "quizzes": [
          {
            "question": "Khai triển (x + 3)² ta được:",
            "options": ["x² + 9", "x² + 3x + 9", "x² + 6x + 9", "x² - 6x + 9"],
            "correctAnswer": 2,
            "explanation": "✅ (a + b)² = a² + 2ab + b² với a = x, b = 3: x² + 2·x·3 + 3² = x² + 6x + 9."
          },
          {
            "question": "Khai triển (a - 5)² ta được:",
            "options": ["a² - 25", "a² - 5a + 25", "a² - 10a - 25", "a² - 10a + 25"],
            "correctAnswer": 3,
            "explanation": "✅ (a - b)² = a² - 2ab + b²: a² - 2·a·5 + 25 = a² - 10a + 25."
          },
          {
            "question": "Phân tích x² - 16 thành nhân tử được:",
            "options": ["(x - 4)²", "(x - 8)(x + 2)", "(x - 4)(x + 4)", "(x + 4)²"],
            "correctAnswer": 2,
            "explanation": "✅ Áp dụng hiệu hai bình phương: x² - 4² = (x - 4)(x + 4)."
          },
          {
            "question": "Tính nhanh 101² bằng hằng đẳng thức được kết quả:",
            "options": ["10001", "10201", "10211", "10101"],
            "correctAnswer": 1,
            "explanation": "✅ 101² = (100 + 1)² = 100² + 2·100·1 + 1² = 10000 + 200 + 1 = 10201."
          }
        ]
      },
      {
        "id": "toan8_t1_bai7",
        "week": 5,
        "title": "Bài 7: Lập phương của một tổng. Lập phương của một hiệu",
        "content": "🌅 BÀI HỌC\n\n“HẰNG ĐẲNG THỨC ĐÁNG NHỚ (2)”\n\nTiếp tục với hai hằng đẳng thức bậc ba: lập phương của một tổng và lập phương của một hiệu.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n4️⃣ Lập phương của một tổng: (a + b)³ = a³ + 3a²b + 3ab² + b³\n\n5️⃣ Lập phương của một hiệu: (a - b)³ = a³ - 3a²b + 3ab² - b³\n\n• Ví dụ: (x + 1)³ = x³ + 3x² + 3x + 1; (2a - b)³ = 8a³ - 12a²b + 6ab² - b³.\n\n• Ghi nhớ: các hạng tử đan dấu +, - xen kẽ và hệ số 1, 3, 3, 1.\n\n→ Hằng đẳng thức bậc ba xuất hiện trong các bài toán tính nhanh và phân tích nhân tử nâng cao.",
        "quizzes": [
          {
            "question": "Khai triển (x + 1)³ ta được:",
            "options": ["x³ + 3x² + 3x + 1", "x³ + x² + x + 1", "x³ + 3x + 1", "x³ + 3x² + 1"],
            "correctAnswer": 0,
            "explanation": "✅ (a + b)³ = a³ + 3a²b + 3ab² + b³: x³ + 3x² + 3x + 1."
          },
          {
            "question": "Khai triển (2a - b)³ ta được:",
            "options": ["8a³ - 12a²b + 6ab² - b³", "8a³ - 6a²b + 12ab² - b³", "8a³ - b³", "2a³ - 3a²b + 3ab² - b³"],
            "correctAnswer": 0,
            "explanation": "✅ (a - b)³ = a³ - 3a²b + 3ab² - b³, thay a = 2a: 8a³ - 12a²b + 6ab² - b³."
          },
          {
            "question": "Biểu thức x³ + 6x² + 12x + 8 là khai triển của:",
            "options": ["(x + 2)³", "(x + 8)³", "(x + 6)³", "(x + 4)³"],
            "correctAnswer": 0,
            "explanation": "✅ (x + 2)³ = x³ + 3·x²·2 + 3·x·2² + 2³ = x³ + 6x² + 12x + 8."
          },
          {
            "question": "Khai triển (a - 2b)³ ta được:",
            "options": ["a³ - 6a²b + 12ab² - 8b³", "a³ - 6a²b - 8b³", "a³ + 6a²b + 12ab² + 8b³", "a³ - 2a²b + 4ab² - 8b³"],
            "correctAnswer": 0,
            "explanation": "✅ a³ - 3·a²·2b + 3·a·(2b)² - (2b)³ = a³ - 6a²b + 12ab² - 8b³."
          }
        ]
      },
      {
        "id": "toan8_t1_bai8",
        "week": 5,
        "title": "Bài 8: Tổng và hiệu hai lập phương",
        "content": "🌅 BÀI HỌC\n\n“HẰNG ĐẲNG THỨC ĐÁNG NHỚ (3)”\n\nHai hằng đẳng thức cuối cùng biến đổi tổng, hiệu hai lập phương thành tích.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n6️⃣ Tổng hai lập phương: a³ + b³ = (a + b)(a² - ab + b²)\n\n7️⃣ Hiệu hai lập phương: a³ - b³ = (a - b)(a² + ab + b²)\n\n• Chú ý dấu: trong nhân tử thứ hai luôn là a² ∓ ab + b² (dấu trùng với nhân tử thứ nhất).\n\n• Ví dụ: x³ + 8 = (x + 2)(x² - 2x + 4); a³ - 27 = (a - 3)(a² + 3a + 9).\n\n→ Bảy hằng đẳng thức đáng nhớ là công cụ biến đổi biểu thức quan trọng nhất của lớp 8.",
        "quizzes": [
          {
            "question": "Phân tích x³ + 8 thành nhân tử được:",
            "options": ["(x + 2)(x² - 2x + 4)", "(x + 2)(x² + 2x + 4)", "(x + 2)(x² - 4)", "(x - 2)(x² + 2x + 4)"],
            "correctAnswer": 0,
            "explanation": "✅ a³ + b³ = (a + b)(a² - ab + b²): x³ + 2³ = (x + 2)(x² - 2x + 4)."
          },
          {
            "question": "Phân tích a³ - 27 thành nhân tử được:",
            "options": ["(a - 3)(a² + 3a + 9)", "(a - 3)(a² - 3a + 9)", "(a + 3)(a² - 3a + 9)", "(a - 27)(a + 27)"],
            "correctAnswer": 0,
            "explanation": "✅ a³ - b³ = (a - b)(a² + ab + b²): a³ - 3³ = (a - 3)(a² + 3a + 9)."
          },
          {
            "question": "Khai triển (x + 2)(x² - 2x + 4) ta được:",
            "options": ["x³ - 8", "x³ + 8", "x³ + 2x² + 8", "x³ - 2x² + 8"],
            "correctAnswer": 1,
            "explanation": "✅ Đây chính là tổng hai lập phương: (x + 2)(x² - 2x + 4) = x³ + 2³ = x³ + 8."
          },
          {
            "question": "Khai triển (2x + y)(4x² - 2xy + y²) ta được:",
            "options": ["8x³ + y³", "8x³ - y³", "2x³ + y³", "8x³ + 4xy + y³"],
            "correctAnswer": 0,
            "explanation": "✅ (2x)³ + y³ = 8x³ + y³ vì (2x + y)((2x)² - 2x·y + y²) là tổng hai lập phương."
          }
        ]
      },
      {
        "id": "toan8_t1_bai9",
        "week": 6,
        "title": "Bài 9: Phân tích đa thức thành nhân tử",
        "content": "🌅 BÀI HỌC\n\n“PHÂN TÍCH ĐA THỨC THÀNH NHÂN TỬ”\n\nPhân tích đa thức thành nhân tử là biến đổi đa thức thành tích của các đa thức khác — chìa khóa giải phương trình và rút gọn phân thức.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Phương pháp 1 — Đặt nhân tử chung: tìm nhân tử chung của các hạng tử. Ví dụ: 6x²y + 9xy² = 3xy(2x + 3y).\n\n• Phương pháp 2 — Dùng hằng đẳng thức: nhận ra dạng a² ± 2ab + b², a² - b², a³ ± b³... Ví dụ: x² - 4x + 4 = (x - 2)².\n\n• Phương pháp 3 — Nhóm hạng tử: nhóm các hạng tử có nhân tử chung rồi đặt ra. Ví dụ: xy + xz + 3y + 3z = (x + 3)(y + z).\n\n• Kiểm tra bằng cách nhân lại kết quả.\n\n→ Phân tích nhân tử dùng để giải phương trình bậc hai và rút gọn phân thức ở chương VI.",
        "quizzes": [
          {
            "question": "Phân tích 6x²y + 9xy² thành nhân tử được:",
            "options": ["3xy(2x + 3y)", "3xy(2x - 3y)", "xy(6x + 9y)", "3x²y²(2 + 3)"],
            "correctAnswer": 0,
            "explanation": "✅ Nhân tử chung là 3xy: 6x²y:3xy = 2x; 9xy²:3xy = 3y."
          },
          {
            "question": "Phân tích x² - 4x + 4 thành nhân tử được:",
            "options": ["(x - 2)²", "(x + 2)²", "(x - 2)(x + 2)", "(x - 4)²"],
            "correctAnswer": 0,
            "explanation": "✅ Nhận ra bình phương của một hiệu: x² - 2·x·2 + 2² = (x - 2)²."
          },
          {
            "question": "Phân tích 2x² + 2x thành nhân tử được:",
            "options": ["2x(x + 1)", "2(x² + x)²", "x(2x + 2x)", "2x²(1 + x)"],
            "correctAnswer": 0,
            "explanation": "✅ Đặt nhân tử chung 2x: 2x²:2x = x; 2x:2x = 1. Kết quả 2x(x + 1)."
          },
          {
            "question": "Phân tích xy + xz + 3y + 3z thành nhân tử (nhóm hạng tử) được:",
            "options": ["(x + 3)(y + z)", "(x - 3)(y + z)", "(x + y)(3 + z)", "(x + z)(y + 3)"],
            "correctAnswer": 0,
            "explanation": "✅ Nhóm: (xy + xz) + (3y + 3z) = x(y + z) + 3(y + z) = (x + 3)(y + z)."
          }
        ]
      },
      {
        "id": "toan8_t1_bai10",
        "week": 7,
        "title": "Bài 10: Tứ giác",
        "content": "🌅 BÀI HỌC\n\n“TỨ GIÁC”\n\nBắt đầu chương hình học quan trọng: Tứ giác — nền tảng của mọi hình học phẳng phức tạp hơn.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Tứ giác là hình gồm bốn đoạn thẳng khép kín, không có ba điểm nào thẳng hàng.\n\n• Tứ giác lồi là tứ giác luôn nằm trong một nửa mặt phẳng có bờ là đường thẳng chứa bất kì cạnh nào.\n\n• Định lí: Tổng các góc trong của một tứ giác bằng 360°.\n\n• Góc ngoài của tứ giác là góc kề bù với một góc trong.\n\n• Các loại tứ giác đặc biệt sẽ học tiếp: hình thang, hình bình hành, hình chữ nhật, hình thoi, hình vuông.",
        "quizzes": [
          {
            "question": "Tổng các góc trong của một tứ giác bằng:",
            "options": ["180°", "270°", "360°", "540°"],
            "correctAnswer": 2,
            "explanation": "✅ Tổng các góc trong của tứ giác luôn bằng 360°."
          },
          {
            "question": "Một tứ giác có ba góc lần lượt 90°, 100°, 80°. Góc còn lại bằng:",
            "options": ["90°", "80°", "100°", "120°"],
            "correctAnswer": 0,
            "explanation": "✅ Góc còn lại = 360° - (90° + 100° + 80°) = 90°."
          },
          {
            "question": "Tứ giác lồi là tứ giác:",
            "options": ["Luôn nằm trong nửa mặt phẳng có bờ là đường thẳng chứa bất kì cạnh nào", "Có 4 cạnh bằng nhau", "Có các góc đối bằng nhau", "Có hai đường chéo vuông góc"],
            "correctAnswer": 0,
            "explanation": "✅ Đó chính là định nghĩa tứ giác lồi trong SGK."
          },
          {
            "question": "Hình nào sau đây là một tứ giác?",
            "options": ["Hình tam giác", "Hình có 4 đoạn thẳng khép kín, không có ba đỉnh thẳng hàng", "Hình tròn", "Hình có 5 cạnh"],
            "correctAnswer": 1,
            "explanation": "✅ Tứ giác gồm bốn đoạn thẳng khép kín, không có ba điểm nào thẳng hàng."
          }
        ]
      },
      {
        "id": "toan8_t1_bai11",
        "week": 7,
        "title": "Bài 11: Hình thang cân",
        "content": "🌅 BÀI HỌC\n\n“HÌNH THANG CÂN”\n\nHình thang cân là hình thang đặc biệt xuất hiện nhiều trong kiến trúc và đời sống.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hình thang là tứ giác có hai cạnh đối song song. Hai cạnh song song gọi là hai đáy, hai cạnh còn lại là hai cạnh bên.\n\n• Hình thang cân là hình thang có hai góc kề một đáy bằng nhau.\n\n• Tính chất: hình thang cân có hai cạnh bên bằng nhau và hai đường chéo bằng nhau.\n\n• Dấu hiệu nhận biết: hình thang có hai đường chéo bằng nhau là hình thang cân; hình thang có hai góc kề một đáy bằng nhau là hình thang cân.",
        "quizzes": [
          {
            "question": "Hình thang cân là hình thang có:",
            "options": ["Hai góc kề một đáy bằng nhau", "Bốn cạnh bằng nhau", "Hai đường chéo vuông góc", "Một góc vuông"],
            "correctAnswer": 0,
            "explanation": "✅ Đây là định nghĩa hình thang cân trong SGK."
          },
          {
            "question": "Trong hình thang cân ABCD (AB ∥ CD), hai đường chéo:",
            "options": ["Bằng nhau", "Vuông góc", "Song song", "Chia đôi mỗi đường"],
            "correctAnswer": 0,
            "explanation": "✅ Hình thang cân có hai đường chéo bằng nhau."
          },
          {
            "question": "Hình thang có hai đường chéo bằng nhau là:",
            "options": ["Hình thang cân", "Hình thang vuông", "Hình bình hành", "Hình chữ nhật"],
            "correctAnswer": 0,
            "explanation": "✅ Đây là dấu hiệu nhận biết hình thang cân."
          },
          {
            "question": "Hình thang cân ABCD (AB ∥ CD, AB < CD) có góc D = 70°. Góc C bằng:",
            "options": ["70°", "110°", "90°", "60°"],
            "correctAnswer": 0,
            "explanation": "✅ Hai góc kề một đáy của hình thang cân bằng nhau, nên góc C = góc D = 70°."
          }
        ]
      },
      {
        "id": "toan8_t1_bai12",
        "week": 8,
        "title": "Bài 12: Hình bình hành",
        "content": "🌅 BÀI HỌC\n\n“HÌNH BÌNH HÀNH”\n\nHình bình hành là hình tứ giác đặc biệt có hai cặp cạnh đối song song.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hình bình hành là tứ giác có hai cặp cạnh đối song song.\n\n• Tính chất:\n  - Các cạnh đối bằng nhau.\n  - Các góc đối bằng nhau.\n  - Hai đường chéo cắt nhau tại trung điểm của mỗi đường.\n\n• Dấu hiệu nhận biết (tứ giác là hình bình hành nếu):\n  - Hai cặp cạnh đối song song.\n  - Hai cặp cạnh đối bằng nhau.\n  - Hai cạnh đối song song và bằng nhau.\n  - Hai góc đối bằng nhau.\n  - Hai đường chéo cắt nhau tại trung điểm mỗi đường.",
        "quizzes": [
          {
            "question": "Trong hình bình hành, hai đường chéo:",
            "options": ["Cắt nhau tại trung điểm của mỗi đường", "Bằng nhau", "Vuông góc với nhau", "Song song với nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Hai đường chéo của hình bình hành cắt nhau tại trung điểm mỗi đường."
          },
          {
            "question": "Tứ giác có hai cạnh đối song song và bằng nhau là:",
            "options": ["Hình bình hành", "Hình thang cân", "Hình chữ nhật", "Hình thoi"],
            "correctAnswer": 0,
            "explanation": "✅ Đây là một dấu hiệu nhận biết hình bình hành."
          },
          {
            "question": "Hình bình hành ABCD có góc A = 70°. Góc C bằng:",
            "options": ["70°", "110°", "90°", "140°"],
            "correctAnswer": 0,
            "explanation": "✅ Hai góc đối của hình bình hành bằng nhau, nên góc C = góc A = 70°."
          },
          {
            "question": "Khẳng định nào sau đây đúng với hình bình hành?",
            "options": ["Các cạnh đối bằng nhau", "Bốn góc bằng nhau", "Bốn cạnh bằng nhau", "Hai đường chéo bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Các cạnh đối của hình bình hành bằng nhau. Bốn góc/cạnh bằng nhau là tính chất của hình chữ nhật/hình thoi."
          }
        ]
      },
      {
        "id": "toan8_t1_bai13",
        "week": 9,
        "title": "Bài 13: Hình chữ nhật",
        "content": "🌅 BÀI HỌC\n\n“HÌNH CHỮ NHẬT”\n\nHình chữ nhật là hình bình hành có bốn góc vuông — hình quen thuộc nhất trong đời sống.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hình chữ nhật là tứ giác có bốn góc vuông.\n\n• Hình chữ nhật cũng là một hình bình hành, nên có đầy đủ tính chất của hình bình hành.\n\n• Tính chất đặc trưng: hai đường chéo của hình chữ nhật bằng nhau (và cắt nhau tại trung điểm mỗi đường).\n\n• Dấu hiệu nhận biết:\n  - Tứ giác có ba góc vuông.\n  - Hình bình hành có một góc vuông.\n  - Hình bình hành có hai đường chéo bằng nhau.",
        "quizzes": [
          {
            "question": "Trong hình chữ nhật, hai đường chéo:",
            "options": ["Bằng nhau", "Vuông góc với nhau", "Song song", "Bằng một nửa chu vi"],
            "correctAnswer": 0,
            "explanation": "✅ Hai đường chéo của hình chữ nhật bằng nhau và cắt nhau tại trung điểm mỗi đường."
          },
          {
            "question": "Hình bình hành có một góc vuông là:",
            "options": ["Hình chữ nhật", "Hình thoi", "Hình thang cân", "Hình vuông"],
            "correctAnswer": 0,
            "explanation": "✅ Đây là dấu hiệu nhận biết hình chữ nhật."
          },
          {
            "question": "Tứ giác có ba góc vuông thì góc còn lại là:",
            "options": ["Góc vuông", "Góc nhọn", "Góc tù", "Góc bẹt"],
            "correctAnswer": 0,
            "explanation": "✅ Tổng bốn góc bằng 360°, ba góc vuông chiếm 270° nên góc còn lại là 90°."
          },
          {
            "question": "Khẳng định nào sau đây đúng?",
            "options": ["Hình chữ nhật là hình bình hành có một góc vuông", "Hình chữ nhật không phải hình bình hành", "Hình chữ nhật có các cạnh đối song song và các đường chéo vuông góc", "Hình chữ nhật có bốn cạnh bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Hình chữ nhật là hình bình hành (có hai cặp cạnh đối song song) có thêm một góc vuông."
          }
        ]
      },
      {
        "id": "toan8_t1_bai14",
        "week": 9,
        "title": "Bài 14: Hình thoi và hình vuông",
        "content": "🌅 BÀI HỌC\n\n“HÌNH THOI VÀ HÌNH VUÔNG”\n\nHai hình đặc biệt cuối cùng của chương Tứ giác với nhiều tính chất đối xứng đẹp.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hình thoi là tứ giác có bốn cạnh bằng nhau. Tính chất: hai đường chéo vuông góc và cắt nhau tại trung điểm mỗi đường; hai đường chéo là các đường phân giác của các góc.\n\n• Hình vuông là tứ giác có bốn góc vuông và bốn cạnh bằng nhau. Hình vuông vừa là hình chữ nhật vừa là hình thoi.\n\n• Dấu hiệu nhận biết hình thoi: hình bình hành có hai cạnh kề bằng nhau, hoặc hai đường chéo vuông góc, hoặc một đường chéo là phân giác của một góc.\n\n• Dấu hiệu nhận biết hình vuông: hình chữ nhật có hai cạnh kề bằng nhau (hoặc hai đường chéo vuông góc); hình thoi có một góc vuông (hoặc hai đường chéo bằng nhau).",
        "quizzes": [
          {
            "question": "Tính chất nào sau đây là của hình thoi?",
            "options": ["Hai đường chéo vuông góc với nhau", "Hai đường chéo bằng nhau", "Bốn góc vuông", "Hai cạnh kề vuông góc"],
            "correctAnswer": 0,
            "explanation": "✅ Đường chéo hình thoi vuông góc và cắt nhau tại trung điểm mỗi đường."
          },
          {
            "question": "Hình chữ nhật có hai cạnh kề bằng nhau là:",
            "options": ["Hình vuông", "Hình thoi", "Hình thang cân", "Hình bình hành"],
            "correctAnswer": 0,
            "explanation": "✅ Đây là dấu hiệu nhận biết hình vuông."
          },
          {
            "question": "Hình vuông có bao nhiêu trục đối xứng?",
            "options": ["4", "2", "1", "8"],
            "correctAnswer": 0,
            "explanation": "✅ Hình vuông có 4 trục đối xứng: hai đường chéo và hai đường thẳng qua trung điểm các cạnh đối."
          },
          {
            "question": "Khẳng định nào sau đây đúng?",
            "options": ["Hình vuông vừa là hình chữ nhật vừa là hình thoi", "Hình thoi là hình chữ nhật", "Hình chữ nhật có đường chéo vuông góc", "Hình thoi có bốn góc vuông"],
            "correctAnswer": 0,
            "explanation": "✅ Hình vuông có đủ tính chất của cả hình chữ nhật và hình thoi."
          }
        ]
      },
      {
        "id": "toan8_t1_bai15",
        "week": 10,
        "title": "Bài 15: Định lí Thalès trong tam giác",
        "content": "🌅 BÀI HỌC\n\n“ĐỊNH LÍ THALÈS TRONG TAM GIÁC”\n\nĐịnh lí Thalès là công cụ mạnh mẽ để tính tỉ số các đoạn thẳng khi có đường thẳng song song.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Định lí Thalès (thuận): Nếu một đường thẳng song song với một cạnh của tam giác và cắt hai cạnh còn lại thì nó định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ.\n\n  Ví dụ: MN ∥ BC, M ∈ AB, N ∈ AC thì AM/MB = AN/NC.\n\n• Định lí Thalès (đảo): Nếu một đường thẳng cắt hai cạnh của một tam giác và định ra trên hai cạnh đó những đoạn thẳng tương ứng tỉ lệ thì đường thẳng đó song song với cạnh còn lại.\n\n• Hệ quả: MN ∥ BC thì AM/AB = AN/AC = MN/BC.",
        "quizzes": [
          {
            "question": "Tam giác ABC có MN ∥ BC (M ∈ AB, N ∈ AC), AM = 2, MB = 3, AN = 4. Khi đó NC bằng:",
            "options": ["6", "5", "8", "2,5"],
            "correctAnswer": 0,
            "explanation": "✅ Theo định lí Thalès: AM/MB = AN/NC ⇒ 2/3 = 4/NC ⇒ NC = 4·3/2 = 6."
          },
          {
            "question": "Định lí Thalès đảo phát biểu: Nếu một đường thẳng cắt hai cạnh của tam giác và định ra những đoạn thẳng tương ứng tỉ lệ thì đường thẳng đó:",
            "options": ["Song song với cạnh còn lại", "Vuông góc với cạnh còn lại", "Bằng nửa cạnh còn lại", "Trùng với cạnh còn lại"],
            "correctAnswer": 0,
            "explanation": "✅ Đó chính là nội dung định lí Thalès đảo."
          },
          {
            "question": "Tam giác ABC có MN ∥ BC, AM = 3, AB = 9, AN = 2. Theo hệ quả Thalès, AC bằng:",
            "options": ["6", "4", "12", "3"],
            "correctAnswer": 0,
            "explanation": "✅ AM/AB = AN/AC ⇒ 3/9 = 2/AC ⇒ AC = 2·9/3 = 6."
          },
          {
            "question": "Tam giác ABC có MN ∥ BC và AM/MB = 2/3. Tỉ số MN/BC bằng:",
            "options": ["2/5", "2/3", "3/5", "1/2"],
            "correctAnswer": 0,
            "explanation": "✅ MN/BC = AM/AB = 2/(2+3) = 2/5."
          }
        ]
      },
      {
        "id": "toan8_t1_bai16",
        "week": 11,
        "title": "Bài 16: Đường trung bình của tam giác",
        "content": "🌅 BÀI HỌC\n\n“ĐƯỜNG TRUNG BÌNH CỦA TAM GIÁC”\n\nĐường trung bình giúp tính nhanh độ dài đoạn thẳng mà không cần đo trực tiếp.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Đường trung bình của tam giác là đoạn thẳng nối trung điểm hai cạnh của tam giác.\n\n• Định lí 1: Đường thẳng đi qua trung điểm một cạnh của tam giác và song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba.\n\n• Định lí 2: Đường trung bình của tam giác thì song song với cạnh thứ ba và bằng nửa cạnh đó.\n\n  Ví dụ: M, N lần lượt là trung điểm AB, AC ⇒ MN = BC/2.",
        "quizzes": [
          {
            "question": "Đường trung bình của tam giác là:",
            "options": ["Đoạn thẳng nối trung điểm hai cạnh của tam giác", "Đoạn thẳng nối một đỉnh với trung điểm cạnh đối diện", "Đoạn thẳng vuông góc từ đỉnh đến cạnh đối diện", "Đoạn thẳng nối hai đỉnh của tam giác"],
            "correctAnswer": 0,
            "explanation": "✅ Đường trung bình nối trung điểm hai cạnh của tam giác."
          },
          {
            "question": "Tam giác ABC có M, N là trung điểm AB, AC; BC = 8 cm. Độ dài MN là:",
            "options": ["4 cm", "8 cm", "16 cm", "2 cm"],
            "correctAnswer": 0,
            "explanation": "✅ MN = BC/2 = 8/2 = 4 cm."
          },
          {
            "question": "Tam giác ABC có MN là đường trung bình và MN = 5 cm. Khi đó BC bằng:",
            "options": ["10 cm", "5 cm", "2,5 cm", "15 cm"],
            "correctAnswer": 0,
            "explanation": "✅ MN = BC/2 ⇒ BC = 2·MN = 10 cm."
          },
          {
            "question": "Trong tam giác ABC, M là trung điểm AB, đường thẳng qua M song song với BC cắt AC tại N. Khi đó:",
            "options": ["N là trung điểm của AC", "MN = BC", "MN = 2BC", "N trùng với C"],
            "correctAnswer": 0,
            "explanation": "✅ Theo định lí 1: đường thẳng qua trung điểm một cạnh, song song với cạnh thứ hai thì đi qua trung điểm cạnh thứ ba."
          }
        ]
      },
      {
        "id": "toan8_t1_bai17",
        "week": 12,
        "title": "Bài 17: Tính chất đường phân giác của tam giác",
        "content": "🌅 BÀI HỌC\n\n“TÍNH CHẤT ĐƯỜNG PHÂN GIÁC CỦA TAM GIÁC”\n\nĐường phân giác chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Định lí: Trong tam giác, đường phân giác của một góc chia cạnh đối diện thành hai đoạn thẳng tỉ lệ với hai cạnh kề hai đoạn ấy.\n\n  Tam giác ABC có AD là phân giác góc A (D ∈ BC) thì BD/DC = AB/AC.\n\n• Ứng dụng: tính độ dài các đoạn thẳng khi biết các cạnh kề.\n\n• Chú ý: tính chất vẫn đúng với đường phân giác của góc ngoài của tam giác.",
        "quizzes": [
          {
            "question": "Tam giác ABC có AD là phân giác góc A (D ∈ BC). Khẳng định đúng là:",
            "options": ["BD/DC = AB/AC", "BD/DC = BC/AC", "BD/DC = AB/BC", "BD = DC"],
            "correctAnswer": 0,
            "explanation": "✅ Đường phân giác chia cạnh đối diện theo tỉ lệ hai cạnh kề: BD/DC = AB/AC."
          },
          {
            "question": "Tam giác ABC có AD là phân giác góc A, AB = 6, AC = 9, BD = 4. Khi đó DC bằng:",
            "options": ["6", "8", "5", "4,5"],
            "correctAnswer": 0,
            "explanation": "✅ BD/DC = AB/AC ⇒ 4/DC = 6/9 ⇒ DC = 4·9/6 = 6."
          },
          {
            "question": "Trong tam giác ABC, đường phân giác của góc A chia cạnh BC thành hai đoạn có độ dài 3 và 5. Nếu AB = 6 thì AC bằng:",
            "options": ["10", "8", "5", "12"],
            "correctAnswer": 0,
            "explanation": "✅ 3/5 = AB/AC ⇒ AC = 5·AB/3 = 5·6/3 = 10."
          },
          {
            "question": "Đường phân giác của một góc trong tam giác:",
            "options": ["Chia cạnh đối diện thành hai đoạn tỉ lệ với hai cạnh kề", "Chia đôi cạnh đối diện", "Vuông góc với cạnh đối diện", "Song song với cạnh đối diện"],
            "correctAnswer": 0,
            "explanation": "✅ Đây chính là nội dung định lí về tính chất đường phân giác của tam giác."
          }
        ]
      },
      {
        "id": "toan8_t1_bai18",
        "week": 13,
        "title": "Bài 18: Thu thập và phân loại dữ liệu",
        "content": "🌅 BÀI HỌC\n\n“THU THẬP VÀ PHÂN LOẠI DỮ LIỆU”\n\nChương thống kê giúp thu thập và xử lí thông tin từ đời sống.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Dữ liệu là những thông tin thu thập được (số liệu, chữ viết, hình ảnh...).\n\n• Dữ liệu định tính là dữ liệu không phải là số (ví dụ: màu sắc, loại quả). Dữ liệu định lượng là dữ liệu số (ví dụ: chiều cao, số học sinh).\n\n• Cách thu thập dữ liệu: quan sát, lập phiếu hỏi, phỏng vấn, khai thác nguồn có sẵn (sách báo, internet).\n\n• Cần kiểm tra tính hợp lí của dữ liệu: ví dụ dữ liệu “ngày 32/2” hoặc “số học sinh là 12,5” là không hợp lí.\n\n→ Dữ liệu chính xác và hợp lí giúp kết luận thống kê đáng tin cậy.",
        "quizzes": [
          {
            "question": "Dữ liệu nào sau đây là dữ liệu định tính?",
            "options": ["Màu sắc yêu thích của học sinh", "Chiều cao của học sinh", "Số học sinh trong lớp", "Điểm kiểm tra môn Toán"],
            "correctAnswer": 0,
            "explanation": "✅ Dữ liệu định tính là dữ liệu không phải là số, như màu sắc, loại quả, ý kiến."
          },
          {
            "question": "Dữ liệu nào sau đây là dữ liệu định lượng?",
            "options": ["Cân nặng của học sinh", "Môn thể thao yêu thích", "Nơi ở của học sinh", "Tên các loài hoa"],
            "correctAnswer": 0,
            "explanation": "✅ Cân nặng là số nên là dữ liệu định lượng."
          },
          {
            "question": "Dữ liệu nào sau đây không hợp lí?",
            "options": ["Số học sinh nam của lớp là 18", "Một ngày sinh là 30/2/2020", "Có 30 học sinh đăng ký câu lạc bộ", "Điểm trung bình là 7,5"],
            "correctAnswer": 1,
            "explanation": "✅ Tháng 2 không có ngày 30, dữ liệu này không hợp lí."
          },
          {
            "question": "Đâu không phải cách thu thập dữ liệu phổ biến?",
            "options": ["Suy luận cá nhân", "Lập phiếu hỏi", "Quan sát", "Khai thác nguồn có sẵn"],
            "correctAnswer": 0,
            "explanation": "✅ Dữ liệu phải thu thập từ thực tế (quan sát, phiếu hỏi, nguồn có sẵn), không phải từ suy luận chủ quan."
          }
        ]
      },
      {
        "id": "toan8_t1_bai19",
        "week": 14,
        "title": "Bài 19: Biểu diễn dữ liệu bằng bảng, biểu đồ",
        "content": "🌅 BÀI HỌC\n\n“BIỂU DIỄN DỮ LIỆU BẰNG BẢNG, BIỂU ĐỒ”\n\nSau khi thu thập, dữ liệu cần được trình bày trực quan qua bảng và biểu đồ.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Bảng dữ liệu: trình bày dữ liệu thành hàng và cột, giúp tra cứu nhanh.\n\n• Biểu đồ cột: so sánh độ lớn giữa các nhóm dữ liệu.\n\n• Biểu đồ đoạn thẳng: thể hiện sự thay đổi của dữ liệu theo thời gian.\n\n• Biểu đồ hình quạt tròn: thể hiện tỉ lệ phần trăm của từng phần so với tổng thể.\n\n• Đọc biểu đồ: xác định trục đứng, trục ngang, giá trị từng cột/điểm/quạt rồi mới rút ra nhận xét.",
        "quizzes": [
          {
            "question": "Để biểu diễn tỉ lệ phần trăm các loại trái cây bán được trong một ngày, nên dùng:",
            "options": ["Biểu đồ hình quạt tròn", "Biểu đồ đoạn thẳng", "Biểu đồ cột kép", "Bảng tần số"],
            "correctAnswer": 0,
            "explanation": "✅ Biểu đồ hình quạt tròn phù hợp để thể hiện tỉ lệ phần trăm so với tổng thể."
          },
          {
            "question": "Để thể hiện sự thay đổi nhiệt độ trong ngày theo giờ, nên dùng:",
            "options": ["Biểu đồ đoạn thẳng", "Biểu đồ hình quạt tròn", "Bảng thống kê", "Biểu đồ tranh"],
            "correctAnswer": 0,
            "explanation": "✅ Biểu đồ đoạn thẳng thể hiện rõ xu hướng thay đổi theo thời gian."
          },
          {
            "question": "Để so sánh số học sinh của các lớp, nên dùng:",
            "options": ["Biểu đồ cột", "Biểu đồ hình quạt tròn", "Biểu đồ đoạn thẳng", "Biểu đồ ven"],
            "correctAnswer": 0,
            "explanation": "✅ Biểu đồ cột so sánh độ lớn giữa các nhóm dữ liệu rất trực quan."
          },
          {
            "question": "Khi đọc biểu đồ, việc đầu tiên cần làm là:",
            "options": ["Xác định trục đứng, trục ngang và đơn vị", "Đọc ngay giá trị các cột", "So sánh ngay các nhóm", "Vẽ lại biểu đồ"],
            "correctAnswer": 0,
            "explanation": "✅ Cần hiểu cách biểu diễn (trục, đơn vị) trước khi đọc giá trị."
          }
        ]
      },
      {
        "id": "toan8_t1_bai20",
        "week": 15,
        "title": "Bài 20: Phân tích số liệu thống kê dựa vào biểu đồ",
        "content": "🌅 BÀI HỌC\n\n“PHÂN TÍCH SỐ LIỆU THỐNG KÊ DỰA VÀO BIỂU ĐỒ”\n\nPhân tích biểu đồ giúp phát hiện xu hướng và đưa ra kết luận có cơ sở.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Nhận xét xu hướng: dữ liệu tăng, giảm hay ổn định theo thời gian.\n\n• So sánh: nhóm nào lớn hơn, chênh lệch bao nhiêu.\n\n• Rút ra kết luận và dự đoán hợp lí từ số liệu.\n\n• Lưu ý khi phân tích:\n  - Chỉ rõ giai đoạn thời gian của dữ liệu.\n  - Cần xét nguồn dữ liệu có đáng tin cậy không.\n  - Tránh kết luận vội vàng khi chỉ nhìn một phần biểu đồ.",
        "quizzes": [
          {
            "question": "Biểu đồ cho thấy doanh số cửa hàng tăng dần qua các tháng. Nhận xét đúng là:",
            "options": ["Doanh số có xu hướng tăng", "Doanh số giảm dần", "Doanh số không đổi", "Không thể kết luận gì"],
            "correctAnswer": 0,
            "explanation": "✅ Xu hướng của dữ liệu là tăng dần theo thời gian."
          },
          {
            "question": "Khi phân tích biểu đồ, việc nào sau đây KHÔNG nên làm?",
            "options": ["Kết luận dựa trên một điểm dữ liệu duy nhất", "Chỉ rõ giai đoạn thời gian", "Xét nguồn dữ liệu", "So sánh giữa các nhóm"],
            "correctAnswer": 0,
            "explanation": "✅ Không nên kết luận vội vàng từ một điểm dữ liệu; cần nhìn tổng thể biểu đồ."
          },
          {
            "question": "Biểu đồ cột cho thấy tháng 1: 100 sản phẩm, tháng 2: 120, tháng 3: 150. Nhận xét đúng là:",
            "options": ["Số sản phẩm tăng đều qua các tháng", "Số sản phẩm giảm dần", "Số sản phẩm không thay đổi", "Tháng 3 bán ít nhất"],
            "correctAnswer": 0,
            "explanation": "✅ 100 < 120 < 150 nên số sản phẩm tăng qua các tháng."
          },
          {
            "question": "Mục đích chính của việc phân tích số liệu thống kê là:",
            "options": ["Rút ra nhận xét, kết luận có cơ sở", "Vẽ biểu đồ đẹp hơn", "Thu thập thêm dữ liệu", "Thay thế bảng dữ liệu"],
            "correctAnswer": 0,
            "explanation": "✅ Phân tích giúp phát hiện xu hướng, so sánh và rút ra kết luận từ dữ liệu."
          }
        ]
      }
    ]
  },
  {
    "id": "toan8_t2",
    "subject": "Toán",
    "grade": 8,
    "volume": "Tập 2 (Chương VI - X)",
    "emoji": "🧮",
    "color": "#6366f1",
    "stars": 10,
    "lessons": [
      {
        "id": "toan8_t2_bai21",
        "week": 19,
        "title": "Bài 21: Phân thức đại số",
        "content": "🌅 BÀI HỌC\n\n“PHÂN THỨC ĐẠI SỐ”\n\nPhân thức đại số giống như phân số nhưng tử và mẫu là các đa thức.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Phân thức đại số là biểu thức có dạng A/B, trong đó A, B là các đa thức và B khác đa thức 0.\n\n• Điều kiện xác định của phân thức là mẫu thức khác 0.\n\n  Ví dụ: 5/(x - 2) xác định khi x - 2 ≠ 0, tức x ≠ 2.\n\n• Hai phân thức A/B và C/D bằng nhau nếu A·D = B·C.\n\n• Giá trị của phân thức tại một giá trị của biến được tính khi phân thức xác định tại giá trị đó.",
        "quizzes": [
          {
            "question": "Phân thức 5/(x - 2) xác định khi:",
            "options": ["x ≠ 2", "x ≠ 0", "x > 2", "x < 2"],
            "correctAnswer": 0,
            "explanation": "✅ Điều kiện xác định là mẫu khác 0: x - 2 ≠ 0 hay x ≠ 2."
          },
          {
            "question": "Phân thức (x + 1)/(x² - 1) xác định khi:",
            "options": ["x ≠ ±1", "x ≠ 0", "x ≠ 1", "x ≠ -1"],
            "correctAnswer": 0,
            "explanation": "✅ x² - 1 ≠ 0 ⇒ (x - 1)(x + 1) ≠ 0 ⇒ x ≠ 1 và x ≠ -1."
          },
          {
            "question": "Hai phân thức A/B và C/D bằng nhau khi:",
            "options": ["A·D = B·C", "A + D = B + C", "A·B = C·D", "A/C = B/D"],
            "correctAnswer": 0,
            "explanation": "✅ Điều kiện bằng nhau của hai phân thức: tích chéo bằng nhau A·D = B·C."
          },
          {
            "question": "Biểu thức nào sau đây là một phân thức đại số?",
            "options": ["x/(x - 1)", "x + 3", "√x", "2x² + 1"],
            "correctAnswer": 0,
            "explanation": "✅ Phân thức đại số có dạng A/B với A, B là đa thức; x/(x - 1) thỏa mãn."
          }
        ]
      },
      {
        "id": "toan8_t2_bai22",
        "week": 19,
        "title": "Bài 22: Tính chất cơ bản của phân thức đại số",
        "content": "🌅 BÀI HỌC\n\n“TÍNH CHẤT CƠ BẢN CỦA PHÂN THỨC ĐẠI SỐ”\n\nTính chất cơ bản cho phép rút gọn và quy đồng phân thức.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Tính chất cơ bản: Nếu nhân (hoặc chia) cả tử và mẫu của một phân thức với cùng một đa thức khác 0 thì được một phân thức bằng phân thức đã cho.\n\n• Rút gọn phân thức: chia cả tử và mẫu cho nhân tử chung (phân tích tử và mẫu thành nhân tử trước).\n\n  Ví dụ: 6x²y/9xy² = 2x/3y; (x² - 1)/(x - 1) = x + 1 (với x ≠ 1).\n\n• Quy đồng mẫu thức: biến đổi các phân thức về cùng mẫu thức chung (MTC), dùng để cộng trừ phân thức ở bài sau.",
        "quizzes": [
          {
            "question": "Rút gọn phân thức 6x²y/9xy² được:",
            "options": ["2x/3y", "3x/2y", "2y/3x", "6x/9y"],
            "correctAnswer": 0,
            "explanation": "✅ Chia tử và mẫu cho 3xy: 6x²y/9xy² = 2x/3y."
          },
          {
            "question": "Rút gọn phân thức (x² - 1)/(x - 1) (với x ≠ 1) được:",
            "options": ["x + 1", "x - 1", "x²", "1"],
            "correctAnswer": 0,
            "explanation": "✅ x² - 1 = (x - 1)(x + 1), chia cả tử và mẫu cho x - 1 được x + 1."
          },
          {
            "question": "Khi nhân cả tử và mẫu của phân thức với cùng một đa thức khác 0, ta được phân thức:",
            "options": ["Bằng phân thức ban đầu", "Lớn hơn phân thức ban đầu", "Nhỏ hơn phân thức ban đầu", "Đối của phân thức ban đầu"],
            "correctAnswer": 0,
            "explanation": "✅ Tính chất cơ bản: phân thức mới bằng phân thức đã cho."
          },
          {
            "question": "Rút gọn phân thức 4ab²/2a²b (a, b ≠ 0) được:",
            "options": ["2b/a", "2a/b", "4b/a", "b/2a"],
            "correctAnswer": 0,
            "explanation": "✅ Chia tử và mẫu cho 2ab: 4ab²/2a²b = 2b/a."
          }
        ]
      },
      {
        "id": "toan8_t2_bai23",
        "week": 20,
        "title": "Bài 23: Phép cộng và phép trừ phân thức đại số",
        "content": "🌅 BÀI HỌC\n\n“PHÉP CỘNG VÀ PHÉP TRỪ PHÂN THỨC ĐẠI SỐ”\n\nCộng trừ phân thức tương tự cộng trừ phân số, chỉ thêm bước quy đồng mẫu thức.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Cộng (trừ) hai phân thức cùng mẫu: cộng (trừ) tử với tử, giữ nguyên mẫu.\n\n  Ví dụ: 1/x + 2/x = 3/x.\n\n• Cộng (trừ) hai phân thức khác mẫu: quy đồng mẫu thức chung rồi cộng (trừ) các tử.\n\n  Ví dụ: x/2 + x/3 = 3x/6 + 2x/6 = 5x/6.\n\n• Khi trừ, nhớ đổi dấu toàn bộ tử của phân thức bị trừ.\n\n• Sau khi tính, nếu có thể thì rút gọn kết quả.",
        "quizzes": [
          {
            "question": "Kết quả của 1/x + 2/x (x ≠ 0) là:",
            "options": ["3/x", "3/2x", "2/x²", "2x"],
            "correctAnswer": 0,
            "explanation": "✅ Cùng mẫu, cộng tử: (1 + 2)/x = 3/x."
          },
          {
            "question": "Kết quả của x/2 + x/3 là:",
            "options": ["5x/6", "2x/5", "x/6", "5/6x"],
            "correctAnswer": 0,
            "explanation": "✅ Quy đồng mẫu chung 6: 3x/6 + 2x/6 = 5x/6."
          },
          {
            "question": "Kết quả của 2/(x - 1) - 1/(x - 1) (x ≠ 1) là:",
            "options": ["1/(x - 1)", "1", "3/(x - 1)", "1/(x² - 1)"],
            "correctAnswer": 0,
            "explanation": "✅ Cùng mẫu, trừ tử: (2 - 1)/(x - 1) = 1/(x - 1)."
          },
          {
            "question": "Kết quả của 1/(x + 1) + 2/(x + 1) (x ≠ -1) là:",
            "options": ["3/(x + 1)", "2/(x + 1)", "3/(2x + 2)", "3"],
            "correctAnswer": 0,
            "explanation": "✅ (1 + 2)/(x + 1) = 3/(x + 1)."
          }
        ]
      },
      {
        "id": "toan8_t2_bai24",
        "week": 20,
        "title": "Bài 24: Phép nhân và phép chia phân thức đại số",
        "content": "🌅 BÀI HỌC\n\n“PHÉP NHÂN VÀ PHÉP CHIA PHÂN THỨC ĐẠI SỐ”\n\nNhân, chia phân thức đại số theo đúng quy tắc của phân số.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Nhân hai phân thức: nhân tử với tử, mẫu với mẫu. (A/B)·(C/D) = (A·C)/(B·D).\n\n  Ví dụ: (x/y)·(y²/x²) = y/x.\n\n• Chia hai phân thức: nhân với phân thức nghịch đảo. (A/B) : (C/D) = (A/B)·(D/C).\n\n• Nhân tử chung: rút gọn trước khi nhân giúp tính nhanh và gọn.\n\n• Sau khi nhân, chia nên rút gọn kết quả.",
        "quizzes": [
          {
            "question": "Kết quả của (x/y) · (y²/x²) (x, y ≠ 0) là:",
            "options": ["y/x", "x/y", "1", "xy"],
            "correctAnswer": 0,
            "explanation": "✅ (x·y²)/(y·x²) = y/x sau khi rút gọn x và y."
          },
          {
            "question": "Kết quả của (x/2) · (4/x) (x ≠ 0) là:",
            "options": ["2", "4", "x/2", "8/x"],
            "correctAnswer": 0,
            "explanation": "✅ (x·4)/(2·x) = 4/2 = 2."
          },
          {
            "question": "Kết quả của (a/b) : (c/d) (b, c, d ≠ 0) là:",
            "options": ["ad/bc", "ac/bd", "ab/cd", "d/bc"],
            "correctAnswer": 0,
            "explanation": "✅ Chia là nhân với nghịch đảo: (a/b)·(d/c) = ad/bc."
          },
          {
            "question": "Kết quả của (2/x) : (4/x²) (x ≠ 0) là:",
            "options": ["x/2", "2/x", "8/x³", "2x"],
            "correctAnswer": 0,
            "explanation": "✅ (2/x)·(x²/4) = 2x²/4x = x/2."
          }
        ]
      },
      {
        "id": "toan8_t2_bai25",
        "week": 21,
        "title": "Bài 25: Phương trình bậc nhất một ẩn",
        "content": "🌅 BÀI HỌC\n\n“PHƯƠNG TRÌNH BẬC NHẤT MỘT ẨN”\n\nPhương trình bậc nhất một ẩn là công cụ giải quyết hàng loạt bài toán thực tế.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Phương trình bậc nhất một ẩn có dạng ax + b = 0 với a ≠ 0. Nghiệm là x = -b/a.\n\n• Giải phương trình là tìm giá trị của ẩn làm cho hai vế bằng nhau.\n\n• Quy tắc chuyển vế: chuyển hạng tử từ vế này sang vế kia thì đổi dấu.\n\n• Quy tắc nhân: nhân (chia) cả hai vế với cùng một số khác 0.\n\n  Ví dụ: 2x + 3 = 7 ⇒ 2x = 4 ⇒ x = 2.",
        "quizzes": [
          {
            "question": "Nghiệm của phương trình 2x + 3 = 7 là:",
            "options": ["x = 2", "x = 5", "x = 4", "x = 10"],
            "correctAnswer": 0,
            "explanation": "✅ 2x = 7 - 3 = 4 ⇒ x = 2."
          },
          {
            "question": "Phương trình nào sau đây là phương trình bậc nhất một ẩn?",
            "options": ["2x + 1 = 0", "x² = 4", "x + y = 1", "2x = 3y"],
            "correctAnswer": 0,
            "explanation": "✅ Phương trình bậc nhất một ẩn có dạng ax + b = 0 (a ≠ 0)."
          },
          {
            "question": "Nghiệm của phương trình 3(x - 1) = 12 là:",
            "options": ["x = 5", "x = 3", "x = 13", "x = 15"],
            "correctAnswer": 0,
            "explanation": "✅ 3(x - 1) = 12 ⇒ x - 1 = 4 ⇒ x = 5."
          },
          {
            "question": "Nghiệm của phương trình 5x - 2 = 3x + 6 là:",
            "options": ["x = 4", "x = 2", "x = 8", "x = 1"],
            "correctAnswer": 0,
            "explanation": "✅ 5x - 3x = 6 + 2 ⇒ 2x = 8 ⇒ x = 4."
          }
        ]
      },
      {
        "id": "toan8_t2_bai26",
        "week": 22,
        "title": "Bài 26: Giải bài toán bằng cách lập phương trình",
        "content": "🌅 BÀI HỌC\n\n“GIẢI BÀI TOÁN BẰNG CÁCH LẬP PHƯƠNG TRÌNH”\n\nChuyển bài toán thực tế thành phương trình để giải một cách có hệ thống.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Các bước giải:\n  1) Chọn ẩn và đặt điều kiện thích hợp cho ẩn.\n  2) Biểu diễn các đại lượng chưa biết theo ẩn.\n  3) Lập phương trình biểu thị mối quan hệ giữa các đại lượng.\n  4) Giải phương trình.\n  5) Đối chiếu điều kiện rồi trả lời.\n\n• Ví dụ: Tổng hai số là 20, hiệu là 4. Gọi số lớn là x, số nhỏ là 20 - x; ta có x - (20 - x) = 4 ⇒ x = 12. Hai số là 12 và 8.",
        "quizzes": [
          {
            "question": "Tổng hai số là 20, số lớn hơn số bé 4 đơn vị. Số lớn là:",
            "options": ["12", "8", "10", "16"],
            "correctAnswer": 0,
            "explanation": "✅ Gọi số lớn là x: x - (20 - x) = 4 ⇒ 2x = 24 ⇒ x = 12."
          },
          {
            "question": "Tuổi bố gấp 3 lần tuổi con, tổng số tuổi là 40. Tuổi con là:",
            "options": ["10", "30", "13", "20"],
            "correctAnswer": 0,
            "explanation": "✅ Gọi tuổi con là x: x + 3x = 40 ⇒ 4x = 40 ⇒ x = 10."
          },
          {
            "question": "Một xe chạy với vận tốc 60 km/h trong t giờ đi được quãng đường:",
            "options": ["60t km", "t/60 km", "60/t km", "60 + t km"],
            "correctAnswer": 0,
            "explanation": "✅ Quãng đường = vận tốc × thời gian = 60t km."
          },
          {
            "question": "Bước đầu tiên khi giải bài toán bằng cách lập phương trình là:",
            "options": ["Chọn ẩn và đặt điều kiện", "Giải phương trình", "Lập phương trình", "Đối chiếu điều kiện"],
            "correctAnswer": 0,
            "explanation": "✅ Chọn ẩn và đặt điều kiện cho ẩn là bước đầu tiên."
          }
        ]
      },
      {
        "id": "toan8_t2_bai27",
        "week": 23,
        "title": "Bài 27: Khái niệm hàm số và đồ thị của hàm số",
        "content": "🌅 BÀI HỌC\n\n“KHÁI NIỆM HÀM SỐ VÀ ĐỒ THỊ CỦA HÀM SỐ”\n\nHàm số mô tả mối quan hệ giữa các đại lượng trong đời sống.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hàm số: nếu đại lượng y phụ thuộc vào đại lượng thay đổi x sao cho mỗi giá trị của x ta luôn xác định được đúng một giá trị tương ứng của y, thì y được gọi là hàm số của x; x gọi là biến số.\n\n• Kí hiệu: y = f(x). Giá trị của y tại x = a kí hiệu f(a).\n\n  Ví dụ: y = 2x là hàm số; tại x = 3 thì y = 6.\n\n• Đồ thị của hàm số là tập hợp tất cả các điểm biểu diễn các cặp giá trị tương ứng (x; f(x)) trên mặt phẳng tọa độ.",
        "quizzes": [
          {
            "question": "Cho hàm số y = 2x. Giá trị của y khi x = 3 là:",
            "options": ["6", "5", "9", "1,5"],
            "correctAnswer": 0,
            "explanation": "✅ y = 2·3 = 6."
          },
          {
            "question": "Cho hàm số y = f(x) = x + 1. Giá trị f(2) là:",
            "options": ["3", "2", "4", "1"],
            "correctAnswer": 0,
            "explanation": "✅ f(2) = 2 + 1 = 3."
          },
          {
            "question": "Đồ thị của hàm số là:",
            "options": ["Tập hợp các điểm biểu diễn các cặp giá trị (x; f(x))", "Một điểm duy nhất", "Chỉ các điểm trên trục hoành", "Một bảng số liệu"],
            "correctAnswer": 0,
            "explanation": "✅ Đồ thị hàm số là tập hợp các điểm (x; f(x)) trên mặt phẳng tọa độ."
          },
          {
            "question": "Khẳng định nào sau đây đúng về hàm số y = x² tại x = 3?",
            "options": ["y = 9", "y = 6", "y = 3", "y = 12"],
            "correctAnswer": 0,
            "explanation": "✅ y = 3² = 9."
          }
        ]
      },
      {
        "id": "toan8_t2_bai28",
        "week": 24,
        "title": "Bài 28: Hàm số bậc nhất và đồ thị của hàm số bậc nhất",
        "content": "🌅 BÀI HỌC\n\n“HÀM SỐ BẬC NHẤT VÀ ĐỒ THỊ”\n\nHàm số bậc nhất mô tả những mối quan hệ tuyến tính phổ biến nhất.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hàm số bậc nhất có dạng y = ax + b với a ≠ 0.\n\n• Đồ thị của hàm số bậc nhất là một đường thẳng, cắt trục tung tại điểm (0; b).\n\n• Nếu a > 0, đồ thị đi lên từ trái sang phải; nếu a < 0, đồ thị đi xuống.\n\n• Để vẽ đồ thị, xác định hai điểm của đường thẳng (thường là giao với hai trục) rồi nối lại.\n\n• Giao điểm với trục hoành: cho y = 0 giải phương trình ax + b = 0.",
        "quizzes": [
          {
            "question": "Đồ thị của hàm số y = 3x - 1 cắt trục tung tại điểm:",
            "options": ["(0; -1)", "(0; 3)", "(-1; 0)", "(1; 0)"],
            "correctAnswer": 0,
            "explanation": "✅ Đồ thị y = ax + b cắt trục tung tại (0; b) = (0; -1)."
          },
          {
            "question": "Đồ thị của hàm số y = 2x - 4 cắt trục hoành tại điểm:",
            "options": ["(2; 0)", "(0; 2)", "(-4; 0)", "(4; 0)"],
            "correctAnswer": 0,
            "explanation": "✅ Cho y = 0: 2x - 4 = 0 ⇒ x = 2. Điểm (2; 0)."
          },
          {
            "question": "Hàm số bậc nhất có dạng:",
            "options": ["y = ax + b với a ≠ 0", "y = ax² + b", "y = a/x", "y = √x"],
            "correctAnswer": 0,
            "explanation": "✅ Hàm số bậc nhất có dạng y = ax + b với a ≠ 0."
          },
          {
            "question": "Hàm số y = -2x + 1 có đồ thị:",
            "options": ["Đi xuống từ trái sang phải", "Đi lên từ trái sang phải", "Là đường cong", "Là đường tròn"],
            "correctAnswer": 0,
            "explanation": "✅ Vì hệ số a = -2 < 0 nên đồ thị đi xuống."
          }
        ]
      },
      {
        "id": "toan8_t2_bai29",
        "week": 25,
        "title": "Bài 29: Hệ số góc của đường thẳng",
        "content": "🌅 BÀI HỌC\n\n“HỆ SỐ GÓC CỦA ĐƯỜNG THẲNG”\n\nHệ số góc cho biết độ dốc và quan hệ song song, vuông góc giữa các đường thẳng.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hệ số góc của đường thẳng y = ax + b là a. Nó cho biết độ dốc: a càng lớn, đường thẳng càng dốc.\n\n• Hai đường thẳng y = ax + b và y = a'x + b' song song khi a = a' và b ≠ b'.\n\n• Hai đường thẳng vuông góc khi tích các hệ số góc bằng -1: a·a' = -1.\n\n• Ví dụ: y = 2x + 3 và y = 2x - 1 song song với nhau (cùng hệ số góc 2).",
        "quizzes": [
          {
            "question": "Hệ số góc của đường thẳng y = 3x + 2 là:",
            "options": ["3", "2", "1", "-3"],
            "correctAnswer": 0,
            "explanation": "✅ Hệ số góc là hệ số của x: a = 3."
          },
          {
            "question": "Hai đường thẳng nào sau đây song song với nhau?",
            "options": ["y = 2x + 3 và y = 2x - 1", "y = 2x + 3 và y = 3x + 3", "y = 2x + 3 và y = -2x + 3", "y = 2x + 3 và y = x + 2"],
            "correctAnswer": 0,
            "explanation": "✅ Hai đường thẳng song song khi cùng hệ số góc (a = 2) và khác tung độ gốc."
          },
          {
            "question": "Hệ số góc càng lớn thì đường thẳng:",
            "options": ["Càng dốc", "Càng thoải", "Càng song song với trục tung", "Không đổi độ dốc"],
            "correctAnswer": 0,
            "explanation": "✅ Hệ số góc a càng lớn, đường thẳng càng dốc (độ nghiêng càng tăng)."
          },
          {
            "question": "Đường thẳng vuông góc với đường thẳng y = 2x + 1 có hệ số góc là:",
            "options": ["-1/2", "1/2", "2", "-2"],
            "correctAnswer": 0,
            "explanation": "✅ Tích hệ số góc của hai đường vuông góc bằng -1: 2·a = -1 ⇒ a = -1/2."
          }
        ]
      },
      {
        "id": "toan8_t2_bai30",
        "week": 26,
        "title": "Bài 30: Kết quả có thể và kết quả thuận lợi",
        "content": "🌅 BÀI HỌC\n\n“KẾT QUẢ CÓ THỂ VÀ KẾT QUẢ THUẬN LỢI”\n\nMở đầu về xác suất: mô tả các khả năng xảy ra của biến cố.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hành động, thực nghiệm có một số kết quả có thể xảy ra; mỗi kết quả gọi là một kết quả có thể.\n\n  Ví dụ: gieo một con xúc xắc có 6 kết quả có thể: 1, 2, 3, 4, 5, 6.\n\n• Biến cố là một sự kiện liên quan đến hành động, thực nghiệm; biến cố xảy ra hay không phụ thuộc vào kết quả.\n\n• Kết quả thuận lợi cho một biến cố là kết quả làm cho biến cố đó xảy ra.\n\n  Ví dụ: biến cố “gieo được mặt chẵn” có các kết quả thuận lợi là 2, 4, 6.",
        "quizzes": [
          {
            "question": "Gieo một con xúc xắc có bao nhiêu kết quả có thể?",
            "options": ["6", "3", "12", "1"],
            "correctAnswer": 0,
            "explanation": "✅ Xúc xắc có 6 mặt nên có 6 kết quả có thể: 1, 2, 3, 4, 5, 6."
          },
          {
            "question": "Biến cố “gieo được mặt chẵn” khi gieo xúc xắc có số kết quả thuận lợi là:",
            "options": ["3", "2", "6", "4"],
            "correctAnswer": 0,
            "explanation": "✅ Các mặt chẵn: 2, 4, 6 — có 3 kết quả thuận lợi."
          },
          {
            "question": "Rút ngẫu nhiên một quả bóng từ túi có 3 quả đỏ và 2 quả xanh. Số kết quả có thể là:",
            "options": ["5", "3", "2", "6"],
            "correctAnswer": 0,
            "explanation": "✅ Túi có 3 + 2 = 5 quả bóng nên có 5 kết quả có thể."
          },
          {
            "question": "Kết quả thuận lợi cho một biến cố là:",
            "options": ["Kết quả làm cho biến cố đó xảy ra", "Kết quả không thể xảy ra", "Kết quả chắc chắn xảy ra", "Mọi kết quả có thể"],
            "correctAnswer": 0,
            "explanation": "✅ Kết quả thuận lợi là kết quả làm cho biến cố xảy ra."
          }
        ]
      },
      {
        "id": "toan8_t2_bai31",
        "week": 27,
        "title": "Bài 31: Cách tính xác suất của biến cố bằng tỉ số",
        "content": "🌅 BÀI HỌC\n\n“CÁCH TÍNH XÁC SUẤT CỦA BIẾN CỐ BẰNG TỈ SỐ”\n\nXác suất đo lường khả năng xảy ra của biến cố bằng một con số từ 0 đến 1.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Khi các kết quả của hành động, thực nghiệm là đồng khả năng, xác suất của biến cố A được tính:\n\n  P(A) = (Số kết quả thuận lợi cho A) / (Tổng số kết quả có thể)\n\n• Xác suất luôn nằm trong khoảng từ 0 đến 1.\n\n  Ví dụ: gieo xúc xắc, xác suất gieo được mặt 3 là 1/6; xác suất gieo được mặt chẵn là 3/6 = 1/2.",
        "quizzes": [
          {
            "question": "Gieo một con xúc xắc, xác suất gieo được mặt 3 là:",
            "options": ["1/6", "1/3", "1/2", "3/6"],
            "correctAnswer": 0,
            "explanation": "✅ P = 1 kết quả thuận lợi / 6 kết quả có thể = 1/6."
          },
          {
            "question": "Gieo một con xúc xắc, xác suất gieo được mặt chẵn là:",
            "options": ["1/2", "1/6", "1/3", "2/3"],
            "correctAnswer": 0,
            "explanation": "✅ Có 3 mặt chẵn trong 6 mặt: P = 3/6 = 1/2."
          },
          {
            "question": "Túi có 3 quả đỏ, 2 quả xanh. Bốc ngẫu nhiên một quả, xác suất bốc được quả đỏ là:",
            "options": ["3/5", "2/5", "1/3", "3/2"],
            "correctAnswer": 0,
            "explanation": "✅ P = 3 quả đỏ / 5 quả tất cả = 3/5."
          },
          {
            "question": "Xác suất của một biến cố luôn:",
            "options": ["Nằm trong khoảng từ 0 đến 1", "Lớn hơn 1", "Nhỏ hơn 0", "Bằng 1 luôn"],
            "correctAnswer": 0,
            "explanation": "✅ Xác suất của biến cố luôn nằm trong khoảng từ 0 đến 1."
          }
        ]
      },
      {
        "id": "toan8_t2_bai32",
        "week": 28,
        "title": "Bài 32: Mối liên hệ giữa xác suất thực nghiệm với xác suất và ứng dụng",
        "content": "🌅 BÀI HỌC\n\n“XÁC SUẤT THỰC NGHIỆM VÀ ỨNG DỤNG”\n\nKhi không thể tính xác suất lí thuyết, ta ước lượng bằng xác suất thực nghiệm.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Xác suất thực nghiệm của biến cố A sau nhiều lần thực hiện:\n\n  P(A) = (Số lần biến cố A xảy ra) / (Tổng số lần thực hiện)\n\n• Khi số lần thực hiện càng lớn, xác suất thực nghiệm càng gần với xác suất lí thuyết.\n\n• Ứng dụng: ước lượng tỉ lệ sản phẩm lỗi, khảo sát ý kiến, dự báo thời tiết...\n\n  Ví dụ: gieo đồng xu 50 lần được 28 lần mặt sấp ⇒ xác suất thực nghiệm của mặt sấp là 28/50 = 14/25.",
        "quizzes": [
          {
            "question": "Gieo đồng xu 50 lần được 28 lần mặt sấp. Xác suất thực nghiệm của biến cố “mặt sấp” là:",
            "options": ["28/50", "22/50", "28/28", "50/28"],
            "correctAnswer": 0,
            "explanation": "✅ P = 28 lần xảy ra / 50 lần thực hiện = 28/50."
          },
          {
            "question": "Bắn cung 100 lần trúng 85 lần. Xác suất thực nghiệm trúng đích là:",
            "options": ["0,85", "0,15", "85", "0,5"],
            "correctAnswer": 0,
            "explanation": "✅ P = 85/100 = 0,85 (tức 85%)."
          },
          {
            "question": "Khi số lần thực hiện thực nghiệm càng lớn, xác suất thực nghiệm:",
            "options": ["Càng gần với xác suất lí thuyết", "Càng khác xa xác suất lí thuyết", "Luôn bằng 1", "Luôn bằng 0"],
            "correctAnswer": 0,
            "explanation": "✅ Luật số lớn: thực hiện càng nhiều lần, xác suất thực nghiệm càng ổn định và gần xác suất lí thuyết."
          },
          {
            "question": "Xác suất thực nghiệm được dùng khi:",
            "options": ["Không thể tính xác suất lí thuyết", "Biết chính xác mọi kết quả", "Muốn có kết quả chắc chắn 100%", "Số lần thực hiện nhỏ hơn 3"],
            "correctAnswer": 0,
            "explanation": "✅ Khi không xác định được xác suất lí thuyết, ta ước lượng bằng xác suất thực nghiệm."
          }
        ]
      },
      {
        "id": "toan8_t2_bai33",
        "week": 29,
        "title": "Bài 33: Hai tam giác đồng dạng",
        "content": "🌅 BÀI HỌC\n\n“HAI TAM GIÁC ĐỒNG DẠNG”\n\nTam giác đồng dạng giúp đo đạc gián tiếp những vật thể lớn trong thực tế.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hai tam giác đồng dạng là hai tam giác có các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ.\n\n• Kí hiệu: tam giác ABC đồng dạng với tam giác A'B'C' (viết ΔABC ∽ ΔA'B'C').\n\n• Tỉ số đồng dạng là tỉ số giữa các cạnh tương ứng. Nếu ΔABC ∽ ΔA'B'C' theo tỉ số k thì AB/A'B' = k.\n\n• Hai tam giác bằng nhau là trường hợp đặc biệt của đồng dạng với tỉ số k = 1.\n\n• Hai tam giác đều luôn đồng dạng với nhau.",
        "quizzes": [
          {
            "question": "Hai tam giác đồng dạng khi:",
            "options": ["Các góc tương ứng bằng nhau và các cạnh tương ứng tỉ lệ", "Chỉ có các cạnh bằng nhau", "Chỉ có các góc bằng nhau", "Có cùng diện tích"],
            "correctAnswer": 0,
            "explanation": "✅ Điều kiện đồng dạng: góc tương ứng bằng nhau và cạnh tương ứng tỉ lệ."
          },
          {
            "question": "ΔABC ∽ ΔDEF có AB = 6, DE = 3. Tỉ số đồng dạng k là:",
            "options": ["2", "1/2", "3", "18"],
            "correctAnswer": 0,
            "explanation": "✅ k = AB/DE = 6/3 = 2."
          },
          {
            "question": "Hai tam giác bằng nhau có tỉ số đồng dạng là:",
            "options": ["1", "0", "2", "Không xác định"],
            "correctAnswer": 0,
            "explanation": "✅ Hai tam giác bằng nhau đồng dạng với tỉ số k = 1."
          },
          {
            "question": "Hai tam giác đều bất kì luôn:",
            "options": ["Đồng dạng với nhau", "Bằng nhau", "Không đồng dạng", "Có chu vi bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Mọi tam giác đều có ba góc 60° nên luôn đồng dạng với nhau."
          }
        ]
      },
      {
        "id": "toan8_t2_bai34",
        "week": 30,
        "title": "Bài 34: Ba trường hợp đồng dạng của hai tam giác",
        "content": "🌅 BÀI HỌC\n\n“BA TRƯỜNG HỢP ĐỒNG DẠNG CỦA HAI TAM GIÁC”\n\nBa điều kiện ngắn gọn giúp nhận biết hai tam giác đồng dạng.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Trường hợp 1 (c.c.c): ba cạnh của tam giác này tỉ lệ với ba cạnh của tam giác kia.\n\n• Trường hợp 2 (c.g.c): hai cạnh của tam giác này tỉ lệ với hai cạnh của tam giác kia và hai góc xen giữa các cặp cạnh ấy bằng nhau.\n\n• Trường hợp 3 (g.g): hai góc của tam giác này lần lượt bằng hai góc của tam giác kia.\n\n  Ví dụ: tam giác có ba cạnh 3, 4, 5 và tam giác có ba cạnh 6, 8, 10 đồng dạng theo trường hợp c.c.c (tỉ lệ 1:2).",
        "quizzes": [
          {
            "question": "Hai tam giác có ba cạnh 3, 4, 5 và 6, 8, 10 đồng dạng theo trường hợp nào?",
            "options": ["c.c.c", "c.g.c", "g.g", "Không đồng dạng"],
            "correctAnswer": 0,
            "explanation": "✅ 6/3 = 8/4 = 10/5 = 2 nên ba cạnh tỉ lệ — đồng dạng theo c.c.c."
          },
          {
            "question": "Trường hợp c.g.c yêu cầu:",
            "options": ["Hai cạnh tỉ lệ và góc xen giữa bằng nhau", "Ba cạnh tỉ lệ", "Hai góc bằng nhau", "Một cạnh bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Trường hợp c.g.c: hai cạnh tỉ lệ và góc xen giữa tương ứng bằng nhau."
          },
          {
            "question": "Hai tam giác có hai góc lần lượt bằng nhau là hai tam giác:",
            "options": ["Đồng dạng theo trường hợp g.g", "Bằng nhau", "Đồng dạng theo c.c.c", "Không đồng dạng"],
            "correctAnswer": 0,
            "explanation": "✅ Hai góc bằng nhau đủ để kết luận đồng dạng (góc còn lại tự động bằng nhau)."
          },
          {
            "question": "Hai tam giác vuông cân bất kì có mối quan hệ:",
            "options": ["Luôn đồng dạng", "Luôn bằng nhau", "Không bao giờ đồng dạng", "Chỉ đồng dạng khi cạnh bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Tam giác vuông cân có hai góc 45° bằng nhau nên luôn đồng dạng (g.g)."
          }
        ]
      },
      {
        "id": "toan8_t2_bai35",
        "week": 31,
        "title": "Bài 35: Định lí Pythagore và ứng dụng",
        "content": "🌅 BÀI HỌC\n\n“ĐỊNH LÍ PYTHAGORE VÀ ỨNG DỤNG”\n\nĐịnh lí Pythagore là một trong những định lí quan trọng nhất của hình học.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Định lí Pythagore: Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông:\n\n  a² = b² + c²\n\n• Định lí Pythagore đảo: Nếu tam giác có bình phương một cạnh bằng tổng bình phương hai cạnh còn lại thì tam giác đó là tam giác vuông.\n\n• Ứng dụng: tính chiều dài đường chéo, đo khoảng cách gián tiếp, kiểm tra tam giác vuông.\n\n  Ví dụ: tam giác vuông có hai cạnh góc vuông 3 và 4 thì cạnh huyền là 5.",
        "quizzes": [
          {
            "question": "Tam giác vuông có hai cạnh góc vuông là 3 và 4. Cạnh huyền bằng:",
            "options": ["5", "7", "12", "√7"],
            "correctAnswer": 0,
            "explanation": "✅ a² = 3² + 4² = 9 + 16 = 25 ⇒ a = 5."
          },
          {
            "question": "Tam giác vuông có cạnh huyền 13 và một cạnh góc vuông 5. Cạnh góc vuông còn lại là:",
            "options": ["12", "8", "18", "√194"],
            "correctAnswer": 0,
            "explanation": "✅ b² = 13² - 5² = 169 - 25 = 144 ⇒ b = 12."
          },
          {
            "question": "Bộ ba số nào sau đây là độ dài ba cạnh của một tam giác vuông?",
            "options": ["6, 8, 10", "3, 4, 6", "5, 6, 7", "2, 3, 4"],
            "correctAnswer": 0,
            "explanation": "✅ 6² + 8² = 36 + 64 = 100 = 10² nên thỏa mãn định lí Pythagore đảo."
          },
          {
            "question": "Một hình chữ nhật có chiều dài 8 m, chiều rộng 6 m. Đường chéo dài:",
            "options": ["10 m", "14 m", "48 m", "2 m"],
            "correctAnswer": 0,
            "explanation": "✅ Đường chéo = √(8² + 6²) = √100 = 10 m."
          }
        ]
      },
      {
        "id": "toan8_t2_bai36",
        "week": 32,
        "title": "Bài 36: Các trường hợp đồng dạng của hai tam giác vuông",
        "content": "🌅 BÀI HỌC\n\n“CÁC TRƯỜNG HỢP ĐỒNG DẠNG CỦA HAI TAM GIÁC VUÔNG”\n\nTam giác vuông có những điều kiện đồng dạng riêng, gọn hơn tam giác thường.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hai tam giác vuông đồng dạng khi:\n  - Một góc nhọn của chúng bằng nhau (trường hợp g.g);\n  - Hai cạnh góc vuông tương ứng tỉ lệ (trường hợp c.g.c);\n  - Cạnh huyền và một cạnh góc vuông tương ứng tỉ lệ (trường hợp cạnh huyền - cạnh góc vuông).\n\n• Ví dụ: tam giác vuông 3-4-5 và 6-8-10 đồng dạng vì hai cạnh góc vuông tỉ lệ 1:2.\n\n• Ứng dụng: đo chiều cao vật thể bằng bóng của chúng — dựa vào hai tam giác vuông đồng dạng tạo bởi tia nắng mặt trời.",
        "quizzes": [
          {
            "question": "Hai tam giác vuông đồng dạng khi:",
            "options": ["Một góc nhọn của chúng bằng nhau", "Chúng có cùng diện tích", "Chúng có cùng chu vi", "Một cạnh bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Một góc nhọn bằng nhau là điều kiện đơn giản nhất để hai tam giác vuông đồng dạng."
          },
          {
            "question": "Cột cờ cao 9 m có bóng dài 3 m, cùng lúc cây gậy cao 1,5 m có bóng dài:",
            "options": ["0,5 m", "1 m", "2 m", "4,5 m"],
            "correctAnswer": 0,
            "explanation": "✅ Hai tam giác vuông đồng dạng: 9/1,5 = 3/x ⇒ x = 3·1,5/9 = 0,5 m."
          },
          {
            "question": "Hai tam giác vuông có cạnh huyền và một cạnh góc vuông tương ứng tỉ lệ thì:",
            "options": ["Đồng dạng", "Bằng nhau", "Không đồng dạng", "Có chu vi bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Trường hợp cạnh huyền - cạnh góc vuông: hai tam giác vuông đồng dạng."
          },
          {
            "question": "Tam giác vuông 3-4-5 và tam giác vuông 6-8-10 có quan hệ:",
            "options": ["Đồng dạng", "Bằng nhau", "Không liên quan", "Chỉ chung góc vuông"],
            "correctAnswer": 0,
            "explanation": "✅ Hai cạnh góc vuông tỉ lệ 1:2 nên đồng dạng theo c.g.c."
          }
        ]
      },
      {
        "id": "toan8_t2_bai37",
        "week": 33,
        "title": "Bài 37: Hình đồng dạng",
        "content": "🌅 BÀI HỌC\n\n“HÌNH ĐỒNG DẠNG”\n\nKhái niệm đồng dạng được mở rộng từ tam giác lên các hình bất kì.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hai hình đồng dạng phối cảnh (hay hình vị tự): các đoạn thẳng tương ứng song song và các cặp điểm tương ứng được nối bởi các đường thẳng cùng đi qua một điểm (tâm phối cảnh).\n\n• Hình H' được gọi là hình đồng dạng phối cảnh của H nếu phóng to hoặc thu nhỏ H theo tỉ số k (k > 0) sẽ được H'.\n\n• Hai hình đồng dạng là hai hình có hình đồng dạng phối cảnh với nhau, như ảnh phóng to, thu nhỏ của cùng một bức ảnh.\n\n• Ứng dụng: bản đồ, ảnh phóng to, thu nhỏ trong công nghệ và đời sống.",
        "quizzes": [
          {
            "question": "Hai hình đồng dạng phối cảnh có:",
            "options": ["Các đoạn thẳng tương ứng song song và các đường nối điểm tương ứng cùng đi qua một điểm", "Các cạnh bằng nhau", "Các góc khác nhau", "Diện tích bằng nhau"],
            "correctAnswer": 0,
            "explanation": "✅ Đó là đặc điểm của hai hình đồng dạng phối cảnh (hình vị tự)."
          },
          {
            "question": "Ảnh phóng to 2 lần của một bức ảnh với tâm phối cảnh là tâm ảnh cho ta:",
            "options": ["Hình đồng dạng phối cảnh với ảnh gốc", "Một ảnh khác hẳn", "Ảnh bị méo", "Hình tròn"],
            "correctAnswer": 0,
            "explanation": "✅ Phóng to thu nhỏ theo tỉ số k tạo hình đồng dạng phối cảnh."
          },
          {
            "question": "Trong thực tế, hình ảnh đồng dạng xuất hiện ở:",
            "options": ["Bản đồ, ảnh phóng to thu nhỏ", "Chỉ trong sách giáo khoa", "Chỉ với hình tam giác", "Không xuất hiện"],
            "correctAnswer": 0,
            "explanation": "✅ Bản đồ và ảnh phóng to, thu nhỏ là ứng dụng phổ biến của hình đồng dạng."
          },
          {
            "question": "Hình H' là ảnh phóng to của H với tỉ số k = 3. So với H, hình H':",
            "options": ["Lớn hơn gấp 3 về mọi kích thước", "Bé hơn 3 lần", "Bằng với H", "Lớn hơn 3 lần về diện tích"],
            "correctAnswer": 0,
            "explanation": "✅ Tỉ số k > 1 là phóng to: mọi kích thước của H' gấp 3 lần H."
          }
        ]
      },
      {
        "id": "toan8_t2_bai38",
        "week": 34,
        "title": "Bài 38: Hình chóp tam giác đều",
        "content": "🌅 BÀI HỌC\n\n“HÌNH CHÓP TAM GIÁC ĐỀU”\n\nHình chóp tam giác đều xuất hiện trong kiến trúc, lều trại và nhiều vật dụng.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hình chóp tam giác đều có: đáy là tam giác đều, các mặt bên là các tam giác cân bằng nhau chung đỉnh.\n\n• Hình chóp tam giác đều có 4 mặt (1 đáy + 3 mặt bên), 6 cạnh.\n\n• Trung đoạn là đường cao của mặt bên kẻ từ đỉnh chóp.\n\n• Diện tích xung quanh: Sxq = p·d (p là nửa chu vi đáy, d là trung đoạn).\n\n• Thể tích: V = (1/3)·S·h (S là diện tích đáy, h là chiều cao).",
        "quizzes": [
          {
            "question": "Mặt đáy của hình chóp tam giác đều là:",
            "options": ["Tam giác đều", "Hình vuông", "Hình chữ nhật", "Lục giác đều"],
            "correctAnswer": 0,
            "explanation": "✅ Hình chóp tam giác đều có đáy là tam giác đều."
          },
          {
            "question": "Hình chóp tam giác đều có tất cả bao nhiêu mặt?",
            "options": ["4", "3", "5", "6"],
            "correctAnswer": 0,
            "explanation": "✅ 1 mặt đáy + 3 mặt bên = 4 mặt."
          },
          {
            "question": "Hình chóp tam giác đều có đáy cạnh 6, trung đoạn 4. Diện tích xung quanh bằng (p·d, p là nửa chu vi đáy):",
            "options": ["36", "24", "72", "48"],
            "correctAnswer": 0,
            "explanation": "✅ p = 3·6/2 = 9; Sxq = 9·4 = 36."
          },
          {
            "question": "Hình chóp tam giác đều có đáy là tam giác đều cạnh 6, chiều cao 4. Thể tích bằng (1/3)·S·h, với S = 9√3 ≈ 15,6:",
            "options": ["≈ 20,8", "≈ 62,4", "≈ 10,4", "≈ 36"],
            "correctAnswer": 0,
            "explanation": "✅ V = (1/3)·9√3·4 = 12√3 ≈ 20,8."
          }
        ]
      },
      {
        "id": "toan8_t2_bai39",
        "week": 35,
        "title": "Bài 39: Hình chóp tứ giác đều",
        "content": "🌅 BÀI HỌC\n\n“HÌNH CHÓP TỨ GIÁC ĐỀU”\n\nHình chóp tứ giác đều là mô hình quen thuộc của kim tự tháp.\n\n---\n\n📚 KIẾN THỨC TRỌNG TÂM\n\n• Hình chóp tứ giác đều có: đáy là hình vuông, các mặt bên là các tam giác cân bằng nhau chung đỉnh.\n\n• Hình chóp tứ giác đều có 5 mặt (1 đáy + 4 mặt bên), 8 cạnh.\n\n• Diện tích xung quanh: Sxq = p·d (p là nửa chu vi đáy, d là trung đoạn).\n\n• Thể tích: V = (1/3)·S·h (S là diện tích đáy, h là chiều cao).\n\n  Ví dụ: đáy cạnh 4, chiều cao 3 ⇒ S = 16, V = (1/3)·16·3 = 16.",
        "quizzes": [
          {
            "question": "Mặt đáy của hình chóp tứ giác đều là:",
            "options": ["Hình vuông", "Tam giác đều", "Hình chữ nhật", "Hình thoi"],
            "correctAnswer": 0,
            "explanation": "✅ Hình chóp tứ giác đều có đáy là hình vuông."
          },
          {
            "question": "Hình chóp tứ giác đều có tất cả bao nhiêu mặt?",
            "options": ["5", "4", "6", "8"],
            "correctAnswer": 0,
            "explanation": "✅ 1 mặt đáy + 4 mặt bên = 5 mặt."
          },
          {
            "question": "Hình chóp tứ giác đều có đáy cạnh 4, chiều cao 3. Thể tích bằng:",
            "options": ["16", "48", "12", "24"],
            "correctAnswer": 0,
            "explanation": "✅ S = 4·4 = 16; V = (1/3)·16·3 = 16."
          },
          {
            "question": "Hình chóp tứ giác đều có đáy cạnh 8, trung đoạn 5. Diện tích xung quanh bằng (p·d):",
            "options": ["80", "40", "160", "320"],
            "correctAnswer": 0,
            "explanation": "✅ p = 4·8/2 = 16; Sxq = 16·5 = 80."
          }
        ]
      }
    ]
  },
  {
    "id": "van8_t1",
    "subject": "Ngữ văn",
    "grade": 8,
    "volume": "Tập 1 (Bài 1 - 5)",
    "emoji": "🏮",
    "color": "#f59e0b",
    "stars": 10,
    "lessons": [
      {
        "id": "van8_t1_bai1",
        "week": 2,
        "title": "Bài 1: Câu chuyện của lịch sử",
        "content": "🌅 BÀI HỌC\n\n“CÂU CHUYỆN CỦA LỊCH SỬ”\n\nBài học đưa em về những trang sử hào hùng của dân tộc qua ba văn bản.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Lá cờ thêu sáu chữ vàng” (Nguyễn Huy Tưởng): truyện lịch sử kể về chàng thiếu niên Trần Quốc Toản 16 tuổi thêu lá cờ sáu chữ “Phá cường địch, báo hoàng ân” để quyết chí đánh giặc.\n\n• “Quang Trung đại phá quân Thanh” (trích “Hoàng Lê nhất thống chí”, Ngô gia văn phái): tái hiện chiến thắng lịch sử Tết Kỉ Dậu 1789 của vua Quang Trung trước quân Thanh.\n\n• “Ta đi tới” (Tố Hữu): bài thơ khẳng định niềm tin chiến thắng và khát vọng hòa bình trong kháng chiến chống Pháp.\n\n→ Bài học rèn kĩ năng đọc hiểu truyện lịch sử và cảm nhận lòng yêu nước, tự hào dân tộc.",
        "quizzes": [
          {
            "question": "Truyện “Lá cờ thêu sáu chữ vàng” của tác giả nào?",
            "options": ["Nguyễn Huy Tưởng", "Tố Hữu", "Ngô Tất Tố", "Nam Cao"],
            "correctAnswer": 0,
            "explanation": "✅ “Lá cờ thêu sáu chữ vàng” là truyện lịch sử của Nguyễn Huy Tưởng."
          },
          {
            "question": "Sáu chữ thêu trên lá cờ của Trần Quốc Toản là:",
            "options": ["Phá cường địch, báo hoàng ân", "Vì nước vì dân", "Trung với nước, hiếu với dân", "Kháng chiến nhất định thắng lợi"],
            "correctAnswer": 0,
            "explanation": "✅ Trần Quốc Toản thêu sáu chữ “Phá cường địch, báo hoàng ân” để tỏ quyết tâm đánh giặc."
          },
          {
            "question": "Văn bản “Quang Trung đại phá quân Thanh” được trích từ:",
            "options": ["Hoàng Lê nhất thống chí", "Lịch sử nước ta", "Bình Ngô đại cáo", "Hịch tướng sĩ"],
            "correctAnswer": 0,
            "explanation": "✅ Văn bản trích trong “Hoàng Lê nhất thống chí” của Ngô gia văn phái."
          },
          {
            "question": "Chiến thắng được kể trong “Quang Trung đại phá quân Thanh” diễn ra vào thời điểm nào?",
            "options": ["Tết Kỉ Dậu năm 1789", "Mùa thu năm 1945", "Mùa xuân 1975", "Tết Mậu Thân 1968"],
            "correctAnswer": 0,
            "explanation": "✅ Đêm 30 Tết và mùng 5 Tết Kỉ Dậu 1789, vua Quang Trung đại phá quân Thanh."
          },
          {
            "question": "Bài thơ “Ta đi tới” là của nhà thơ nào?",
            "options": ["Tố Hữu", "Huy Cận", "Xuân Diệu", "Chế Lan Viên"],
            "correctAnswer": 0,
            "explanation": "✅ “Ta đi tới” là bài thơ của Tố Hữu, viết về niềm tin kháng chiến."
          }
        ]
      },
      {
        "id": "van8_t1_bai2",
        "week": 6,
        "title": "Bài 2: Vẻ đẹp cổ điển",
        "content": "🌅 BÀI HỌC\n\n“VẺ ĐẸP CỔ ĐIỂN”\n\nBài học về vẻ đẹp của thơ Đường luật cổ điển và nghệ thuật truyền thống.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Thu điếu” (Nguyễn Khuyến): bài thơ thất ngôn bát cú Đường luật tả cảnh mùa thu yên tĩnh, trong trẻo của làng quê Bắc Bộ (“Ao thu lạnh lẽo nước trong veo”).\n\n• “Thiên Trường vãn vọng” (Trần Nhân Tông): bài thơ tứ tuyệt vẽ nên bức tranh buổi chiều nơi thôn dã yên bình, thể hiện tình yêu quê hương, đất nước.\n\n• “Ca Huế trên sông Hương” (Hà Ánh Minh): văn bản giới thiệu nghệ thuật ca Huế — sự kết hợp hài hòa giữa ca nhạc dân gian và cung đình, trình diễn trên sông Hương.\n\n→ Bài học giúp em cảm nhận vẻ đẹp cổ điển và giá trị văn hóa truyền thống.",
        "quizzes": [
          {
            "question": "Bài thơ “Thu điếu” của tác giả nào?",
            "options": ["Nguyễn Khuyến", "Hồ Xuân Hương", "Bà Huyện Thanh Quan", "Trần Nhân Tông"],
            "correctAnswer": 0,
            "explanation": "✅ “Thu điếu” (Câu cá mùa thu) là bài thơ nổi tiếng của Nguyễn Khuyến."
          },
          {
            "question": "Bài thơ “Thu điếu” thuộc thể thơ:",
            "options": ["Thất ngôn bát cú Đường luật", "Lục bát", "Song thất lục bát", "Thơ tự do"],
            "correctAnswer": 0,
            "explanation": "✅ “Thu điếu” là bài thơ thất ngôn bát cú Đường luật gồm 8 câu, mỗi câu 7 chữ."
          },
          {
            "question": "Bài thơ “Thiên Trường vãn vọng” là của:",
            "options": ["Trần Nhân Tông", "Nguyễn Trãi", "Lý Công Uẩn", "Trần Quốc Tuấn"],
            "correctAnswer": 0,
            "explanation": "✅ “Thiên Trường vãn vọng” (Buổi chiều đứng ở phủ Thiên Trường trông ra) của vua Trần Nhân Tông."
          },
          {
            "question": "Văn bản “Ca Huế trên sông Hương” giới thiệu về:",
            "options": ["Nghệ thuật ca Huế trên sông Hương", "Cảnh đẹp sông Hương", "Lễ hội Huế", "Ẩm thực Huế"],
            "correctAnswer": 0,
            "explanation": "✅ Văn bản giới thiệu đặc sắc của ca Huế được trình diễn trên sông Hương."
          },
          {
            "question": "Ca Huế được hình thành từ sự kết hợp của:",
            "options": ["Ca nhạc dân gian và ca nhạc cung đình", "Nhạc phương Tây và nhạc cổ truyền", "Chỉ ca nhạc dân gian", "Chỉ ca nhạc cung đình"],
            "correctAnswer": 0,
            "explanation": "✅ Ca Huế kết hợp ca nhạc dân gian với ca nhạc cung đình, vừa sôi nổi vừa trang trọng."
          }
        ]
      },
      {
        "id": "van8_t1_bai3",
        "week": 9,
        "title": "Bài 3: Lời sông núi",
        "content": "🌅 BÀI HỌC\n\n“LỜI SÔNG NÚI”\n\nBài học về những áng văn, thơ bất hủ thể hiện chủ quyền và tinh thần yêu nước.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Hịch tướng sĩ” (Trần Quốc Tuấn): áng văn nghị luận thời Trần, khích lệ tướng sĩ tinh thần yêu nước, căm thù giặc, quyết tâm đánh giặc cứu nước.\n\n• “Tinh thần yêu nước của nhân dân ta” (Hồ Chí Minh): bài văn nghị luận chứng minh truyền thống yêu nước nồng nàn của dân tộc qua các thời kì lịch sử.\n\n• “Nam quốc sơn hà” (bài thơ thần thời Lý): khẳng định chủ quyền lãnh thổ của đất nước — bản tuyên ngôn độc lập đầu tiên.\n\n• Thực hành đọc: “Chiếu dời đô” (Lý Công Uẩn).\n\n→ Bài học bồi đắp lòng tự hào dân tộc và ý thức trách nhiệm với cộng đồng.",
        "quizzes": [
          {
            "question": "“Hịch tướng sĩ” của tác giả nào?",
            "options": ["Trần Quốc Tuấn", "Trần Nhân Tông", "Lý Công Uẩn", "Nguyễn Trãi"],
            "correctAnswer": 0,
            "explanation": "✅ “Hịch tướng sĩ” là tác phẩm của Trần Quốc Tuấn (Trần Hưng Đạo)."
          },
          {
            "question": "Hịch là thể loại:",
            "options": ["Văn nghị luận thời xưa dùng để kêu gọi, khích lệ", "Truyện dân gian", "Thơ Đường luật", "Văn bản thông tin"],
            "correctAnswer": 0,
            "explanation": "✅ Hịch là thể văn nghị luận thời xưa, thường được vua chúa, tướng lĩnh dùng để kêu gọi, cổ vũ."
          },
          {
            "question": "Bài thơ “Nam quốc sơn hà” ra đời trong thời kì nào?",
            "options": ["Nhà Lý", "Nhà Trần", "Nhà Lê", "Nhà Nguyễn"],
            "correctAnswer": 0,
            "explanation": "✅ “Nam quốc sơn hà” gắn với cuộc kháng chiến chống Tống thời Lý (thế kỉ XI)."
          },
          {
            "question": "Ý nghĩa câu thơ “Sông núi nước Nam vua Nam ở” trong “Nam quốc sơn hà” là:",
            "options": ["Khẳng định chủ quyền lãnh thổ của đất nước", "Ca ngợi cảnh đẹp sông núi", "Nỗi nhớ quê hương", "Khuyên con người sống hòa thuận"],
            "correctAnswer": 0,
            "explanation": "✅ “Nam quốc sơn hà” là bản tuyên ngôn độc lập đầu tiên khẳng định chủ quyền dân tộc."
          },
          {
            "question": "“Tinh thần yêu nước của nhân dân ta” thuộc kiểu văn bản:",
            "options": ["Văn nghị luận chứng minh", "Văn tự sự", "Văn miêu tả", "Văn thuyết minh"],
            "correctAnswer": 0,
            "explanation": "✅ Bài văn của Bác Hồ dùng dẫn chứng để chứng minh truyền thống yêu nước của dân tộc."
          }
        ]
      },
      {
        "id": "van8_t1_bai4",
        "week": 13,
        "title": "Bài 4: Tiếng cười trào phúng trong thơ",
        "content": "🌅 BÀI HỌC\n\n“TIẾNG CƯỜI TRÀO PHÚNG TRONG THƠ”\n\nTiếng cười trào phúng vừa giải trí vừa phê phán thói hư tật xấu.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Lễ xướng danh khoa Đinh Dậu” (Trần Tế Xương): bài thơ châm biếm sâu cay cảnh thi cử nhố nhăng và bọn quan lại thời thực dân.\n\n• “Lai Tân” (Hồ Chí Minh): bài thơ chữ Hán trào phúng chế giễu bộ máy quan lại thối nát, đồng thời bộc lộ niềm tin vào sự tất thắng của cách mạng.\n\n• “Một số giọng điệu của tiếng cười trong thơ trào phúng”: bài viết bàn về các cách gây cười trong thơ.\n\n• Thực hành đọc: “Vịnh cây vông” (Nguyễn Công Trứ).\n\n→ Bài học giúp em nhận ra ý nghĩa của tiếng cười trong đời sống.",
        "quizzes": [
          {
            "question": "Bài thơ “Lễ xướng danh khoa Đinh Dậu” của tác giả nào?",
            "options": ["Trần Tế Xương", "Nguyễn Khuyến", "Nguyễn Công Trứ", "Hồ Xuân Hương"],
            "correctAnswer": 0,
            "explanation": "✅ “Lễ xướng danh khoa Đinh Dậu” là bài thơ trào phúng nổi tiếng của Trần Tế Xương (Tú Xương)."
          },
          {
            "question": "Đối tượng bị châm biếm trong “Lễ xướng danh khoa Đinh Dậu” là:",
            "options": ["Cảnh thi cử nhố nhăng và bọn quan lại", "Người nông dân", "Các học trò chăm chỉ", "Vua quan thời phong kiến"],
            "correctAnswer": 0,
            "explanation": "✅ Bài thơ phê phán trường thi nhố nhăng, quan lại không có năng lực."
          },
          {
            "question": "Bài thơ “Lai Tân” là của tác giả nào?",
            "options": ["Hồ Chí Minh", "Tố Hữu", "Sóng Hồng", "Phạm Tiến Duật"],
            "correctAnswer": 0,
            "explanation": "✅ “Lai Tân” là bài thơ chữ Hán trong “Nhật kí trong tù” của Hồ Chí Minh."
          },
          {
            "question": "Thơ trào phúng dùng tiếng cười nhằm mục đích chính là:",
            "options": ["Phê phán thói hư tật xấu trong xã hội", "Chỉ để giải trí", "Kể chuyện đời thường", "Tả cảnh thiên nhiên"],
            "correctAnswer": 0,
            "explanation": "✅ Tiếng cười trong thơ trào phúng mang chức năng phê phán, đả kích những điều xấu."
          },
          {
            "question": "“Vịnh cây vông” (thực hành đọc) là bài thơ của:",
            "options": ["Nguyễn Công Trứ", "Trần Tế Xương", "Nguyễn Khuyến", "Phan Bội Châu"],
            "correctAnswer": 0,
            "explanation": "✅ “Vịnh cây vông” là bài thơ trào phúng của Nguyễn Công Trứ."
          }
        ]
      },
      {
        "id": "van8_t1_bai5",
        "week": 16,
        "title": "Bài 5: Những câu chuyện hài",
        "content": "🌅 BÀI HỌC\n\n“NHỮNG CÂU CHUYỆN HÀI”\n\nTiếng cười trong truyện hài giúp ta nhìn ra những điều đáng cười trong cuộc sống.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Trưởng giả học làm sang” (trích, Mô-li-e): vở hài kịch nổi tiếng của Pháp kể về Giuốc-đanh học đòi làm quý tộc, gây ra nhiều cảnh buồn cười.\n\n• “Chùm truyện cười dân gian Việt Nam”: những câu chuyện gây cười qua tình huống trái với tự nhiên, lẽ thường.\n\n• “Chùm ca dao trào phúng”: tiếng cười châm biếm nhẹ nhàng trong ca dao.\n\n• Thực hành đọc: “Giá không có ruồi” (A-dít Ne-xin).\n\n→ Bài học giúp em hiểu đặc điểm truyện cười và ý nghĩa của tiếng cười.",
        "quizzes": [
          {
            "question": "Vở kịch “Trưởng giả học làm sang” của tác giả nào?",
            "options": ["Mô-li-e", "Sếch-xpia", "Gô-gôn", "Sô-phô-clơ"],
            "correctAnswer": 0,
            "explanation": "✅ “Trưởng giả học làm sang” (trích “Trưởng giả trong giới quý tộc”) của nhà viết kịch Pháp Mô-li-e."
          },
          {
            "question": "Nhân vật chính trong “Trưởng giả học làm sang” là:",
            "options": ["Giuốc-đanh", "Xô-phô-clơ", "Lơ-phen-tơ", "Đác-tuýp"],
            "correctAnswer": 0,
            "explanation": "✅ Ông Giuốc-đanh học đòi làm sang, gây nên bao cảnh hài hước."
          },
          {
            "question": "“Trưởng giả học làm sang” thuộc thể loại:",
            "options": ["Hài kịch", "Truyện ngắn", "Thơ", "Kí"],
            "correctAnswer": 0,
            "explanation": "✅ Đây là đoạn trích từ vở hài kịch nổi tiếng của Mô-li-e."
          },
          {
            "question": "Truyện cười dân gian thường gây cười bằng cách:",
            "options": ["Tạo tình huống trái với tự nhiên, lẽ thường", "Miêu tả cảnh đẹp", "Kể về người anh hùng", "Tả nỗi buồn"],
            "correctAnswer": 0,
            "explanation": "✅ Truyện cười đặt nhân vật vào tình huống bất thường để gây tiếng cười."
          },
          {
            "question": "Truyện “Giá không có ruồi” (thực hành đọc) của tác giả nước nào?",
            "options": ["Thổ Nhĩ Kỳ", "Pháp", "Nga", "Trung Quốc"],
            "correctAnswer": 0,
            "explanation": "✅ “Giá không có ruồi” là truyện cười của nhà văn Thổ Nhĩ Kỳ A-dít Ne-xin."
          }
        ]
      }
    ]
  },
  {
    "id": "van8_t2",
    "subject": "Ngữ văn",
    "grade": 8,
    "volume": "Tập 2 (Bài 6 - 10)",
    "emoji": "🖋️",
    "color": "#10b981",
    "stars": 10,
    "lessons": [
      {
        "id": "van8_t2_bai6",
        "week": 20,
        "title": "Bài 6: Chân dung cuộc sống",
        "content": "🌅 BÀI HỌC\n\n“CHÂN DUNG CUỘC SỐNG”\n\nNhững bức chân dung về con người qua các tác phẩm truyện, thơ đặc sắc.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Mắt sói” (Đa-ni-en Pen-nắc): truyện thiếu nhi kể về tình bạn kì lạ giữa chàng trai Át-phông-xơ và sói Lam qua ánh mắt.\n\n• “Lặng lẽ Sa Pa” (Nguyễn Thành Long): truyện ngắn về anh thanh niên làm công tác khí tượng trên núi cao — vẻ đẹp của con người lao động thầm lặng.\n\n• “Bếp lửa” (Bằng Việt): bài thơ xúc động về tình bà cháu, hình ảnh bếp lửa ấm áp.\n\n• Thực hành đọc: “Chiếc lá cuối cùng” (O. Hen-ri).\n\n→ Bài học hướng tới việc phân tích truyện và cảm nhận vẻ đẹp con người.",
        "quizzes": [
          {
            "question": "Truyện ngắn “Lặng lẽ Sa Pa” của tác giả nào?",
            "options": ["Nguyễn Thành Long", "Nguyễn Minh Châu", "Lê Minh Khuê", "Nguyễn Quang Sáng"],
            "correctAnswer": 0,
            "explanation": "✅ “Lặng lẽ Sa Pa” là truyện ngắn của Nguyễn Thành Long."
          },
          {
            "question": "Nhân vật chính trong “Lặng lẽ Sa Pa” làm nghề gì?",
            "options": ["Công tác khí tượng trên núi", "Bác sĩ", "Giáo viên", "Họa sĩ"],
            "correctAnswer": 0,
            "explanation": "✅ Anh thanh niên làm công tác khí tượng thủy văn, lặng lẽ cống hiến trên Sa Pa."
          },
          {
            "question": "Bài thơ “Bếp lửa” của tác giả nào?",
            "options": ["Bằng Việt", "Chính Hữu", "Phạm Tiến Duật", "Tố Hữu"],
            "correctAnswer": 0,
            "explanation": "✅ “Bếp lửa” là bài thơ của Bằng Việt, viết về tình bà cháu."
          },
          {
            "question": "Hình ảnh trung tâm gợi nhớ tình cảm trong bài thơ “Bếp lửa” là:",
            "options": ["Bếp lửa — tình bà cháu", "Dòng sông", "Cánh đồng", "Ngọn đèn"],
            "correctAnswer": 0,
            "explanation": "✅ Bếp lửa gắn với kỉ niệm tuổi thơ và tình cảm yêu thương của bà."
          },
          {
            "question": "Truyện “Mắt sói” là của nhà văn nước nào?",
            "options": ["Pháp", "Mỹ", "Nga", "Đức"],
            "correctAnswer": 0,
            "explanation": "✅ “Mắt sói” của nhà văn Pháp Đa-ni-en Pen-nắc, kể qua ánh mắt của chú sói."
          }
        ]
      },
      {
        "id": "van8_t2_bai7",
        "week": 24,
        "title": "Bài 7: Tin yêu và ước vọng",
        "content": "🌅 BÀI HỌC\n\n“TIN YÊU VÀ ƯỚC VỌNG”\n\nNhững tác phẩm viết trong kháng chiến thể hiện niềm tin và ước vọng hòa bình.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Đồng chí” (Chính Hữu): bài thơ về tình đồng chí, đồng đội của những người lính — “Đầu súng trăng treo”.\n\n• “Lá đỏ” (Nguyễn Đình Thi): bài thơ viết trên đường Trường Sơn, niềm tin gặp gỡ và ước vọng thống nhất.\n\n• “Những ngôi sao xa xôi” (Lê Minh Khuê): truyện ngắn về ba cô thanh niên xung phong (Phương Định, Thao, Nho) trên tuyến đường Trường Sơn.\n\n• Thực hành đọc: “Bài thơ về tiểu đội xe không kính” (Phạm Tiến Duật).\n\n→ Bài học làm em tập làm thơ tự do và ghi lại cảm nghĩ về một bài thơ.",
        "quizzes": [
          {
            "question": "Bài thơ “Đồng chí” của tác giả nào?",
            "options": ["Chính Hữu", "Hữu Thỉnh", "Bằng Việt", "Nguyễn Khoa Điềm"],
            "correctAnswer": 0,
            "explanation": "✅ “Đồng chí” là bài thơ nổi tiếng của Chính Hữu về tình đồng đội."
          },
          {
            "question": "Câu thơ nào sau đây trích trong bài “Đồng chí”?",
            "options": ["Đầu súng trăng treo", "Lá đỏ về đầy một trời thương nhớ", "Xe không kính", "Sông núi nước Nam"],
            "correctAnswer": 0,
            "explanation": "✅ Hình ảnh “Đầu súng trăng treo” là kết thúc nổi tiếng của bài thơ “Đồng chí”."
          },
          {
            "question": "Truyện ngắn “Những ngôi sao xa xôi” của tác giả nào?",
            "options": ["Lê Minh Khuê", "Nguyễn Thành Long", "Vũ Cao", "Anh Đức"],
            "correctAnswer": 0,
            "explanation": "✅ “Những ngôi sao xa xôi” là truyện ngắn của Lê Minh Khuê."
          },
          {
            "question": "Trong “Những ngôi sao xa xôi”, người kể chuyện (xưng tôi) là:",
            "options": ["Phương Định", "Nho", "Thao", "Một chiến sĩ lái xe"],
            "correctAnswer": 0,
            "explanation": "✅ Phương Định là cô thanh niên xung phong, người kể chuyện xưng tôi."
          },
          {
            "question": "“Bài thơ về tiểu đội xe không kính” (thực hành đọc) của tác giả nào?",
            "options": ["Phạm Tiến Duật", "Chính Hữu", "Tố Hữu", "Nguyễn Đình Thi"],
            "correctAnswer": 0,
            "explanation": "✅ Bài thơ là của Phạm Tiến Duật, viết về những chiếc xe không kính trên đường Trường Sơn."
          }
        ]
      },
      {
        "id": "van8_t2_bai8",
        "week": 27,
        "title": "Bài 8: Nhà văn và trang viết",
        "content": "🌅 BÀI HỌC\n\n“NHÀ VĂN VÀ TRANG VIẾT”\n\nTìm hiểu về công việc của nhà văn và cách đọc văn để tìm ý nghĩa.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Nhà thơ của quê hương làng cảnh Việt Nam” (Trần Đăng Khoa): bài viết nghị luận về nhà thơ Nguyễn Khuyến — nhà thơ của làng quê Việt Nam.\n\n• “Đọc văn – cuộc chơi tìm ý nghĩa”: bàn về cách đọc văn học để tìm ra ý nghĩa của tác phẩm.\n\n• “Xe đêm”: truyện ngắn về những chuyến xe đêm và những phận người.\n\n• Thực hành đọc: “Nắng mới – sự thành thực của một tâm hồn giàu mơ mộng” (bàn về bài thơ “Nắng mới” của Lưu Trọng Lư).\n\n→ Bài học rèn kĩ năng viết bài phân tích tác phẩm và bày tỏ ý kiến về văn học.",
        "quizzes": [
          {
            "question": "Bài viết “Nhà thơ của quê hương làng cảnh Việt Nam” viết về nhà thơ nào?",
            "options": ["Nguyễn Khuyến", "Hồ Xuân Hương", "Nguyễn Du", "Trần Tế Xương"],
            "correctAnswer": 0,
            "explanation": "✅ Bài viết ca ngợi Nguyễn Khuyến — nhà thơ của làng cảnh quê hương Việt Nam."
          },
          {
            "question": "“Nhà thơ của quê hương làng cảnh Việt Nam” là của tác giả nào?",
            "options": ["Trần Đăng Khoa", "Nguyễn Đình Thi", "Hoài Thanh", "Vũ Ngọc Phan"],
            "correctAnswer": 0,
            "explanation": "✅ Bài viết của nhà thơ Trần Đăng Khoa."
          },
          {
            "question": "Văn bản “Đọc văn – cuộc chơi tìm ý nghĩa” bàn về:",
            "options": ["Cách đọc văn để tìm ra ý nghĩa tác phẩm", "Cách viết chữ đẹp", "Trò chơi dân gian", "Cách kể chuyện"],
            "correctAnswer": 0,
            "explanation": "✅ Nhan đề đã nói rõ: đọc văn là cuộc chơi đi tìm ý nghĩa của tác phẩm."
          },
          {
            "question": "Bài thơ “Nắng mới” (được bàn đến trong phần thực hành đọc) là của:",
            "options": ["Lưu Trọng Lư", "Xuân Diệu", "Huy Cận", "Thế Lữ"],
            "correctAnswer": 0,
            "explanation": "✅ “Nắng mới” là bài thơ nổi tiếng của nhà thơ Lưu Trọng Lư."
          },
          {
            "question": "“Xe đêm” là thể loại:",
            "options": ["Truyện ngắn", "Bài thơ", "Văn bản thông tin", "Hài kịch"],
            "correctAnswer": 0,
            "explanation": "✅ “Xe đêm” là truyện ngắn trong Bài 8."
          }
        ]
      },
      {
        "id": "van8_t2_bai9",
        "week": 31,
        "title": "Bài 9: Hôm nay và ngày mai",
        "content": "🌅 BÀI HỌC\n\n“HÔM NAY VÀ NGÀY MAI”\n\nNhững văn bản thông tin về môi trường, Trái Đất và trách nhiệm của con người.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Miền châu thổ sông Cửu Long cần chuyển đổi từ sống chung sang chào đón lũ”: văn bản thông tin bàn về giải pháp thích ứng với lũ ở Đồng bằng sông Cửu Long.\n\n• “Choáng ngợp và đau đớn những cảnh báo từ loạt phim Hành tinh của chúng ta”: văn bản về thông điệp bảo vệ môi trường từ loạt phim tài liệu.\n\n• “Diễn từ ứng khẩu của thủ lĩnh da đỏ Xi-át-tơn”: lời kêu gọi bảo vệ thiên nhiên, đất đai đầy sức thuyết phục.\n\n• Thực hành đọc: “Dấu chân sinh thái” của mỗi người và thông điệp từ Trái Đất.\n\n→ Bài học rèn kĩ năng đọc hiểu văn bản thông tin và viết văn bản thuyết minh, kiến nghị.",
        "quizzes": [
          {
            "question": "Văn bản “Miền châu thổ sông Cửu Long cần chuyển đổi từ sống chung sang chào đón lũ” bàn về:",
            "options": ["Giải pháp thích ứng với lũ ở Đồng bằng sông Cửu Long", "Kinh tế biển", "Du lịch miền Tây", "Giao thông sông nước"],
            "correctAnswer": 0,
            "explanation": "✅ Văn bản đề xuất chuyển từ chịu đựng lũ sang chủ động chào đón, khai thác lợi ích từ lũ."
          },
          {
            "question": "Văn bản “Diễn từ ứng khẩu của thủ lĩnh da đỏ Xi-át-tơn” kêu gọi điều gì?",
            "options": ["Bảo vệ thiên nhiên, đất đai", "Xây dựng thành phố hiện đại", "Phát triển công nghiệp", "Khai thác tài nguyên"],
            "correctAnswer": 0,
            "explanation": "✅ Bài diễn từ nổi tiếng kêu gọi con người tôn trọng, bảo vệ thiên nhiên và đất đai."
          },
          {
            "question": "Ba văn bản chính của Bài 9 cùng hướng về chủ đề:",
            "options": ["Môi trường và tương lai Trái Đất", "Lịch sử dân tộc", "Tình bạn tuổi học trò", "Văn hóa ẩm thực"],
            "correctAnswer": 0,
            "explanation": "✅ Cả ba văn bản đều bàn về môi trường, bảo vệ Trái Đất — vấn đề “hôm nay” và “ngày mai”."
          },
          {
            "question": "Văn bản thông tin thường có đặc điểm:",
            "options": ["Cung cấp thông tin, số liệu cụ thể", "Chỉ kể chuyện hư cấu", "Chỉ thể hiện cảm xúc", "Chỉ miêu tả thiên nhiên"],
            "correctAnswer": 0,
            "explanation": "✅ Văn bản thông tin cung cấp tri thức với số liệu, sự kiện cụ thể, có nhan đề, đề mục rõ ràng."
          },
          {
            "question": "Loạt phim “Hành tinh của chúng ta” (được nói đến trong bài) mang thông điệp:",
            "options": ["Cảnh báo về ô nhiễm và kêu gọi bảo vệ môi trường", "Quảng bá du lịch", "Giới thiệu động vật hoang dã", "Kể về lịch sử Trái Đất"],
            "correctAnswer": 0,
            "explanation": "✅ Phim cho thấy vẻ đẹp của thiên nhiên đồng thời cảnh báo tác động của con người, kêu gọi hành động bảo vệ môi trường."
          }
        ]
      },
      {
        "id": "van8_t2_bai10",
        "week": 34,
        "title": "Bài 10: Sách – người bạn đồng hành",
        "content": "🌅 BÀI HỌC\n\n“SÁCH – NGƯỜI BẠN ĐỒNG HÀNH”\n\nBài học cuối cùng của lớp 8 về sách và niềm vui đọc sách.\n\n---\n\n📚 CÁC VĂN BẢN TRONG BÀI\n\n• “Đọc như một hành trình”: sách đưa ta đi qua những miền tri thức mới, như một hành trình dài.\n\n• “Đọc như một cuộc thám hiểm”: mỗi cuốn sách là một vùng đất mới để khám phá, khai phá.\n\n• “Đọc để đồng hành và chia sẻ”: đọc sách gắn kết con người, mang lại sự sẻ chia.\n\n→ Bài học khép lại năm học với hoạt động “Ngày hội với sách”: giới thiệu cuốn sách yêu thích và sáng tạo nhan đề cho tác phẩm mới.",
        "quizzes": [
          {
            "question": "Ba văn bản của Bài 10 cùng viết về chủ đề gì?",
            "options": ["Đọc sách", "Du lịch", "Ẩm thực", "Thể thao"],
            "correctAnswer": 0,
            "explanation": "✅ Cả ba văn bản đều bàn về niềm vui và ý nghĩa của việc đọc sách."
          },
          {
            "question": "Văn bản “Đọc như một cuộc thám hiểm” khẳng định:",
            "options": ["Mỗi cuốn sách là một vùng đất mới để khám phá", "Sách chỉ dành cho người lớn", "Đọc sách rất mệt mỏi", "Chỉ nên đọc sách giáo khoa"],
            "correctAnswer": 0,
            "explanation": "✅ Đọc sách như cuộc thám hiểm: mỗi trang sách mở ra những điều mới lạ."
          },
          {
            "question": "Theo văn bản “Đọc để đồng hành và chia sẻ”, đọc sách giúp con người:",
            "options": ["Kết nối và chia sẻ với nhau", "Xa cách hơn", "Chỉ biết thêm kiến thức", "Trở nên cô đơn"],
            "correctAnswer": 0,
            "explanation": "✅ Đọc sách để đồng hành cùng tác giả, cùng bạn đọc và chia sẻ cảm nhận."
          },
          {
            "question": "Hoạt động kết thúc Bài 10 là:",
            "options": ["Ngày hội với sách", "Cuộc thi thể thao", "Chuyến dã ngoại", "Đêm hội văn nghệ"],
            "correctAnswer": 0,
            "explanation": "✅ Bài 10 khép lại với hoạt động “Ngày hội với sách” — giới thiệu cuốn sách yêu thích."
          },
          {
            "question": "“Đọc như một hành trình” ví việc đọc sách như:",
            "options": ["Một chuyến đi dài khám phá tri thức", "Một cuộc chạy đua", "Một trận đấu", "Một buổi lễ"],
            "correctAnswer": 0,
            "explanation": "✅ Đọc sách là hành trình dài, mỗi cuốn sách là một chặng đường tri thức."
          }
        ]
      }
    ]
  }
]
