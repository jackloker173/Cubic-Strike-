// LEVELS.JS
// Domain is fixed at x ∈ [-6, 6] for every level (the "firing corridor").
// Each level is solvable — a working (a,b,c,d) is included as `solution`
// purely for designer reference / potential "show solution" debug mode.
// It is never shown to the player during normal play.

const LEVELS = [
  {
    id: 1,
    name: "BIỂN LẶNG",
    briefing: "Không có chướng ngại vật đáng kể. Hãy làm quen với ống phóng. Chỉnh c để đặt hướng bay, chỉnh d để đặt độ sâu xuất phát.",
    domain: [-6, 6],
    target: { x: 5, y: 5, r: 0.7 },
    obstacles: [
      { x: -3, y: 3, r: 0.8, type: "iceberg" },
      { x: 2, y: -3, r: 0.8, type: "island" },
    ],
    solution: { a: 0, b: 0, c: 1, d: 0 },
  },
  {
    id: 2,
    name: "THỦY TRIỀU DÂNG",
    briefing: "Mục tiêu nằm cao hơn đường phóng của bạn. d dịch chuyển toàn bộ đường bay lên hoặc xuống — dùng nó để tránh vật cản gần mũi tàu.",
    domain: [-6, 6],
    target: { x: 6, y: 5, r: 0.65 },
    obstacles: [
      { x: 1, y: 0, r: 0.8, type: "island" },
      { x: -4, y: 4, r: 1, type: "iceberg" },
    ],
    solution: { a: 0, b: 0, c: 0.5, d: 2 },
  },
  {
    id: 3,
    name: "LÀN ĐƯỜNG BỊ CHẶN",
    briefing: "Một đường bay thẳng sẽ đâm thẳng vào tảng băng đó. Dùng b để bẻ cong đường bay vòng qua nó.",
    domain: [-6, 6],
    target: { x: 5, y: 1, r: 0.6 },
    obstacles: [
      { x: 2.5, y: 0.5, r: 1, type: "iceberg" },
      { x: -3, y: -3, r: 1, type: "island" },
    ],
    solution: { a: 0, b: 0.25, c: -1.05, d: 0 },
  },
  {
    id: 4,
    name: "HAI TẢNG ĐÁ",
    briefing: "Giờ có chướng ngại vật ở cả hai bên hành lang bay. Len lỏi qua khe hở giữa chúng trước khi lao xuống mục tiêu.",
    domain: [-6, 6],
    target: { x: 5, y: -3, r: 0.6 },
    obstacles: [
      { x: -2, y: -2, r: 1, type: "iceberg" },
      { x: 2, y: 2, r: 1, type: "island" },
    ],
    solution: { a: 0, b: -0.1, c: -0.1, d: 0 },
  },
  {
    id: 5,
    name: "ĐƯỜNG LƯỢN SÓNG",
    briefing: "Lên, rồi xuống, rồi lại lên. Đây là lúc hệ số bậc ba (a) bắt đầu phát huy tác dụng.",
    domain: [-6, 6],
    target: { x: 5, y: 4, r: 0.55 },
    obstacles: [
      { x: -1, y: -2, r: 1, type: "iceberg" },
      { x: 2, y: 2, r: 1, type: "island" },
    ],
    solution: { a: -0.011, b: 0.428, c: -1.061, d: 0 },
  },
  {
    id: 6,
    name: "TUYẾN CHẮN",
    briefing: "Ba chướng ngại vật giăng ngang hành lang bay. Hãy tính toán toàn bộ đường bay trước khi phóng — bạn không thể chỉnh sửa giữa chừng.",
    domain: [-6, 6],
    target: { x: 6, y: -4, r: 0.5 },
    obstacles: [
      { x: -3, y: 1, r: 1, type: "iceberg" },
      { x: 0, y: -2, r: 1, type: "island" },
      { x: 3, y: 1.5, r: 1, type: "iceberg" },
    ],
    solution: { a: 0.0278, b: -0.25, c: -0.3333, d: 1 },
  },
  {
    id: 7,
    name: "EO BIỂN HẸP",
    briefing: "Giờ có bốn chướng ngại vật, và khe hở hẹp hơn. Đọc kỹ tọa độ trước khi quyết định.",
    domain: [-6, 6],
    target: { x: 6, y: 4, r: 0.5 },
    obstacles: [
      { x: -4, y: -1, r: 1, type: "iceberg" },
      { x: -1, y: 2, r: 1, type: "island" },
      { x: 2, y: -2, r: 1, type: "iceberg" },
      { x: 4.5, y: 1, r: 0.8, type: "island" },
    ],
    solution: { a: 0.0018, b: 0.1054, c: -0.0107, d: -0.1143 },
  },
  {
    id: 8,
    name: "VÙNG BIỂN SÂU",
    briefing: "Băng và đá trải rộng hơn. Mục tiêu ở xa hơn — sai số nhỏ trong hệ số sẽ bị khuếch đại theo khoảng cách.",
    domain: [-6, 6],
    target: { x: 6, y: 5, r: 0.4 },
    obstacles: [
      { x: 0, y: 2, r: 1, type: "island" },
      { x: -4, y: -1, r: 1, type: "iceberg" },
      { x: 3, y: 0.5, r: 1, type: "island" },
      { x: -2, y: -3, r: 0.9, type: "iceberg" },
    ],
    solution: { a: 0.0464, b: 0.0821, c: -1.1643, d: -1 },
  },
  {
    id: 9,
    name: "BÃI TÀU ĐẮM",
    briefing: "Năm mối nguy hiểm, mục tiêu nhỏ. Màn này cần tính toán kỹ — hãy phác thảo đường bay dự kiến ra giấy trước khi nhập số.",
    domain: [-6, 6],
    target: { x: 6, y: -3, r: 0.35 },
    obstacles: [
      { x: 0, y: -2, r: 1, type: "island" },
      { x: -4, y: 1.5, r: 1, type: "iceberg" },
      { x: 3, y: -1, r: 1, type: "island" },
      { x: -1.5, y: 3, r: 0.9, type: "iceberg" },
      { x: 4.5, y: 2, r: 0.7, type: "iceberg" },
    ],
    solution: { a: -0.0361, b: -0.0361, c: 0.9333, d: 0.5 },
  },
  {
    id: 10,
    name: "TIẾP CẬN CUỐI CÙNG",
    briefing: "Toàn bộ chướng ngại vật. Cần độ chính xác tuyệt đối. Đây là cửa ải cuối cùng trước vùng biển khơi — chúc may mắn, sĩ quan điều khiển.",
    domain: [-6, 6],
    target: { x: 6, y: 4, r: 0.3 },
    obstacles: [
      { x: 0, y: 2, r: 1, type: "island" },
      { x: -5, y: -1.2, r: 1, type: "iceberg" },
      { x: 2, y: 0.3, r: 0.9, type: "island" },
      { x: -2, y: 3, r: 0.9, type: "iceberg" },
      { x: 4, y: -2.5, r: 0.9, type: "island" },
    ],
    solution: { a: 0.0399, b: 0.0555, c: -1.0208, d: -0.5 },
  },
];
