export interface SubTeam {
  title: string;
  desc: string;
  reqHeader?: string;
  requirements?: string[];
}

export interface HouseSection {
  title: string;
  items: string[];
}

export interface HouseData {
  id: string;
  houseName: string;
  title: string;
  fullTitle: string;
  color: string;
  glowColor: string;
  bgGlow: string;
  icon: string;
  intro: string;
  paragraphs?: string[];
  sections?: HouseSection[];
  subHeader?: string;
  subTeams?: SubTeam[];
}

export const HOUSES_DATA: HouseData[] = [
  {
    id: "hoc-tap-nckh",
    houseName: "Ravenclaw",
    title: "Học tập & NCKH",
    fullTitle: "Mảng Học tập và Nghiên cứu khoa học - Ravenclaw",
    color: "#38bdf8",
    glowColor: "rgba(56, 189, 248, 0.4)",
    bgGlow: "rgba(56, 189, 248, 0.12)",
    icon: "🧪",
    intro: "chứa đầy sự nhiệt huyết, sôi nổi của Liên chi, có sứ mệnh hỗ trợ sinh viên trong học tập các môn Đại cương, chuyên ngành và kỹ năng học thuật.",
    paragraphs: [
      "📖 Nhắc đến Học tập và NCKH, người ta nhớ ngay đến các lớp hỗ trợ Đại cương cho sinh viên năm nhất, lớp kỹ năng LaTeX Basics hay là Góc học tập FaMI với gần 40K thành viên tham gia, nơi mọi người cùng nhau trao đổi các kiến thức, tài liệu và kinh nghiệm học tập trên đại học. Ngoài ra họ còn thường xuyên cung cấp tài liệu cũng như kho đề thi đa dạng trong những kì thi thử, giúp các bạn tự tin hơn trước những kì thi khó nhằn của khoa.",
      "🌟 Một bản giao hưởng tích cực, nơi tạo ra động lực học cho tất cả mọi người. Khi hòa chung vào nhịp đập ấy, mọi người sẽ được rèn luyện những kỹ năng thuyết trình, làm việc nhóm vô cùng hiệu quả, được tiếp cận với những công cụ học tập hiện đại, được giao lưu, học hỏi với những bộ óc thiên tài của Liên chi nữa đó. Dù có rất nhiều hoạt động như vậy, nhưng mảng học tập luôn biết cách sắp xếp timeline hợp lý, rõ ràng, như một yếu tố giúp bạn phát triển kỹ năng quản lý thời gian hiệu quả, không lo bị dí “deadline”."
    ]
  },
  {
    id: "to-chuc-kiem-tra",
    houseName: "Gryffindor",
    title: "Tổ chức - Kiểm tra",
    fullTitle: "Mảng Tổ chức kiểm tra - Gryffindor",
    color: "#ef4444",
    glowColor: "rgba(239, 68, 68, 0.45)",
    bgGlow: "rgba(239, 68, 68, 0.15)",
    icon: "⚖️",
    intro: "vừa mạnh mẽ, lại vừa kỷ luật nữa, cùng mình lắng nghe sự đồng điệu của những tâm hồn ấy nhé..",
    sections: [
      {
        title: "📌 Về công tác Đoàn – Hội và phát triển Đảng:",
        items: [
          "📍 Đánh giá thi đua khen thưởng, xếp loại Chi đoàn, xếp loại Đoàn viên. Tổng hợp hoạt động để đánh giá rèn luyện.",
          "📍 Tổ chức các buổi họp thường kỳ, Đại hội, Hội nghị kiện toàn Ban Chấp hành LCĐ - LCH. Truyền đạt công văn, thông báo từ Đoàn Thanh niên - HSV Trường tới Ban Cán sự lớp.",
          "📍 Hỗ trợ sinh viên của Khoa trong việc xét duyệt kết nạp Đảng cho đối tượng Đảng và chuyển Đảng chính thức cho Đảng viên dự bị.",
          "📍 Thường trực giải đáp thắc mắc, hướng dẫn và kiểm tra, giám sát các Chi đoàn trong công tác đoàn vụ và công tác tổ chức Đại hội.",
          "📍 Tổ chức bầu ban cán sự lớp đối với các sinh viên đầu khóa."
        ]
      },
      {
        title: "📌 Về công tác tổ chức nội bộ trong LCĐ - LCH:",
        items: [
          "📍 Tham mưu cho Bí thư, Ban Thường vụ và Ban Chấp hành về công tác nhân sự, quy hoạch cán bộ.",
          "📍 Kiểm tra, góp ý, chỉnh sửa các đề án hoạt động từ các mảng khác để đảm bảo đúng tiến độ, đóng vai trò như một người tổng duyệt chương trình."
        ]
      }
    ]
  },
  {
    id: "tuyen-truyen-doi-ngoai",
    houseName: "Slytherin",
    title: "TT-TT & Đối ngoại",
    fullTitle: "Mảng Thông tin tuyên truyền và đối ngoại - Slytherin",
    color: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.4)",
    bgGlow: "rgba(16, 185, 129, 0.12)",
    icon: "📜",
    intro: "nơi truyền tải thông điệp, hoạt động đến gần hơn với sinh viên trong và ngoài Khoa. Các thành viên Truyền thông luôn có mặt tại tất cả các sự kiện để sẵn sàng đưa những tin tức nóng hổi, đồng thời là tác giả của các ấn phẩm và bài viết trên kênh truyền thông của Liên chi.",
    paragraphs: [
      "🔊 Hầu như tất cả các bản nhạc của Liên chi đều có sự giao hưởng giai điệu, nhịp đập của Truyền Thông ở trong đó, vì đơn giản “Ở đâu khó, có Truyền Thông”. Sự năng nổ ấy thể hiện qua vô vàn sự kiện như hỗ trợ chào tân, tổ chức tuyển thành viên, cuộc thi Hồ Chí Minh 1 cuộc đời 1 dân tộc, làm MC cho các sự kiện nội bộ của Khoa."
    ],
    subHeader: "🚀 2 tiểu ban - 2 nhịp đập song song, 2 cá tính khác nhau cùng nhau tạo nên những giai điệu đầy cảm xúc.",
    subTeams: [
      {
        title: "✍️ Tiểu ban Content",
        desc: "Sân chơi của những “anh hùng bàn phím”, những cây viết “nghìn năm văn vở” với nhiệm vụ là lên ý tưởng, viết bài, và xây dựng các chiến dịch truyền thông, giới thiệu sự kiện, và tổng kết hoạt động. Ngoài ra, do tính chất công việc nên Content team rất hay có bài viết cho các sự kiện quan trọng của Khoa, và đương nhiên là có nhuận bút rồiiiii.",
        reqHeader: "✨ Tự tin hòa chung nhịp đập với team Content nếu bạn có những yếu tố sau:",
        requirements: [
          "👉 Tư duy sáng tạo, khả năng viết lách tốt, cẩn thận trong câu chữ.",
          "👉 Biết bắt trend, yêu thích các hoạt động xã hội.",
          "👉 Có kinh nghiệm tham gia viết bài, làm nội dung.",
          "👉 Có khả năng thuyết trình, làm MC là một điểm cộng."
        ]
      },
      {
        title: "📷 Tiểu ban Design",
        desc: "Nếu như bên kia là bản giao hưởng tạo nên từ những đôi bàn tay khéo léo, thì Design team chính là giai điệu kết tinh từ những đôi mắt thẩm mỹ đầy tính nghệ thuật. Nhiệm vụ của họ là thiết kế các ấn phẩm truyền thông: poster, banner, backdrop cho các sự kiện của LCĐ - LCH, hay đôi khi hóa thân thành những nhiếp ảnh gia chuyên nghiệp, săn tìm những vẻ đẹp đầy tính nghệ thuật. Ngoài ra còn hỗ trợ các ấn phẩm truyền thông cho một số sự kiện của Khoa.",
        reqHeader: "✨ Đồng điệu tâm hồn với Design team khi bạn cảm thấy bản thân có những yếu tố sau:",
        requirements: [
          "👉 Có cảm quan thẩm mỹ, tư duy hình ảnh tốt.",
          "👉 Biết sử dụng các công cụ như AI, Photoshop, Canva, hoặc có khả năng vẽ bằng bảng điện tử tốt.",
          "👉 Biết chụp, chỉnh ảnh, edit video là lợi thế lớn.",
          "👉 Luôn sẵn sàng tinh thần để chạy deadline."
        ]
      }
    ]
  },
  {
    id: "van-nghe-the-thao",
    houseName: "Hufflepuff",
    title: "Văn nghệ - Thể thao",
    fullTitle: "Mảng Văn nghệ thể thao - Hufflepuff",
    color: "#fde047",
    glowColor: "rgba(253, 224, 71, 0.4)",
    bgGlow: "rgba(253, 224, 71, 0.12)",
    icon: "🎭",
    intro: "tiên phong trong các sự kiện, hoạt động văn hóa – thể thao của LCĐ – LCH, góp phần tạo nên một môi trường sinh viên đa sắc màu, năng động và vô cùng đáng nhớ.",
    sections: [
      {
        title: "⚽️ Nhịp đập ấy không chỉ sôi động trong tâm hồn mà còn mang đến năng lượng tích cực cho mọi thứ xung quanh:",
        items: [
          "📍 Tổ chức và điều phối sự kiện, lên kế hoạch, chuẩn bị, phân công nhân lực và điều hành các chương trình văn nghệ, thể thao.",
          "📍 Phụ trách kịch bản chương trình, thiết kế trò chơi, đóng góp các tiết mục biểu diễn khuấy động không khí.",
          "📍 Quản lý tiến độ tổ chức sự kiện, hỗ trợ nhân lực và hậu cần cho các chương trình chung của Liên chi."
        ]
      }
    ],
    paragraphs: [
      "🥳 Những hoạt động, chương trình vô cùng thành công nhờ sự đồng điệu trong nhịp đập của Văn nghệ Thể thao có thể kể đến như: Giải bóng đá truyền thống mang tên FaMI CUP, giải Rubik’s Cube Challenge, đồng tổ chức giải cờ vua BK Chess, hỗ trợ tổ chức chương trình Chào tân các khóa… Mảng cũng triển khai xây dựng, quản lý các đội bóng đá, bóng rổ đại diện khoa tham gia giải đấu của trường, cùng với đó là tổ chức những hoạt động nội bộ của toàn Liên chi."
    ]
  }
];

export const GUILDS = HOUSES_DATA.map((h) => ({
  id: h.id,
  icon: h.icon,
  title: h.fullTitle,
  subtitle: `House of ${h.houseName}`,
  description: h.intro,
  color: h.color,
  accentGlow: h.glowColor,
  badge: h.houseName.toUpperCase(),
}));
