// Kho kiến thức "Khám Phá Thế Giới".
//
// VÌ SAO CẦN FILE NÀY:
// SGK dạy rất mỏng phần kiến thức nền: cơ thể người, loài vật, thiên nhiên,
// lịch sử - địa lý quê hương, an toàn sống. Đây lại đúng là những thứ trẻ con
// tò mò nhất và hỏi bố mẹ nhiều nhất. Khu này gom lại thành từng chủ đề ngắn
// để con tự đọc rồi tự kiểm tra.
//
// CẤU TRÚC GIỐNG HỆT mathData:
// { id, title, subtitle, emoji, stars, subject,
//   lesson: { title, badge, steps: [{ title, desc, formula, tip }] },
//   quizzes: [{ question, options, correctAnswer, explanation }] }
// Nhờ vậy cả hai khu dùng chung <TopicReader /> (src/components/TopicReader.jsx),
// sửa cách chấm bài một lần là cả hai khu cùng đúng.
//
// Trường `formula` ở đây KHÔNG phải công thức toán mà là ô "Sự thật thú vị"
// (TopicReader đổi icon ⚡ thành 🔎 khi theme='explore').
//
// LƯU Ý KHI THÊM NỘI DUNG:
// - Chỉ đưa vào những dữ kiện ổn định, không thay đổi theo thời sự hay theo
//   thay đổi hành chính. Ví dụ cố ý KHÔNG hỏi "Việt Nam có bao nhiêu tỉnh"
//   vì con số này vừa thay đổi và sẽ còn thay đổi.
// - correctAnswer là CHỈ SỐ trong mảng options (bắt đầu từ 0).

