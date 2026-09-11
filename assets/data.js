/* ==========================================================================
   붓잽이 갤러리 — 작품 데이터

   ★ 사이트를 관리할 때 손대는 파일은 이 파일 하나면 됩니다.
     작품을 추가·수정·삭제하려면 아래 목록만 고치세요.

   [작품 추가 3단계]
     1) 그림 이미지를 images/ 폴더에 넣습니다.  예) images/1ho-001.jpg
     2) 아래 해당 목록에 { } 한 덩어리를 추가합니다.
     3) 저장하고 새로고침하면 끝입니다.

   [작품 한 덩어리 쓰는 법]
     {
       image: "images/1ho-001.jpg",   // 필수. images/ 폴더 기준 경로
       title: "Canvas 1호 - 001",     // 생략하면 자동으로 번호가 붙습니다
       orientation: "portrait",       // "portrait"(세로) 또는 "landscape"(가로)
       size: "22X16",                 // 생략하면 갤러리 기본값 사용
       medium: "유화, 캔버스",         // 생략하면 갤러리 기본값 사용
       price: 287200,                 // 생략하면 갤러리 기본값 사용
       sold: false,                   // true면 "품절" 딱지가 붙습니다
       description: "작품 설명입니다." // 생략하면 '준비 중' 문구가 나옵니다
     },

   ※ 쉼표(,)와 따옴표(")를 빠뜨리지 않도록 주의하세요.
     화면이 하얗게 나오면 열에 아홉은 쉼표나 따옴표 실수입니다.
     브라우저에서 F12 → Console 탭을 열면 몇 번째 줄이 문제인지 알려줍니다.
   ========================================================================== */