export const exploreData = {
  // ===================== TIỂU HỌC (lớp 1-5) =====================
  kids: [
    {
      id: 'kp_co_the',
      title: 'Cơ thể em kỳ diệu',
      subtitle: 'Tim, phổi, xương và 5 giác quan',
      emoji: '🫀',
      stars: 6,
      subject: 'Khoa học',
      lesson: {
        title: 'Bên trong cơ thể bé có gì?',
        badge: '🫀 CƠ THỂ NGƯỜI',
        steps: [
          {
            title: 'Trái tim - chiếc bơm không bao giờ nghỉ',
            desc: 'Tim nằm hơi lệch bên trái ngực bé. Tim bóp lại rồi giãn ra để đẩy máu đi khắp người, mang thức ăn và khí trong lành tới từng ngón tay, ngón chân. Khi bé chạy nhảy, cơ thể cần nhiều hơn nên tim đập nhanh hơn - đó là lý do bé thấy tim "thình thịch" sau khi chơi đuổi bắt.',
            formula: 'Tim của bé đập khoảng 100.000 lần mỗi ngày mà không nghỉ một giây nào.',
            tip: 'Bé thử đặt tay lên ngực trái, ngồi yên 1 phút rồi chạy tại chỗ 20 cái, đặt tay lại xem có khác không nhé!',
          },
          {
            title: 'Phổi và xương - hít thở và đứng thẳng',
            desc: 'Hai lá phổi nằm hai bên tim, phồng lên khi bé hít vào và xẹp xuống khi bé thở ra. Phổi lấy khí ô-xi trong không khí đưa vào máu. Còn bộ xương giống như khung nhà: giữ cho cơ thể đứng thẳng, và hộp sọ với lồng ngực còn làm áo giáp che cho não, tim, phổi bên trong.',
            formula: 'Người lớn có 206 chiếc xương, nhưng em bé mới sinh có tới hơn 270 chiếc - lớn lên một số xương dính lại với nhau.',
            tip: 'Uống sữa và phơi nắng buổi sớm giúp xương của bé chắc khoẻ hơn.',
          },
          {
            title: 'Năm giác quan và giấc ngủ',
            desc: 'Bé hiểu thế giới nhờ 5 giác quan: mắt nhìn, tai nghe, mũi ngửi, lưỡi nếm, da chạm. Tất cả tin tức đó chạy về não qua các dây thần kinh. Não làm việc cả ngày nên ban đêm cần ngủ để sắp xếp lại những gì đã học. Bé ngủ đủ thì sáng hôm sau nhớ bài nhanh hơn hẳn, và cơ thể cũng cao lên trong lúc ngủ.',
            formula: 'Trẻ 6-10 tuổi cần ngủ 9-11 tiếng mỗi đêm thì não mới nhớ bài tốt.',
            tip: 'Trước khi ngủ 1 tiếng, bé nên tắt tivi và điện thoại để mắt và não được nghỉ.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Trái tim nằm ở đâu trong cơ thể bé?',
          options: ['Trong bụng, dưới rốn', 'Trong ngực, hơi lệch về bên trái', 'Ở trong đầu', 'Ở bàn chân'],
          correctAnswer: 1,
          explanation: 'Tim nằm trong lồng ngực, hơi lệch sang bên trái. Vì thế khi đặt tay lên ngực trái bé nghe rõ nhịp tim nhất.',
        },
        {
          question: 'Vì sao khi bé chạy nhảy nhiều thì tim đập nhanh hơn?',
          options: ['Vì tim bị mệt nên run lên', 'Vì cơ thể cần nhiều máu và khí hơn nên tim phải bơm nhanh hơn', 'Vì bé sợ hãi', 'Vì trời nóng'],
          correctAnswer: 1,
          explanation: 'Khi vận động, cơ bắp cần nhiều ô-xi và thức ăn hơn, nên tim phải bơm máu nhanh hơn để kịp mang đến. Đó là dấu hiệu cơ thể đang khoẻ mạnh làm việc chứ không phải bệnh.',
        },
        {
          question: 'Bộ phận nào giúp bé lấy khí ô-xi từ không khí vào cơ thể?',
          options: ['Dạ dày', 'Hai lá phổi', 'Xương sườn', 'Trái tim'],
          correctAnswer: 1,
          explanation: 'Phổi là nơi nhận khí ô-xi khi bé hít vào và thải khí thừa khi thở ra. Tim thì lo việc bơm máu đi khắp cơ thể.',
        },
        {
          question: 'Bé nếm được vị ngọt của kẹo nhờ giác quan nào?',
          options: ['Thị giác (mắt)', 'Thính giác (tai)', 'Vị giác (lưỡi)', 'Khứu giác (mũi)'],
          correctAnswer: 2,
          explanation: 'Lưỡi có các nụ vị giác nhận ra vị ngọt, mặn, chua, đắng rồi báo về não. Mũi ngửi mùi thơm, còn mắt chỉ nhìn thấy hình dáng cái kẹo thôi.',
        },
        {
          question: 'Vì sao ngủ đủ giấc lại giúp bé học giỏi hơn?',
          options: ['Vì ngủ nhiều thì không phải làm bài', 'Vì lúc ngủ não sắp xếp và ghi nhớ lại những điều đã học', 'Vì ngủ làm bé quên hết bài cũ', 'Vì ngủ giúp mắt to hơn'],
          correctAnswer: 1,
          explanation: 'Ban đêm khi bé ngủ, não sắp xếp lại mọi thứ đã học trong ngày để nhớ lâu. Ngủ đủ còn giúp cơ thể lớn lên nữa đấy.',
        },
      ],
    },

    {
      id: 'kp_dong_vat',
      title: 'Thế giới loài vật',
      subtitle: 'Thú, chim, cá và vòng đời kỳ lạ',
      emoji: '🦁',
      stars: 6,
      subject: 'Khoa học',
      lesson: {
        title: 'Muôn loài quanh ta',
        badge: '🦁 ĐỘNG VẬT',
        steps: [
          {
            title: 'Các nhóm động vật quen thuộc',
            desc: 'Thú (chó, mèo, trâu, voi) đẻ con và nuôi con bằng sữa mẹ. Chim (gà, vịt, chim sẻ) có lông vũ, đẻ trứng, phần lớn biết bay. Cá thở bằng mang và sống dưới nước. Bò sát (rắn, thằn lằn, rùa) có da khô phủ vảy. Côn trùng (kiến, bướm, ong) có 6 chân và thường có râu.',
            formula: 'Cách đếm chân rất dễ nhớ: côn trùng 6 chân, nhện 8 chân, thú thường 4 chân.',
            tip: 'Cá heo sống dưới biển nhưng lại là THÚ chứ không phải cá, vì nó đẻ con, bú sữa mẹ và phải ngoi lên thở!',
          },
          {
            title: 'Con nào ăn gì?',
            desc: 'Loài ăn cỏ như trâu, bò, thỏ, hươu chỉ ăn cây cỏ, răng bằng và phẳng để nghiền. Loài ăn thịt như hổ, sư tử, cá sấu có răng nanh nhọn để cắn xé. Loài ăn tạp như gà, lợn, gấu và cả con người thì ăn được cả hai. Trong tự nhiên, cây cỏ nuôi con ăn cỏ, con ăn cỏ lại nuôi con ăn thịt - người ta gọi đó là chuỗi thức ăn.',
            formula: 'Chuỗi thức ăn: Cỏ ➜ Châu chấu ➜ Ếch ➜ Rắn ➜ Đại bàng.',
            tip: 'Nhìn hàm răng là đoán được con vật ăn gì: răng nhọn hoắt thì ăn thịt, răng bẹt thì ăn cỏ.',
          },
          {
            title: 'Vòng đời biến hoá',
            desc: 'Một số con vật thay đổi hình dạng hoàn toàn khi lớn lên. Bướm bắt đầu là trứng, nở thành sâu, sâu cuộn mình thành nhộng, rồi từ nhộng chui ra thành bướm có cánh. Ếch thì từ trứng nở thành nòng nọc có đuôi bơi dưới nước, sau đó mọc chân, rụng đuôi và lên bờ thành ếch.',
            formula: 'Bướm: Trứng ➜ Sâu ➜ Nhộng ➜ Bướm. Ếch: Trứng ➜ Nòng nọc ➜ Ếch con ➜ Ếch.',
            tip: 'Nòng nọc thở bằng mang như cá, còn ếch trưởng thành thở bằng phổi và cả qua da nữa.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Con nào sau đây là THÚ (đẻ con, nuôi con bằng sữa)?',
          options: ['Con gà', 'Con cá chép', 'Con mèo', 'Con rắn'],
          correctAnswer: 2,
          explanation: 'Mèo đẻ con và cho con bú sữa mẹ nên là thú. Gà đẻ trứng (chim), cá chép thở bằng mang, rắn là bò sát.',
        },
        {
          question: 'Con kiến có mấy chân?',
          options: ['4 chân', '6 chân', '8 chân', '10 chân'],
          correctAnswer: 1,
          explanation: 'Kiến là côn trùng nên có 6 chân. Nhện có 8 chân nên nhện KHÔNG phải côn trùng đâu nhé.',
        },
        {
          question: 'Nòng nọc sẽ lớn lên thành con gì?',
          options: ['Con cá', 'Con ếch', 'Con rắn', 'Con bướm'],
          correctAnswer: 1,
          explanation: 'Nòng nọc là ếch con lúc mới nở, sống dưới nước và có đuôi. Lớn lên nó mọc chân, rụng đuôi và nhảy lên bờ thành ếch.',
        },
        {
          question: 'Giai đoạn nào sau đây KHÔNG có trong vòng đời con bướm?',
          options: ['Trứng', 'Sâu', 'Nòng nọc', 'Nhộng'],
          correctAnswer: 2,
          explanation: 'Vòng đời bướm là Trứng ➜ Sâu ➜ Nhộng ➜ Bướm. Nòng nọc là của con ếch chứ không phải bướm.',
        },
        {
          question: 'Trong chuỗi thức ăn "Cỏ ➜ Châu chấu ➜ Ếch ➜ Rắn", con ếch ăn con gì?',
          options: ['Ăn cỏ', 'Ăn châu chấu', 'Ăn rắn', 'Không ăn gì cả'],
          correctAnswer: 1,
          explanation: 'Mũi tên chỉ "bị ăn bởi": châu chấu ăn cỏ, ếch ăn châu chấu, rắn ăn ếch. Vậy ếch ăn châu chấu.',
        },
      ],
    },

    {
      id: 'kp_cay_xanh',
      title: 'Cây xanh & thiên nhiên',
      subtitle: 'Cây lớn lên thế nào, nước đi đâu',
      emoji: '🌳',
      stars: 6,
      subject: 'Khoa học',
      lesson: {
        title: 'Bí mật của cây xanh',
        badge: '🌳 THIÊN NHIÊN',
        steps: [
          {
            title: 'Các bộ phận của cây',
            desc: 'Rễ cắm sâu xuống đất để hút nước và chất dinh dưỡng, đồng thời giữ cho cây không bị đổ. Thân đưa nước từ rễ lên và nâng đỡ cành lá. Lá đón ánh nắng để làm ra thức ăn nuôi cây. Hoa là nơi tạo ra hạt, và quả chính là cái áo bảo vệ hạt bên trong.',
            formula: 'Rễ hút nước ➜ Thân dẫn lên ➜ Lá làm ra thức ăn ➜ Hoa kết quả ➜ Quả giữ hạt ➜ Hạt mọc thành cây mới.',
            tip: 'Bé thử cắm một cành hoa trắng vào cốc nước pha màu, hôm sau cánh hoa sẽ đổi màu - đó là nước đi từ thân lên hoa!',
          },
          {
            title: 'Cây tự nấu ăn bằng ánh nắng',
            desc: 'Cây không đi kiếm ăn như con vật. Lá cây nhận ánh nắng, hút khí các-bô-níc trong không khí và dùng nước từ rễ để tự làm ra thức ăn nuôi mình. Quá trình này gọi là quang hợp. Điều tuyệt vời là trong lúc làm thức ăn, cây nhả ra khí ô-xi - đúng thứ khí mà bé cần để thở.',
            formula: 'Ánh nắng + Nước + Khí các-bô-níc ➜ Thức ăn cho cây + Khí ô-xi cho chúng ta.',
            tip: 'Trồng và giữ cây xanh chính là giữ lấy không khí trong lành để mình thở.',
          },
          {
            title: 'Vòng tuần hoàn của nước',
            desc: 'Nước ở biển, sông, hồ được mặt trời hâm nóng nên bay hơi lên cao. Lên cao gặp lạnh, hơi nước tụ lại thành những đám mây. Mây nặng dần rồi rơi xuống thành mưa. Nước mưa chảy về sông suối, ra biển, rồi lại bốc hơi lên. Cứ thế lặp đi lặp lại mãi mãi - nên nước bé uống hôm nay có thể từng là một giọt mưa từ rất lâu rồi.',
            formula: 'Bốc hơi ➜ Ngưng tụ thành mây ➜ Mưa rơi ➜ Chảy ra biển ➜ Lại bốc hơi.',
            tip: 'Vì nước cứ đi vòng tròn nên nếu mình làm bẩn sông suối, nước bẩn sẽ quay lại với chính chúng ta.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Bộ phận nào của cây hút nước từ đất lên?',
          options: ['Lá', 'Hoa', 'Rễ', 'Quả'],
          correctAnswer: 2,
          explanation: 'Rễ vừa hút nước và chất dinh dưỡng, vừa bám chặt vào đất giúp cây đứng vững trước gió bão.',
        },
        {
          question: 'Cây cần gì nhất để tự làm ra thức ăn nuôi mình?',
          options: ['Ánh nắng mặt trời', 'Bóng tối', 'Tiếng nhạc', 'Cát khô'],
          correctAnswer: 0,
          explanation: 'Lá cây dùng ánh nắng cùng với nước và khí các-bô-níc để làm ra thức ăn. Đó là lý do cây trong phòng tối lâu ngày sẽ héo.',
        },
        {
          question: 'Khi quang hợp, cây nhả ra khí gì có ích cho con người?',
          options: ['Khí ô-xi', 'Khói bụi', 'Khí ga', 'Hơi nóng'],
          correctAnswer: 0,
          explanation: 'Cây nhả ra khí ô-xi - chính là khí chúng ta hít thở. Vì thế trồng cây là việc rất tốt cho sức khoẻ cả nhà.',
        },
        {
          question: 'Mây trên trời được tạo ra từ đâu?',
          options: ['Từ khói của xe cộ', 'Từ hơi nước bốc lên rồi gặp lạnh tụ lại', 'Từ bông gòn bay lên', 'Từ bụi trên mặt đất'],
          correctAnswer: 1,
          explanation: 'Mặt trời làm nước bốc hơi lên cao, gặp không khí lạnh hơi nước tụ lại thành những hạt li ti - đó chính là đám mây.',
        },
        {
          question: 'Thứ tự đúng của vòng tuần hoàn nước là gì?',
          options: ['Mưa ➜ Bốc hơi ➜ Mây', 'Mây ➜ Bốc hơi ➜ Mưa', 'Bốc hơi ➜ Tạo mây ➜ Mưa rơi', 'Mưa ➜ Mây ➜ Bốc hơi'],
          correctAnswer: 2,
          explanation: 'Nước bốc hơi lên cao, tụ lại thành mây, rồi rơi xuống thành mưa, chảy ra sông biển và lại bốc hơi tiếp.',
        },
      ],
    },

    {
      id: 'kp_trai_dat',
      title: 'Trái Đất và bầu trời',
      subtitle: 'Ngày đêm, bốn mùa, Mặt Trăng',
      emoji: '🌍',
      stars: 6,
      subject: 'Khoa học',
      lesson: {
        title: 'Vì sao có ngày và đêm?',
        badge: '🌍 TRÁI ĐẤT',
        steps: [
          {
            title: 'Trái Đất quay nên có ngày và đêm',
            desc: 'Trái Đất hình khối cầu và tự quay quanh mình nó giống như con quay. Mặt Trời chỉ chiếu sáng được một nửa Trái Đất. Nửa đang hướng về Mặt Trời thì là ban ngày, nửa quay đi thì là ban đêm. Trái Đất quay hết một vòng mất khoảng 24 giờ, đó chính là một ngày một đêm của bé.',
            formula: 'Trái Đất tự quay 1 vòng = 24 giờ = 1 ngày đêm.',
            tip: 'Mặt Trời không hề "mọc" hay "lặn" - chính Trái Đất quay làm mình thấy như vậy thôi.',
          },
          {
            title: 'Bốn mùa và một năm',
            desc: 'Ngoài việc tự quay, Trái Đất còn đi vòng quanh Mặt Trời. Đi hết một vòng mất khoảng 365 ngày - đúng bằng một năm. Vì trục Trái Đất hơi nghiêng nên có lúc nơi bé ở nghiêng về phía Mặt Trời (nắng nhiều, mùa hè), có lúc nghiêng ra xa (mùa đông). Miền Bắc nước ta có đủ bốn mùa xuân - hạ - thu - đông, còn miền Nam chỉ có hai mùa mưa và khô.',
            formula: 'Trái Đất đi 1 vòng quanh Mặt Trời = 365 ngày = 1 năm.',
            tip: 'Cứ 4 năm lại có một năm 366 ngày gọi là năm nhuận, tháng 2 khi đó có 29 ngày.',
          },
          {
            title: 'Mặt Trăng và các vì sao',
            desc: 'Mặt Trăng là bạn đồng hành đi vòng quanh Trái Đất. Mặt Trăng không tự phát sáng, nó chỉ hắt lại ánh sáng Mặt Trời nên ta mới nhìn thấy. Tuỳ vị trí mà ta thấy trăng tròn, trăng khuyết hay trăng lưỡi liềm. Còn những ngôi sao lấp lánh ban đêm thực ra là những mặt trời khổng lồ khác, chỉ vì ở quá xa nên trông bé xíu.',
            formula: 'Mặt Trời tự phát sáng - Mặt Trăng chỉ phản chiếu ánh sáng Mặt Trời.',
            tip: 'Rằm Trung Thu là ngày 15 âm lịch, đúng lúc trăng tròn và sáng nhất trong tháng.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Vì sao trên Trái Đất có ngày và đêm?',
          options: ['Vì Mặt Trời tắt đi vào ban đêm', 'Vì Trái Đất tự quay, mỗi lúc chỉ một nửa được chiếu sáng', 'Vì mây che kín Mặt Trời', 'Vì Mặt Trăng chặn Mặt Trời lại'],
          correctAnswer: 1,
          explanation: 'Trái Đất tự quay như con quay, nửa hướng về Mặt Trời là ban ngày, nửa còn lại là ban đêm.',
        },
        {
          question: 'Trái Đất tự quay một vòng hết bao lâu?',
          options: ['1 giờ', '12 giờ', '24 giờ', '365 ngày'],
          correctAnswer: 2,
          explanation: 'Một vòng tự quay mất khoảng 24 giờ, đó chính là độ dài một ngày đêm.',
        },
        {
          question: 'Một năm có khoảng bao nhiêu ngày?',
          options: ['100 ngày', '365 ngày', '30 ngày', '1000 ngày'],
          correctAnswer: 1,
          explanation: 'Trái Đất đi hết một vòng quanh Mặt Trời mất khoảng 365 ngày, đó là một năm. Năm nhuận thì có 366 ngày.',
        },
        {
          question: 'Vì sao ban đêm ta nhìn thấy Mặt Trăng sáng?',
          options: ['Vì Mặt Trăng tự cháy sáng như lửa', 'Vì Mặt Trăng hắt lại ánh sáng của Mặt Trời', 'Vì có đèn trên Mặt Trăng', 'Vì các ngôi sao chiếu vào'],
          correctAnswer: 1,
          explanation: 'Mặt Trăng không tự phát sáng. Nó phản chiếu ánh sáng Mặt Trời chiếu vào, nên ta mới thấy nó sáng.',
        },
        {
          question: 'Những ngôi sao lấp lánh trên trời đêm thực ra là gì?',
          options: ['Những chiếc đèn treo trên trời', 'Những mặt trời khổng lồ ở rất xa', 'Những viên đá phát sáng', 'Những giọt nước phản chiếu'],
          correctAnswer: 1,
          explanation: 'Mỗi ngôi sao là một mặt trời khổng lồ tự phát sáng, chỉ vì ở quá xa nên ta thấy nó bé li ti.',
        },
      ],
    },

    {
      id: 'kp_an_toan',
      title: 'An toàn cho bé',
      subtitle: 'Giao thông, điện lửa, người lạ',
      emoji: '🚦',
      stars: 6,
      subject: 'Kỹ năng sống',
      lesson: {
        title: 'Những quy tắc giữ bé an toàn',
        badge: '🚦 AN TOÀN SỐNG',
        steps: [
          {
            title: 'An toàn khi ra đường',
            desc: 'Đèn đỏ dừng lại, đèn vàng chuẩn bị, đèn xanh mới được đi. Bé qua đường phải đi trên vạch kẻ trắng dành cho người đi bộ, nhìn trái rồi nhìn phải, và tốt nhất là nắm tay người lớn. Khi ngồi xe máy phải đội mũ bảo hiểm cài quai đúng cách, ngồi ô tô phải thắt dây an toàn. Tuyệt đối không chạy ra đường nhặt đồ hay đuổi theo quả bóng.',
            formula: 'Đèn ĐỎ: dừng · Đèn VÀNG: chậm lại, chuẩn bị · Đèn XANH: được đi.',
            tip: 'Xe đang chạy không thể dừng ngay lập tức được, nên bé phải nhường đường chứ đừng nghĩ xe sẽ tránh mình.',
          },
          {
            title: 'An toàn với điện, lửa và nước',
            desc: 'Không được chọc ngón tay hay vật kim loại vào ổ điện, không sờ vào dây điện bị hở, và không bao giờ dùng tay ướt cắm rút phích cắm. Không tự ý nghịch bật lửa, diêm hay bếp gas. Không đi bơi ở ao, hồ, sông một mình dù bé biết bơi - luôn phải có người lớn ở đó. Khi có cháy, bé cúi thấp người, lấy khăn ướt che mũi miệng và chạy ra ngoài, không nấp dưới gầm giường.',
            formula: 'Số khẩn cấp cần nhớ: 113 Công an · 114 Cứu hoả · 115 Cấp cứu.',
            tip: 'Khi cháy thì khói độc bay lên cao, vì thế bé cúi thấp người sẽ dễ thở hơn nhiều.',
          },
          {
            title: 'Khi gặp người lạ hoặc bị lạc',
            desc: 'Bé không đi theo, không nhận quà, không lên xe của người lạ dù họ nói là bạn của bố mẹ. Người lớn tử tế sẽ không nhờ một đứa trẻ đi tìm chó lạc hay xách đồ giúp. Nếu bị lạc ở siêu thị hay công viên, bé hãy đứng yên tại chỗ đó hoặc tìm chú bảo vệ, cô nhân viên mặc đồng phục, hoặc một người mẹ đang dắt con để nhờ giúp. Và bé cần thuộc lòng số điện thoại của bố mẹ.',
            formula: 'Quy tắc 3 KHÔNG với người lạ: không đi theo - không nhận quà - không mở cửa.',
            tip: 'Nếu bị ai đó kéo đi, bé hãy hét thật to "Đây không phải bố/mẹ cháu!" để mọi người xung quanh chú ý.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Khi đèn giao thông chuyển sang màu đỏ, bé phải làm gì?',
          options: ['Chạy thật nhanh qua đường', 'Dừng lại chờ', 'Đi bình thường', 'Nhắm mắt đi qua'],
          correctAnswer: 1,
          explanation: 'Đèn đỏ là dừng lại. Chỉ khi đèn xanh dành cho người đi bộ bật lên, bé mới bước lên vạch kẻ trắng để qua đường.',
        },
        {
          question: 'Số điện thoại gọi cứu hoả khi có cháy là số nào?',
          options: ['113', '114', '115', '116'],
          correctAnswer: 1,
          explanation: '114 là cứu hoả. Bé nhớ thêm: 113 gọi công an, 115 gọi xe cấp cứu.',
        },
        {
          question: 'Bé đang chơi thì có người lạ nói "Cô là bạn của mẹ cháu, lên xe cô chở về nhé". Bé nên làm gì?',
          options: ['Lên xe ngay cho nhanh', 'Từ chối, chạy đến chỗ đông người và gọi cho bố mẹ', 'Nhận quà rồi mới lên xe', 'Đi theo một đoạn xem sao'],
          correctAnswer: 1,
          explanation: 'Dù người lạ nói quen bố mẹ, bé vẫn tuyệt đối không lên xe. Hãy chạy tới chỗ đông người, nhờ người lớn đáng tin gọi cho bố mẹ để kiểm tra.',
        },
        {
          question: 'Khi trong nhà có cháy và nhiều khói, bé nên làm gì?',
          options: ['Nấp dưới gầm giường', 'Cúi thấp người, che mũi miệng bằng khăn ướt và chạy ra ngoài', 'Đứng thẳng chạy thật nhanh', 'Ở lại tìm đồ chơi yêu thích'],
          correctAnswer: 1,
          explanation: 'Khói độc bay lên cao nên cúi thấp sẽ dễ thở hơn. Khăn ướt che mũi miệng giúp lọc bớt khói. Tuyệt đối không nấp lại trong nhà.',
        },
        {
          question: 'Bé bị lạc bố mẹ trong siêu thị. Việc nên làm nhất là gì?',
          options: ['Chạy khắp nơi tìm bố mẹ', 'Đi ra ngoài đường tìm', 'Đứng yên tại chỗ hoặc nhờ chú bảo vệ, cô nhân viên giúp', 'Khóc và đi theo bất kỳ ai'],
          correctAnswer: 2,
          explanation: 'Chạy lung tung sẽ càng khó gặp nhau. Đứng yên hoặc nhờ nhân viên mặc đồng phục thông báo trên loa là cách nhanh và an toàn nhất.',
        },
      ],
    },

    {
      id: 'kp_viet_nam',
      title: 'Việt Nam quê hương em',
      subtitle: 'Ba miền, thủ đô và ngày lễ lớn',
      emoji: '🇻🇳',
      stars: 6,
      subject: 'Lịch sử - Địa lý',
      lesson: {
        title: 'Đất nước hình chữ S',
        badge: '🇻🇳 QUÊ HƯƠNG',
        steps: [
          {
            title: 'Hình dáng đất nước và ba miền',
            desc: 'Trên bản đồ, nước ta có hình chữ S chạy dài từ Bắc xuống Nam, phía Đông giáp Biển Đông. Đất nước chia thành ba miền: miền Bắc có Hà Nội và vịnh Hạ Long, miền Trung có Huế, Đà Nẵng, Hội An với nhiều bãi biển đẹp, miền Nam có Thành phố Hồ Chí Minh và đồng bằng sông Cửu Long nhiều sông nước, trái cây.',
            formula: 'Thủ đô của Việt Nam là Hà Nội. Quốc kỳ là lá cờ đỏ sao vàng năm cánh.',
            tip: 'Đỉnh núi cao nhất nước ta là Fansipan ở Lào Cai, cao hơn 3.000 mét, được gọi là "nóc nhà Đông Dương".',
          },
          {
            title: 'Những mốc lịch sử bé nên nhớ',
            desc: 'Các Vua Hùng là người dựng nên nước Văn Lang - nhà nước đầu tiên của dân tộc, nên nhân dân lấy ngày mùng 10 tháng 3 âm lịch làm Giỗ Tổ Hùng Vương. Hai Bà Trưng đã đứng lên chống quân xâm lược phương Bắc. Năm 938, Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng bằng trận địa cọc gỗ, mở ra thời kỳ độc lập lâu dài cho đất nước.',
            formula: 'Ngày 2 tháng 9 năm 1945: Bác Hồ đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam mới.',
            tip: 'Ngày 30 tháng 4 là ngày đất nước thống nhất, Bắc - Nam về chung một nhà.',
          },
          {
            title: 'Nét đẹp văn hoá Việt',
            desc: 'Tết Nguyên Đán là ngày lễ lớn nhất, cả nhà sum họp, gói bánh chưng bánh tét và trẻ con được mừng tuổi. Tết Trung Thu vào rằm tháng Tám có đèn ông sao, múa lân và bánh nướng bánh dẻo. Áo dài là trang phục truyền thống, nón lá che nắng che mưa. Người Việt trọng lễ phép: gặp người lớn thì khoanh tay chào, đi thưa về gửi.',
            formula: 'Việt Nam có 54 dân tộc anh em cùng chung sống, đông nhất là dân tộc Kinh.',
            tip: 'Phở, bánh mì, áo dài và nón lá là những thứ bạn bè khắp thế giới nhắc đến khi nói về Việt Nam.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Thủ đô của nước Việt Nam là thành phố nào?',
          options: ['Thành phố Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Huế'],
          correctAnswer: 1,
          explanation: 'Hà Nội là thủ đô của Việt Nam, nơi có Hồ Gươm, Văn Miếu và Lăng Bác.',
        },
        {
          question: 'Trên bản đồ, đất nước Việt Nam có hình gì?',
          options: ['Hình tròn', 'Hình chữ S', 'Hình vuông', 'Hình tam giác'],
          correctAnswer: 1,
          explanation: 'Việt Nam có hình chữ S chạy dài từ Bắc xuống Nam, phía Đông giáp Biển Đông.',
        },
        {
          question: 'Năm 938, ai đã đánh tan quân Nam Hán trên sông Bạch Đằng?',
          options: ['Hai Bà Trưng', 'Ngô Quyền', 'Lý Thường Kiệt', 'Quang Trung'],
          correctAnswer: 1,
          explanation: 'Ngô Quyền dùng mưu cắm cọc gỗ dưới lòng sông Bạch Đằng, đánh tan quân Nam Hán năm 938, mở ra thời kỳ độc lập cho nước ta.',
        },
        {
          question: 'Ngày 2 tháng 9 năm 1945 là ngày gì của dân tộc ta?',
          options: ['Ngày Giỗ Tổ Hùng Vương', 'Ngày Quốc khánh - Bác Hồ đọc Tuyên ngôn Độc lập', 'Ngày Tết Trung Thu', 'Ngày khai giảng'],
          correctAnswer: 1,
          explanation: 'Ngày 2/9/1945 tại Quảng trường Ba Đình, Bác Hồ đọc Tuyên ngôn Độc lập, khai sinh nước Việt Nam Dân chủ Cộng hoà. Đó là ngày Quốc khánh.',
        },
        {
          question: 'Việt Nam có bao nhiêu dân tộc anh em cùng chung sống?',
          options: ['10 dân tộc', '25 dân tộc', '54 dân tộc', '100 dân tộc'],
          correctAnswer: 2,
          explanation: 'Nước ta có 54 dân tộc anh em, đông nhất là dân tộc Kinh. Mỗi dân tộc có trang phục và phong tục riêng rất đẹp.',
        },
      ],
    },
  ],

  // ===================== TRUNG HỌC (lớp 6+) =====================
  teens: [
    {
      id: 'kp_khoa_hoc_ds',
      title: 'Khoa học đời sống',
      subtitle: 'Điện, phản ứng hoá học và dinh dưỡng',
      emoji: '⚗️',
      stars: 8,
      subject: 'Khoa học',
      lesson: {
        title: 'Khoa học ngay trong nhà mình',
        badge: '⚗️ KHOA HỌC ỨNG DỤNG',
        steps: [
          {
            title: 'Điện trong nhà và hoá đơn tiền điện',
            desc: 'Mỗi thiết bị điện có một công suất đo bằng oát (W). Điện năng tiêu thụ tính bằng ki-lô-oát giờ (kWh), chính là "số điện" trên hoá đơn. Một điều hoà 1.000 W chạy 8 tiếng mỗi đêm sẽ tốn 8 kWh, cả tháng là 240 kWh - thường chiếm phần lớn hoá đơn của gia đình. Đèn LED 10 W sáng bằng đèn sợi đốt 60 W nhưng tốn điện ít hơn 6 lần.',
            formula: 'Điện năng (kWh) = Công suất (kW) × Thời gian (giờ)',
            tip: 'Thiết bị ở chế độ chờ (đèn đỏ nhấp nháy) vẫn ăn điện. Rút phích khi không dùng là tiết kiệm thật chứ không phải mẹo vặt.',
          },
          {
            title: 'Phản ứng hoá học quanh ta',
            desc: 'Sắt để ngoài trời gặp ô-xi và hơi nước sẽ gỉ - đó là phản ứng ô-xi hoá. Cho giấm (a-xít) vào bột nở (ba-zơ) thấy sủi bọt vì sinh ra khí các-bô-níc, cũng chính là thứ làm bánh nở xốp. Cắt quả táo để ngoài không khí bị thâm cũng là ô-xi hoá, vắt chanh vào sẽ chậm lại vì vi-ta-min C chống ô-xi hoá. Hiểu điều này giúp con phân biệt kiến thức thật với quảng cáo thổi phồng.',
            formula: 'pH < 7: a-xít (chanh, giấm) · pH = 7: trung tính (nước) · pH > 7: ba-zơ (xà phòng, nước tro).',
            tip: 'Tuyệt đối không trộn chung nước tẩy Javel với các chất tẩy rửa chứa a-xít: phản ứng sinh khí clo rất độc.',
          },
          {
            title: 'Dinh dưỡng và năng lượng cơ thể',
            desc: 'Thức ăn cung cấp năng lượng đo bằng ca-lo. Tinh bột (cơm, bánh mì) là nhiên liệu chính, chất đạm (thịt, cá, trứng, đậu) xây dựng cơ bắp, chất béo dự trữ năng lượng, còn vi-ta-min và khoáng chất giúp cơ thể vận hành trơn tru. Nước ngọt có ga chứa rất nhiều đường nhưng gần như không có dưỡng chất nào - người ta gọi đó là "ca-lo rỗng". Tuổi dậy thì cần nhiều đạm và can-xi hơn bình thường vì cơ thể đang lớn nhanh.',
            formula: 'Một lon nước ngọt 330 ml chứa khoảng 35 g đường - tương đương 8-9 thìa cà phê đường.',
            tip: 'Đọc bảng thành phần dinh dưỡng trên bao bì là kỹ năng thật sự hữu ích: nhìn cột "đường" và "natri" trước tiên.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Một máy điều hoà công suất 1.000 W chạy 8 giờ mỗi ngày. Trong 30 ngày nó tiêu thụ bao nhiêu kWh?',
          options: ['24 kWh', '80 kWh', '240 kWh', '2.400 kWh'],
          correctAnswer: 2,
          explanation: '1.000 W = 1 kW. Mỗi ngày: 1 kW × 8 giờ = 8 kWh. Cả tháng: 8 × 30 = 240 kWh.',
        },
        {
          question: 'Vì sao thanh sắt để ngoài trời lâu ngày bị gỉ?',
          options: ['Vì bị ánh nắng làm nóng chảy', 'Vì phản ứng ô-xi hoá với ô-xi và hơi nước', 'Vì bị vi khuẩn ăn mòn', 'Vì kim loại tự phân huỷ theo thời gian'],
          correctAnswer: 1,
          explanation: 'Gỉ sét là sản phẩm của phản ứng ô-xi hoá giữa sắt với ô-xi và hơi nước trong không khí. Sơn phủ bề mặt giúp ngăn phản ứng này.',
        },
        {
          question: 'Dung dịch nào sau đây có tính a-xít (pH nhỏ hơn 7)?',
          options: ['Nước cất', 'Nước xà phòng', 'Nước cốt chanh', 'Nước vôi trong'],
          correctAnswer: 2,
          explanation: 'Nước cốt chanh chứa a-xít citric nên pH khoảng 2-3. Xà phòng và nước vôi có tính ba-zơ (pH > 7), nước cất trung tính pH = 7.',
        },
        {
          question: 'Chất dinh dưỡng nào đóng vai trò chính trong việc xây dựng cơ bắp?',
          options: ['Chất đạm (protein)', 'Chất béo', 'Đường tinh luyện', 'Nước'],
          correctAnswer: 0,
          explanation: 'Chất đạm từ thịt, cá, trứng, sữa, đậu là nguyên liệu xây dựng cơ bắp và mô. Ở tuổi dậy thì nhu cầu đạm và can-xi tăng rõ rệt.',
        },
        {
          question: '"Ca-lo rỗng" trong nước ngọt có ga nghĩa là gì?',
          options: ['Nước ngọt không chứa ca-lo nào', 'Cung cấp nhiều năng lượng nhưng hầu như không có dưỡng chất', 'Ca-lo bị bay hơi khi mở nắp', 'Uống vào không tăng cân'],
          correctAnswer: 1,
          explanation: 'Nước ngọt cho rất nhiều năng lượng từ đường nhưng gần như không có vi-ta-min, khoáng chất hay chất xơ - nên gọi là ca-lo rỗng.',
        },
      ],
    },

    {
      id: 'kp_lich_su_vn',
      title: 'Dấu mốc lịch sử Việt Nam',
      subtitle: 'Từ dựng nước tới thời Đổi mới',
      emoji: '🏯',
      stars: 8,
      subject: 'Lịch sử',
      lesson: {
        title: 'Dòng chảy hơn hai nghìn năm',
        badge: '🏯 LỊCH SỬ DÂN TỘC',
        steps: [
          {
            title: 'Dựng nước và một nghìn năm giữ tiếng nói',
            desc: 'Nhà nước Văn Lang của các Vua Hùng là nhà nước đầu tiên, sau đó là Âu Lạc của An Dương Vương với thành Cổ Loa. Từ năm 179 trước Công nguyên, nước ta rơi vào hơn một nghìn năm Bắc thuộc. Trong suốt thời gian đó, các cuộc khởi nghĩa của Hai Bà Trưng, Bà Triệu, Lý Bí, Mai Thúc Loan nối nhau nổ ra. Điều đáng kinh ngạc là dù bị đô hộ rất lâu, người Việt vẫn giữ được tiếng nói và phong tục riêng.',
            formula: 'Năm 938: Ngô Quyền chiến thắng Bạch Đằng, chấm dứt hơn 1.000 năm Bắc thuộc.',
            tip: 'Trận Bạch Đằng thắng nhờ hiểu quy luật thuỷ triều - một minh chứng rằng kiến thức tự nhiên có thể quyết định vận mệnh dân tộc.',
          },
          {
            title: 'Các triều đại tự chủ',
            desc: 'Sau Ngô Quyền, nước ta bước vào thời kỳ độc lập với các triều Đinh, Tiền Lê, Lý, Trần, Hồ, Lê, Nguyễn. Nhà Lý dời đô về Thăng Long năm 1010 và lập Văn Miếu - trường đại học đầu tiên. Nhà Trần ba lần đánh bại quân Nguyên Mông - đội quân từng chinh phục gần hết châu Á. Lê Lợi kháng chiến mười năm chống quân Minh. Quang Trung đại phá quân Thanh trong dịp Tết Kỷ Dậu 1789 bằng cuộc hành quân thần tốc.',
            formula: 'Năm 1010: Lý Thái Tổ dời đô từ Hoa Lư ra Thăng Long - Hà Nội ngày nay.',
            tip: '"Nam quốc sơn hà" của Lý Thường Kiệt được xem là bản tuyên ngôn độc lập đầu tiên của dân tộc.',
          },
          {
            title: 'Thời hiện đại: 1945 - 1975 - Đổi mới',
            desc: 'Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hoà. Chiến thắng Điện Biên Phủ năm 1954 kết thúc chiến tranh chống Pháp. Ngày 30/4/1975, đất nước thống nhất. Từ năm 1986, công cuộc Đổi mới chuyển nền kinh tế sang cơ chế thị trường, đưa Việt Nam từ nước thiếu lương thực thành một trong những nước xuất khẩu gạo hàng đầu thế giới.',
            formula: '1945 độc lập · 1954 Điện Biên Phủ · 1975 thống nhất · 1986 Đổi mới.',
            tip: 'Nhớ lịch sử theo mốc thời gian và nguyên nhân - kết quả sẽ dễ hơn nhiều so với học thuộc từng sự kiện rời rạc.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Sự kiện năm 938 trên sông Bạch Đằng có ý nghĩa gì?',
          options: ['Mở đầu thời kỳ Bắc thuộc', 'Chấm dứt hơn một nghìn năm Bắc thuộc, mở ra thời kỳ độc lập', 'Thống nhất đất nước sau chia cắt', 'Dời đô về Thăng Long'],
          correctAnswer: 1,
          explanation: 'Chiến thắng Bạch Đằng của Ngô Quyền năm 938 kết thúc hơn 1.000 năm Bắc thuộc và mở ra kỷ nguyên độc lập tự chủ lâu dài.',
        },
        {
          question: 'Năm 1010, vua Lý Thái Tổ dời đô từ Hoa Lư về đâu?',
          options: ['Phú Xuân (Huế)', 'Thăng Long (Hà Nội)', 'Cổ Loa', 'Gia Định'],
          correctAnswer: 1,
          explanation: 'Lý Thái Tổ dời đô ra Thăng Long năm 1010 và viết "Chiếu dời đô" giải thích lý do chọn vùng đất trung tâm, thuận lợi lâu dài này.',
        },
        {
          question: 'Triều đại nào đã ba lần đánh bại quân xâm lược Nguyên Mông?',
          options: ['Nhà Lý', 'Nhà Trần', 'Nhà Lê', 'Nhà Nguyễn'],
          correctAnswer: 1,
          explanation: 'Nhà Trần với Trần Hưng Đạo đã ba lần đánh bại quân Nguyên Mông trong thế kỷ 13, dù đó là đội quân mạnh nhất thế giới thời bấy giờ.',
        },
        {
          question: 'Chiến thắng Điện Biên Phủ diễn ra vào năm nào?',
          options: ['1945', '1954', '1968', '1975'],
          correctAnswer: 1,
          explanation: 'Chiến thắng Điện Biên Phủ năm 1954 kết thúc cuộc kháng chiến chống Pháp, dẫn tới Hiệp định Genève.',
        },
        {
          question: 'Công cuộc Đổi mới bắt đầu từ năm 1986 đã thay đổi điều gì lớn nhất?',
          options: ['Chuyển nền kinh tế sang cơ chế thị trường, mở cửa hội nhập', 'Đổi tên đất nước', 'Dời thủ đô về phía Nam', 'Bắt đầu chiến tranh biên giới'],
          correctAnswer: 0,
          explanation: 'Đổi mới 1986 chuyển từ kinh tế bao cấp sang cơ chế thị trường và mở cửa, giúp Việt Nam từ nước thiếu lương thực trở thành nước xuất khẩu gạo lớn.',
        },
      ],
    },

    {
      id: 'kp_dia_ly_mt',
      title: 'Địa lý & môi trường',
      subtitle: 'Khí hậu, sông ngòi và biến đổi khí hậu',
      emoji: '🌏',
      stars: 8,
      subject: 'Địa lý',
      lesson: {
        title: 'Đất nước và những thách thức môi trường',
        badge: '🌏 ĐỊA LÝ - MÔI TRƯỜNG',
        steps: [
          {
            title: 'Khí hậu và địa hình Việt Nam',
            desc: 'Việt Nam nằm trong vùng khí hậu nhiệt đới gió mùa, nóng ẩm và mưa nhiều. Miền Bắc có bốn mùa rõ rệt với mùa đông lạnh, miền Nam chỉ có hai mùa mưa - khô. Ba phần tư diện tích là đồi núi, nhưng phần lớn dân cư lại tập trung ở hai đồng bằng châu thổ. Đường bờ biển dài hơn 3.200 km mang lại nguồn lợi lớn nhưng cũng khiến nước ta hứng nhiều bão mỗi năm.',
            formula: 'Đồng bằng sông Hồng do sông Hồng bồi đắp · Đồng bằng sông Cửu Long do sông Mê Kông bồi đắp.',
            tip: 'Đồng bằng sông Cửu Long là vựa lúa và vựa trái cây lớn nhất cả nước, đóng góp phần lớn lượng gạo xuất khẩu.',
          },
          {
            title: 'Biến đổi khí hậu và tác động thật',
            desc: 'Khi con người đốt than, dầu, khí đốt, lượng khí CO2 trong khí quyển tăng lên và giữ nhiệt lại giống như một tấm chăn - đó là hiệu ứng nhà kính. Trái Đất nóng lên làm băng tan, mực nước biển dâng. Với Việt Nam, hệ quả cụ thể là xâm nhập mặn ở đồng bằng sông Cửu Long, bão mạnh hơn và bất thường hơn, hạn hán kéo dài ở miền Trung. Đây không phải chuyện xa xôi mà đang ảnh hưởng trực tiếp tới mùa màng của nông dân nước ta.',
            formula: 'Hiệu ứng nhà kính: khí CO2 giữ nhiệt lại trong khí quyển, làm nhiệt độ trung bình Trái Đất tăng lên.',
            tip: 'Đồng bằng sông Cửu Long rất thấp so với mực nước biển, nên chỉ cần nước biển dâng thêm ít cũng gây thiệt hại lớn.',
          },
          {
            title: 'Rác thải và điều một học sinh làm được',
            desc: 'Một chiếc túi ni lông dùng vài phút nhưng cần hàng trăm năm để phân huỷ. Rác nhựa trôi ra biển vỡ thành hạt vi nhựa, cá ăn phải rồi quay lại bàn ăn của chính chúng ta. Phân loại rác tại nhà, mang bình nước cá nhân, từ chối ống hút nhựa, tắt thiết bị khi không dùng - những việc nhỏ này chỉ thật sự có ý nghĩa khi được làm đều đặn và lan ra nhiều người, chứ không phải làm một lần cho có.',
            formula: 'Nguyên tắc 3R: Reduce (giảm dùng) - Reuse (dùng lại) - Recycle (tái chế). Quan trọng nhất là Reduce.',
            tip: 'Giảm dùng ngay từ đầu luôn hiệu quả hơn tái chế, vì tái chế cũng tốn năng lượng và nước.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Việt Nam thuộc kiểu khí hậu nào?',
          options: ['Ôn đới lục địa', 'Nhiệt đới gió mùa', 'Hàn đới', 'Hoang mạc khô hạn'],
          correctAnswer: 1,
          explanation: 'Việt Nam có khí hậu nhiệt đới gió mùa: nóng ẩm, mưa nhiều, chia thành mùa mưa và mùa khô rõ rệt ở phía Nam.',
        },
        {
          question: 'Đồng bằng sông Cửu Long được bồi đắp bởi con sông nào?',
          options: ['Sông Hồng', 'Sông Mê Kông', 'Sông Đà', 'Sông Mã'],
          correctAnswer: 1,
          explanation: 'Sông Mê Kông chảy qua nhiều nước rồi đổ ra biển qua các cửa sông ở miền Tây, bồi đắp nên đồng bằng sông Cửu Long màu mỡ.',
        },
        {
          question: 'Nguyên nhân chính gây hiệu ứng nhà kính làm Trái Đất nóng lên là gì?',
          options: ['Khí CO2 và các khí nhà kính tăng do đốt nhiên liệu hoá thạch', 'Mặt Trời tiến lại gần Trái Đất', 'Núi lửa phun trào liên tục', 'Dân số tăng làm nhiệt cơ thể toả ra nhiều'],
          correctAnswer: 0,
          explanation: 'Đốt than, dầu, khí đốt thải ra CO2. Lượng khí này tích tụ trong khí quyển giữ nhiệt lại như một tấm chăn, khiến nhiệt độ trung bình tăng.',
        },
        {
          question: 'Hậu quả rõ rệt nhất của nước biển dâng đối với đồng bằng sông Cửu Long là gì?',
          options: ['Mùa đông trở nên lạnh hơn', 'Xâm nhập mặn làm đất trồng lúa bị nhiễm mặn', 'Núi cao thêm', 'Sông cạn hoàn toàn'],
          correctAnswer: 1,
          explanation: 'Nước biển dâng đẩy nước mặn vào sâu trong đất liền, làm đất và nước ngọt bị nhiễm mặn, ảnh hưởng trực tiếp tới trồng lúa và cây ăn trái.',
        },
        {
          question: 'Trong nguyên tắc 3R, chữ R nào mang lại hiệu quả lớn nhất cho môi trường?',
          options: ['Reduce - giảm dùng ngay từ đầu', 'Reuse - dùng lại', 'Recycle - tái chế', 'Cả ba đều như nhau'],
          correctAnswer: 0,
          explanation: 'Reduce hiệu quả nhất vì thứ không được sản xuất ra thì không tốn tài nguyên, không tốn năng lượng và không thành rác. Tái chế vẫn tiêu tốn nước và điện.',
        },
      ],
    },

    {
      id: 'kp_an_toan_so',
      title: 'An toàn số & tư duy phản biện',
      subtitle: 'Tin giả, lừa đảo mạng và dấu chân số',
      emoji: '🛡️',
      stars: 8,
      subject: 'Kỹ năng sống',
      lesson: {
        title: 'Tự bảo vệ mình trên mạng',
        badge: '🛡️ AN TOÀN SỐ',
        steps: [
          {
            title: 'Nhận diện lừa đảo trực tuyến',
            desc: 'Hầu hết chiêu lừa trên mạng đều dựa vào hai thứ: lòng tham và sự gấp gáp. "Trúng thưởng iPhone, nhấn vào link để nhận", "Tài khoản sẽ bị khoá trong 24 giờ, xác minh ngay", "Việc nhẹ lương cao, chỉ cần nạp phí ban đầu" - tất cả đều ép nạn nhân hành động trước khi kịp suy nghĩ. Một nguyên tắc đơn giản: không ai cho không ai thứ gì, và tổ chức uy tín không bao giờ hỏi mật khẩu hay mã OTP của con.',
            formula: 'Mã OTP là chìa khoá cuối cùng của tài khoản. KHÔNG đọc cho bất kỳ ai, kể cả người tự xưng là nhân viên ngân hàng hay công an.',
            tip: 'Càng bị giục "nhanh lên, sắp hết hạn" thì càng phải dừng lại và kiểm tra. Sự gấp gáp là dấu hiệu cảnh báo, không phải cơ hội.',
          },
          {
            title: 'Tin giả và cách kiểm chứng',
            desc: 'Tin giả thường có tiêu đề giật gân, dùng nhiều chữ in hoa và dấu chấm than, không ghi rõ nguồn hoặc dẫn nguồn mơ hồ kiểu "theo các nhà khoa học". Ảnh trong tin giả nhiều khi là ảnh cũ được lấy lại từ sự kiện khác. Trước khi tin hay chia sẻ, con hãy hỏi: Ai đăng? Đăng khi nào? Có báo chính thống nào đưa cùng tin này không? Ảnh này có thật của sự việc này không? Chia sẻ tin sai cũng khiến con trở thành một mắt xích của tin giả, dù con không cố ý.',
            formula: 'Kiểm chứng theo 3 câu hỏi: NGUỒN ở đâu? BẰNG CHỨNG là gì? Có nguồn ĐỘC LẬP nào xác nhận không?',
            tip: 'Nội dung càng làm con tức giận hoặc phấn khích mạnh thì càng nên kiểm chứng - cảm xúc mạnh chính là công cụ để tin giả lan nhanh.',
          },
          {
            title: 'Dấu chân số và bảo mật tài khoản',
            desc: 'Mọi thứ con đăng lên mạng đều để lại dấu vết, và người khác có thể chụp màn hình lại dù con đã xoá. Vài năm sau, nhà tuyển dụng hay trường học vẫn có thể tìm thấy. Vì vậy đừng đăng địa chỉ nhà, số điện thoại, ảnh thẻ học sinh hay lịch sinh hoạt hằng ngày. Về tài khoản: mỗi nơi một mật khẩu khác nhau, đặt dài trên 12 ký tự, bật xác thực hai lớp. Nếu bị bắt nạt trên mạng, con hãy chụp màn hình làm bằng chứng, chặn người đó và nói với bố mẹ - im lặng chỉ khiến người bắt nạt tiếp tục.',
            formula: 'Nguyên tắc kiểm tra trước khi đăng: nếu không muốn bố mẹ, thầy cô hoặc nhà tuyển dụng 5 năm sau nhìn thấy thì đừng đăng.',
            tip: 'Mật khẩu mạnh không cần khó nhớ: ghép 4 từ ngẫu nhiên không liên quan thành một câu vô nghĩa là đủ dài và đủ khó đoán.',
          },
        ],
      },
      quizzes: [
        {
          question: 'Có người tự xưng là nhân viên ngân hàng gọi điện và hỏi mã OTP vừa gửi vào máy con. Con nên làm gì?',
          options: ['Đọc mã cho họ vì họ là nhân viên ngân hàng', 'Từ chối tuyệt đối và cúp máy, vì không tổ chức uy tín nào hỏi mã OTP', 'Đọc một nửa mã thôi', 'Nhắn mã qua tin nhắn cho an toàn hơn'],
          correctAnswer: 1,
          explanation: 'Không một ngân hàng, công ty hay cơ quan nào yêu cầu con cung cấp mã OTP. Ai hỏi OTP thì gần như chắc chắn là kẻ lừa đảo.',
        },
        {
          question: 'Dấu hiệu nào sau đây đáng nghi nhất trong một tin nhắn lừa đảo?',
          options: ['Tin nhắn viết đúng chính tả', 'Thúc giục hành động gấp kèm phần thưởng lớn bất thường', 'Tin nhắn có kèm hình ảnh', 'Tin nhắn gửi vào buổi sáng'],
          correctAnswer: 1,
          explanation: 'Lừa đảo luôn kết hợp lòng tham (phần thưởng lớn) và sự gấp gáp (hạn 24 giờ) để nạn nhân hành động trước khi kịp suy nghĩ.',
        },
        {
          question: 'Cách kiểm chứng một tin tức gây sốc trên mạng xã hội tốt nhất là gì?',
          options: ['Xem có nhiều lượt chia sẻ không', 'Kiểm tra nguồn gốc và xem báo chính thống độc lập có đưa tin không', 'Đọc phần bình luận xem mọi người nói gì', 'Tin nếu có kèm ảnh minh hoạ'],
          correctAnswer: 1,
          explanation: 'Lượt chia sẻ, bình luận hay ảnh đều có thể bị làm giả. Chỉ có việc truy nguồn gốc và đối chiếu với nguồn độc lập uy tín mới đáng tin.',
        },
        {
          question: '"Dấu chân số" (digital footprint) nghĩa là gì?',
          options: ['Dấu vân tay dùng để mở khoá điện thoại', 'Toàn bộ dấu vết con để lại trên mạng, có thể tồn tại rất lâu kể cả khi đã xoá', 'Số bước chân đồng hồ thông minh đếm được', 'Biểu tượng bàn chân trong game'],
          correctAnswer: 1,
          explanation: 'Dấu chân số là mọi bài đăng, bình luận, ảnh con để lại trên mạng. Người khác có thể lưu lại, nên nó có thể theo con nhiều năm sau.',
        },
        {
          question: 'Cách đặt mật khẩu nào an toàn nhất?',
          options: ['Dùng chung một mật khẩu dễ nhớ cho mọi tài khoản', 'Lấy ngày sinh của mình', 'Ghép 4 từ ngẫu nhiên thành mật khẩu dài, mỗi tài khoản một mật khẩu riêng', 'Dùng dãy 123456 nhưng thêm dấu chấm than'],
          correctAnswer: 2,
          explanation: 'Mật khẩu dài và ngẫu nhiên rất khó dò. Quan trọng không kém là mỗi tài khoản một mật khẩu riêng, để một nơi bị lộ không kéo theo tất cả.',
        },
      ],
    },
  ],
}