const SITE_DATA = {
  /* ---------------------------------------------------------------
     1. 기본 정보
     --------------------------------------------------------------- */
  site: {
    name: "붓잽이 웹사이트 - Brushjab Gallery",
    url: "https://www.brushjab.com",
    // 구매 문의 버튼을 누르면 열리는 주소 (SOOP 채널 / 오픈카카오톡, 둘 다 노출됩니다)
    inquiryUrl: "https://ch.sooplive.co.kr/km5430678",
    kakaoUrl: "https://open.kakao.com/o/sqcBHoAh",
  },

  /* ---------------------------------------------------------------
     2. 작가 소개
     --------------------------------------------------------------- */
  artist: {
    name: "붓잽이 (Brushjab)",
    // 프로필 사진. images/ 폴더에 넣고 경로를 적으세요. 비워두면 자리 표시가 나옵니다.
    photo: "images/artist-profile.jpg",
    fields: ["순수미술 유화", "온라인방송", "SNS활동"],

    awards: [{ text: "주식회사 숲 시상식 - 미술대상 수상" }],

    // 앞에서부터 3개는 항상 보이고, 나머지는 '더보기'로 접힙니다.
    exhibitions: [
      { date: "2023.03.26", text: "삼청동 마루 개인전" },
      { date: "2023.08.13", text: "삼청동 마루 개인전" },
      { date: "2024.04.07", text: "성북 리홀아트갤러리 개인전" },
      { date: "2024.07.01~07.31", text: "카페보테가 개인전 (상시전)" },
      { date: "2024.11.01", text: "카페보테가 개인전" },
      { date: "2025.04.01~04.30", text: "카페보테가 개인전 (상시전)" },
      { date: "2025.05.01~05.31", text: "제주도 거인의정원 개인전 (상시전)" },
    ],
  },

  /* ---------------------------------------------------------------
     3. 갤러리
     --------------------------------------------------------------- */
  galleries: [
    {
      id: "1ho",
      tag: "CANVAS 1",
      title: "1호그림 갤러리",
      summary: "섬세한 바다 풍경의 소품",
      heading: "Canvas 1호 컬렉션",
      cover: "", // 대표 이미지. 비워두면 첫 번째 작품 이미지가 쓰입니다.
      accent: "sky", // sky | pink | amber
      perPage: 8, // 한 페이지에 보여줄 작품 수
      defaults: {
        price: 287200,
        size: "22X16",
        medium: "유화, 캔버스",
        orientation: "portrait",
        titlePrefix: "Canvas 1호",
      },

      // ▼▼▼ 1호 작품을 여기에 추가하세요 ▼▼▼
      artworks: [
        { image: "images/1ho-032.jpg" },
        { image: "images/1ho-031.jpg" },
        { image: "images/1ho-030.jpg" },
        { image: "images/1ho-029.jpg" },
        { image: "images/1ho-028.jpg" },
        { image: "images/1ho-027.jpg" },
        { image: "images/1ho-026.jpg" },
        { image: "images/1ho-025.jpg" },
        { image: "images/1ho-024.jpg" },
        { image: "images/1ho-023.jpg" },
        { image: "images/1ho-022.jpg" },
        { image: "images/1ho-021.jpg" },
        { image: "images/1ho-020.jpg" },
        { image: "images/1ho-019.jpg" },
        { image: "images/1ho-016.jpg" },
        { image: "images/1ho-015.jpg" },
        { image: "images/1ho-013.jpg" },
        { image: "images/1ho-012.jpg" },
        { image: "images/1ho-011.jpg" },
        { image: "images/1ho-010.jpg" },
        { image: "images/1ho-009.jpg", orientation: "landscape" },
        { image: "images/1ho-008.jpg" },
        { image: "images/1ho-007.jpg" },
        { image: "images/1ho-006.jpg" },
        { image: "images/1ho-005.jpg" },
        { image: "images/1ho-004.jpg" },
        { image: "images/1ho-003.jpg" },
        { image: "images/1ho-002.jpg" },
        { image: "images/1ho-001.jpg" },
      ],
      // ▲▲▲ 여기까지 ▲▲▲
    },

    // 10호그림 갤러리 — 당분간 업데이트 예정이 없어 카드를 숨겨둡니다.
    // 다시 보이게 하려면 아래 블록 전체를 감싼 /* 와 */ 를 지우세요.
    /*
    {
      id: "10ho",
      tag: "CANVAS 10",
      title: "10호그림 갤러리",
      summary: "풍부한 감성의 대형 소품",
      heading: "Canvas 10호 컬렉션",
      cover: "",
      accent: "pink",
      perPage: 8,
      // 작품 수가 적어 큰 카드로 보여주고 싶다면 true
      largeCards: true,
      defaults: {
        price: 2000000,
        size: "53X45",
        medium: "유화, 캔버스",
        orientation: "portrait",
        titlePrefix: "Canvas 10호",
      },

      // ▼▼▼ 10호 작품을 여기에 추가하세요 ▼▼▼
      artworks: [],
      // ▲▲▲ 여기까지 ▲▲▲
    },
    */
  ],

  /* ---------------------------------------------------------------
     4. 아카이브 (판매 완료된 작품)
     --------------------------------------------------------------- */
  archive: {
    tag: "ARCHIVE",
    title: "아카이브",
    summary: "판매 완료된 작품 컬렉션",
    heading: "아카이브 컬렉션",
    cover: "",
    perPage: 8,
    defaults: {
      price: 287200,
      size: "22X16",
      medium: "유화, 캔버스",
      orientation: "portrait",
      collection: "품절 작품 컬렉션",
      titlePrefix: "아카이브",
    },

    // ▼▼▼ 판매 완료된 작품을 여기에 추가하세요 ▼▼▼
    // 아카이브 작품에는 soldDate(판매일)를 함께 적어주면 상세창에 표시됩니다.
    artworks: [
      { image: "images/archive-046.jpg" },
      { image: "images/archive-047.jpg" },
      { image: "images/archive-048.jpg" },
      { image: "images/archive-049.jpg" },
      { image: "images/archive-050.jpg" },
      { image: "images/archive-001.jpg" },
      { image: "images/archive-002.jpg" },
      { image: "images/archive-003.jpg" },
      { image: "images/archive-004.jpg" },
      { image: "images/archive-005.jpg" },
      { image: "images/archive-006.jpg" },
      { image: "images/archive-007.jpg" },
      { image: "images/archive-008.jpg" },
      { image: "images/archive-009.jpg" },
      { image: "images/archive-010.jpg" },
      { image: "images/archive-011.jpg" },
      { image: "images/archive-012.jpg" },
      { image: "images/archive-013.jpg" },
      { image: "images/archive-014.jpg" },
      { image: "images/archive-015.jpg" },
      { image: "images/archive-016.jpg" },
      { image: "images/archive-017.jpg" },
      { image: "images/archive-018.jpg" },
      { image: "images/archive-019.jpg" },
      { image: "images/archive-020.jpg" },
      { image: "images/archive-021.jpg" },
      { image: "images/archive-022.jpg" },
      { image: "images/archive-023.jpg" },
      { image: "images/archive-024.jpg" },
      { image: "images/archive-025.jpg" },
      { image: "images/archive-026.jpg" },
      { image: "images/archive-027.jpg" },
      { image: "images/archive-028.jpg" },
      { image: "images/archive-029.jpg" },
      { image: "images/archive-030.jpg" },
      { image: "images/archive-031.jpg" },
      { image: "images/archive-032.jpg" },
      { image: "images/archive-033.jpg" },
      { image: "images/archive-034.jpg" },
      { image: "images/archive-035.jpg" },
      { image: "images/archive-036.jpg" },
      { image: "images/archive-037.jpg" },
      { image: "images/archive-038.jpg" },
      { image: "images/archive-039.jpg" },
      { image: "images/archive-040.jpg" },
      { image: "images/archive-041.jpg" },
      { image: "images/archive-042.jpg" },
      { image: "images/archive-043.jpg" },
      { image: "images/archive-044.jpg" },
      { image: "images/archive-045.jpg" },
      { image: "images/archive-051.jpg" },
      { image: "images/archive-052.jpg" },
      { image: "images/archive-053.jpg" },
      { image: "images/archive-054.jpg" },
      { image: "images/archive-055.jpg" },
      { image: "images/archive-056.jpg" },
      { image: "images/archive-057.jpg", orientation: "landscape" },
      { image: "images/archive-058.jpg", orientation: "landscape" },
      { image: "images/archive-059.jpg" },
      { image: "images/archive-060.jpg" },
      { image: "images/archive-061.jpg" },
      { image: "images/archive-062.jpg" },
      { image: "images/archive-063.jpg" },
      { image: "images/archive-064.jpg" },
      { image: "images/archive-065.jpg" },
      { image: "images/archive-066.jpg" },
      { image: "images/archive-067.jpg" },
      { image: "images/archive-068.jpg" },
      { image: "images/archive-069.jpg" },
    ],
    // ▲▲▲ 여기까지 ▲▲▲
  },
};
