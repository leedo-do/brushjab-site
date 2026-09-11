/* ==========================================================================
   붓잽이 갤러리 — 동작 스크립트

   보통은 이 파일을 수정할 일이 없습니다.
   작품을 추가하려면 assets/data.js 를 여세요.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- 데이터가 없어도 페이지가 죽지 않게 방어 ---------- */
  var DATA = typeof SITE_DATA === "object" && SITE_DATA ? SITE_DATA : {};
  var SITE = DATA.site || {};
  var INQUIRY_URL = SITE.inquiryUrl || "#";
  var KAKAO_URL = SITE.kakaoUrl || "#";
  var GALLERIES = Array.isArray(DATA.galleries) ? DATA.galleries : [];
  var ARCHIVE = DATA.archive || { artworks: [] };
  var ARTIST = DATA.artist || {};

  /* ---------- 작은 도우미들 ---------- */
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  // 데이터에 들어온 글자를 그대로 화면에 넣기 전에 안전하게 처리합니다.
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function won(n) {
    var num = Number(n);
    return (isFinite(num) ? num : 0).toLocaleString("ko-KR") + "원";
  }
  function pad3(n) {
    return String(n).padStart(3, "0");
  }

  var ICON = {
    chevron:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    arrowLeft:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    close:
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>',
    frame:
      '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.6"/><path d="m21 15-4.5-4.5L9 18"/></svg>',
  };

  /* ---------- 이미지가 없거나 깨졌을 때 대체 표시 ---------- */
  function placeholder(accent, label) {
    return (
      '<div class="ph' +
      (accent === "amber" ? " ph--amber" : "") +
      '">' +
      ICON.frame +
      "<span>" +
      esc(label || "이미지 준비 중") +
      "</span></div>"
    );
  }

  function media(art, opts) {
    opts = opts || {};
    var accent = opts.accent;
    if (!art.image) return placeholder(accent, opts.label);
    return (
      '<img src="' +
      esc(art.image) +
      '" alt="' +
      esc(art.title || "작품 이미지") +
      '" loading="lazy" decoding="async">'
    );
  }

  // 이미지 로드에 실패하면 자리 표시로 바꿉니다. (error 이벤트는 캡처 단계에서 잡습니다)
  document.addEventListener(
    "error",
    function (e) {
      var t = e.target;
      if (!t || t.tagName !== "IMG" || t.dataset.failed) return;
      t.dataset.failed = "1";
      var wrap = t.parentNode;
      if (!wrap) return;
      var amber = wrap.closest && wrap.closest(".overlay--archive") ? "amber" : "";
      t.remove();
      wrap.insertAdjacentHTML("beforeend", placeholder(amber, "이미지를 불러오지 못했습니다"));
    },
    true
  );

  /* ---------- 작품 하나의 값 채우기 (빠진 값은 갤러리 기본값으로) ---------- */
  function normalize(art, group, index) {
    var d = group.defaults || {};
    var prefix = d.titlePrefix || group.title || "작품";
    return {
      image: art.image || "",
      title: art.title || prefix + " - " + pad3(index + 1),
      orientation: art.orientation || d.orientation || "portrait",
      size: art.size || d.size || "",
      medium: art.medium || d.medium || "",
      price: art.price != null ? art.price : d.price,
      sold: !!art.sold,
      soldDate: art.soldDate || "",
      collection: art.collection || d.collection || "",
      description: art.description || "",
    };
  }
  function listOf(group) {
    var raw = Array.isArray(group.artworks) ? group.artworks : [];
    return raw.map(function (a, i) {
      return normalize(a || {}, group, i);
    });
  }

  /* ---------- 스크롤 잠금 (모달이 겹쳐도 안전하게) ---------- */
  var lockCount = 0;
  function lockScroll() {
    lockCount++;
    document.body.classList.add("is-locked");
  }
  function unlockScroll() {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) document.body.classList.remove("is-locked");
  }

  /* ---------- 네비게이션 ---------- */
  function initNav() {
    var toggle = $("#nav-toggle");
    var panel = $("#nav-mobile");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.innerHTML = open ? ICON.close : ICON.menu;
      });
      panel.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          panel.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = ICON.menu;
        }
      });
    }

    // 현재 보고 있는 섹션을 메뉴에 표시합니다.
    var links = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
    var sections = ["home", "artist", "gallery", "archive", "contact", "sns"]
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    var visible = {};
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          visible[en.target.id] = en.isIntersecting;
        });
        // 여러 섹션이 동시에 걸릴 때는 가장 아래쪽(현재 보고 있는) 섹션을 고릅니다.
        var current = null;
        sections.forEach(function (s) {
          if (visible[s.id]) current = s;
        });
        links.forEach(function (a) {
          var on = current && a.dataset.nav === current.id;
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 스크롤 등장 효과 ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) {
        n.classList.add("is-in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach(function (n) {
      io.observe(n);
    });
  }

  /* ---------- 작가 소개 채우기 ---------- */
  function renderArtist() {
    var photo = $("#artist-photo");
    if (photo) {
      photo.innerHTML = ARTIST.photo
        ? '<img src="' + esc(ARTIST.photo) + '" alt="' + esc(ARTIST.name || "작가") + ' 프로필">'
        : placeholder("", "프로필 사진");
    }
    var nameEl = $("#artist-name");
    if (nameEl && ARTIST.name) nameEl.textContent = ARTIST.name;

    var chips = $("#artist-fields");
    if (chips) {
      chips.innerHTML = (ARTIST.fields || [])
        .map(function (f) {
          return '<span class="chip">' + esc(f) + "</span>";
        })
        .join("");
    }

    var awards = $("#artist-awards");
    if (awards) {
      awards.innerHTML = (ARTIST.awards || [])
        .map(function (a) {
          return '<li class="record"><span class="record__text">' + esc(a.text) + "</span></li>";
        })
        .join("");
    }

    function recordHtml(x) {
      return (
        '<li class="record"><span class="record__date font-en">' +
        esc(x.date) +
        '</span><span class="record__text">' +
        esc(x.text) +
        "</span></li>"
      );
    }
    var all = ARTIST.exhibitions || [];
    var head = $("#exhibitions");
    var more = $("#exhibitions-more");
    var btn = $("#exhibitions-toggle");
    if (head) head.innerHTML = all.slice(0, 3).map(recordHtml).join("");
    var rest = all.slice(3);
    if (more) more.innerHTML = rest.map(recordHtml).join("");
    if (btn) {
      if (!rest.length) {
        btn.hidden = true;
      } else {
        var labelEl = $("#exhibitions-toggle-label");
        if (labelEl) labelEl.textContent = "더보기 (" + rest.length + "개 더)";
        btn.addEventListener("click", function () {
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", open ? "false" : "true");
          if (more) more.hidden = open;
          if (labelEl) labelEl.textContent = open ? "더보기 (" + rest.length + "개 더)" : "접어보기";
        });
      }
    }
  }

  /* ---------- 메인 갤러리 카드 ---------- */
  function coverOf(group, items) {
    if (group.cover) return group.cover;
    var first = items.find(function (a) {
      return a.image;
    });
    return first ? first.image : "";
  }

  function galleryCardHtml(group, items) {
    var accent = group.accent || "sky";
    var cover = coverOf(group, items);
    var count = items.length;
    var priceText = count
      ? won((group.defaults || {}).price)
      : "작품 준비 중";
    return (
      '<button class="card' +
      (accent === "pink" ? " card--pink" : "") +
      '" type="button" data-open-gallery="' +
      esc(group.id) +
      '">' +
      '<div class="card__media' +
      (group.largeCards ? " card__media--3x4 card__media--contain" : "") +
      '">' +
      (cover
        ? '<img src="' + esc(cover) + '" alt="' + esc(group.title) + '" loading="lazy" decoding="async">'
        : placeholder("", "대표 이미지 준비 중")) +
      '<span class="card__tag font-en">' +
      esc(group.tag || "") +
      "</span>" +
      "</div>" +
      '<div class="card__body">' +
      '<h3 class="card__title">' +
      esc(group.title) +
      "</h3>" +
      '<p class="card__desc">' +
      esc(group.summary || "") +
      "</p>" +
      '<p class="card__price' +
      (accent === "pink" ? " card__price--pink" : "") +
      ' font-en">' +
      esc(priceText) +
      "</p>" +
      '<span class="card__foot"><span class="btn ' +
      (accent === "pink" ? "btn--outline-pink" : "btn--outline") +
      '">작품 보러가기</span></span>' +
      "</div>" +
      "</button>"
    );
  }

  function archiveCardHtml(items) {
    var cover = coverOf(ARCHIVE, items);
    return (
      '<button class="card card--amber" type="button" data-open-archive="1">' +
      '<div class="card__media">' +
      (cover
        ? '<img src="' + esc(cover) + '" alt="아카이브" loading="lazy" decoding="async">'
        : placeholder("amber", "대표 이미지 준비 중")) +
      '<span class="card__tag font-en">' +
      esc(ARCHIVE.tag || "ARCHIVE") +
      "</span>" +
      "</div>" +
      '<div class="card__body">' +
      '<h3 class="card__title">' +
      esc(ARCHIVE.title || "아카이브") +
      "</h3>" +
      '<p class="card__desc">' +
      esc(ARCHIVE.summary || "") +
      "</p>" +
      '<p class="card__price card__price--amber font-en">' +
      (items.length ? "총 " + items.length + "점" : "작품 준비 중") +
      "</p>" +
      '<span class="card__foot"><span class="btn btn--outline-amber">아카이브 보기</span></span>' +
      "</div>" +
      "</button>"
    );
  }

  function renderCards() {
    var wrap = $("#gallery-cards");
    if (wrap) {
      wrap.innerHTML = GALLERIES.map(function (g) {
        return '<div class="reveal reveal--scale">' + galleryCardHtml(g, listOf(g)) + "</div>";
      }).join("");
    }
    var aw = $("#archive-cards");
    if (aw) {
      aw.innerHTML =
        '<div class="reveal reveal--scale">' + archiveCardHtml(listOf(ARCHIVE)) + "</div>";
    }
  }

  /* ---------- 전체화면 갤러리 ---------- */
  var overlay = $("#overlay");
  var modal = $("#modal");
  var lastFocus = null;
  var overlayState = null; // { group, items, page, isArchive }

  function visiblePages(page, total) {
    var delta = 2;
    var out = [1];
    for (var i = Math.max(2, page - delta); i <= Math.min(total - 1, page + delta); i++) {
      out.push(i);
    }
    if (page - delta > 2) out.splice(1, 0, "…");
    if (page + delta < total - 1) out.push("…");
    if (total > 1) out.push(total);
    return out;
  }

  function artCardHtml(art, group, index, isArchive) {
    var accent = isArchive ? "amber" : group.accent || "sky";
    var wide = art.orientation === "landscape";
    var mediaCls =
      "card__media" +
      (group.largeCards ? " card__media--3x4 card__media--contain" : wide ? " card__media--wide" : "");
    return (
      '<button class="card' +
      (accent === "pink" ? " card--pink" : accent === "amber" ? " card--amber" : "") +
      '" type="button" data-open-art="' +
      index +
      '">' +
      '<div class="' +
      mediaCls +
      '">' +
      media(art, { accent: accent }) +
      (art.sold || isArchive ? '<span class="card__badge">품절</span>' : "") +
      "</div>" +
      '<div class="card__body">' +
      '<h3 class="card__title">' +
      esc(art.title) +
      "</h3>" +
      '<div class="card__meta">' +
      (art.size ? "<p>크기: " + esc(art.size) + "</p>" : "") +
      (art.medium ? "<p>재료: " + esc(art.medium) + "</p>" : "") +
      (isArchive && art.soldDate ? "<p>판매일: " + esc(art.soldDate) + "</p>" : "") +
      "</div>" +
      '<div class="card__foot card__foot--split">' +
      '<span class="card__price' +
      (accent === "pink" ? " card__price--pink" : accent === "amber" ? " card__price--amber" : "") +
      ' font-en">' +
      won(art.price) +
      "</span>" +
      (isArchive
        ? ""
        : '<span class="btn ' +
          (accent === "pink" ? "btn--outline-pink" : "btn--outline") +
          '" data-inquiry="1">구매문의</span>') +
      "</div>" +
      "</div>" +
      "</button>"
    );
  }

  function renderOverlay() {
    if (!overlayState || !overlay) return;
    var s = overlayState;
    var items = s.items;
    var perPage = Math.max(1, Number(s.group.perPage) || 8);
    var totalPages = Math.max(1, Math.ceil(items.length / perPage));
    if (s.page > totalPages) s.page = totalPages;
    var start = (s.page - 1) * perPage;
    var pageItems = items.slice(start, start + perPage);

    var body;
    if (!items.length) {
      body =
        '<div class="empty"><h3>작품을 준비하고 있습니다</h3>' +
        "<p>이미지를 <code>images/</code> 폴더에 넣고 <code>assets/data.js</code>에 작품을 추가하면 여기에 표시됩니다.</p></div>";
    } else {
      body =
        '<div class="art-grid' +
        (s.group.largeCards ? " art-grid--single" : "") +
        '">' +
        pageItems
          .map(function (a, i) {
            return artCardHtml(a, s.group, start + i, s.isArchive);
          })
          .join("") +
        "</div>";

      if (totalPages > 1) {
        body +=
          '<nav class="pager' +
          (s.isArchive ? " pager--amber" : "") +
          '" aria-label="갤러리 페이지">' +
          '<button type="button" data-page="' +
          (s.page - 1) +
          '"' +
          (s.page === 1 ? " disabled" : "") +
          ' aria-label="이전 페이지">' +
          ICON.arrowLeft +
          "</button>" +
          visiblePages(s.page, totalPages)
            .map(function (p) {
              if (p === "…") return "<span>…</span>";
              return (
                '<button type="button" data-page="' +
                p +
                '"' +
                (p === s.page ? ' aria-current="page"' : "") +
                ">" +
                p +
                "</button>"
              );
            })
            .join("") +
          '<button type="button" data-page="' +
          (s.page + 1) +
          '"' +
          (s.page === totalPages ? " disabled" : "") +
          ' aria-label="다음 페이지">' +
          ICON.arrowLeft.replace("<svg", '<svg style="transform:rotate(180deg)"') +
          "</button>" +
          "</nav>";
      }
    }

    var countText = items.length
      ? "총 " +
        items.length +
        "점" +
        (totalPages > 1
          ? " | " +
            s.page +
            " / " +
            totalPages +
            "페이지 (" +
            (start + 1) +
            "~" +
            Math.min(start + perPage, items.length) +
            "번)"
          : "")
      : "작품 준비 중";

    overlay.className = "overlay" + (s.isArchive ? " overlay--archive" : "");
    overlay.innerHTML =
      '<div class="overlay__inner"><div class="container">' +
      '<div class="overlay__bar">' +
      '<button class="overlay__back" type="button" data-close-overlay="1">' +
      ICON.arrowLeft +
      "<span>갤러리로 돌아가기</span></button>" +
      '<span class="overlay__label grad-text' +
      (s.isArchive ? " grad-text--amber" : s.group.accent === "pink" ? " grad-text--pink" : "") +
      '">' +
      esc(s.group.title) +
      "</span>" +
      "</div>" +
      '<div class="overlay__head">' +
      '<h2 id="overlay-title" class="grad-text' +
      (s.isArchive ? " grad-text--amber" : s.group.accent === "pink" ? " grad-text--pink" : "") +
      '">' +
      esc(s.group.heading || s.group.title) +
      "</h2>" +
      '<p class="overlay__count">' +
      esc(countText) +
      "</p>" +
      "</div>" +
      body +
      "</div></div>";
  }

  function openOverlay(group, isArchive) {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlayState = { group: group, items: listOf(group), page: 1, isArchive: !!isArchive };
    renderOverlay();
    overlay.hidden = false;
    overlay.scrollTop = 0;
    lockScroll();
    var back = overlay.querySelector("[data-close-overlay]");
    if (back) back.focus();
  }

  function closeOverlay() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    overlay.innerHTML = "";
    overlayState = null;
    unlockScroll();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- 작품 상세 ---------- */
  function openArt(art, group, isArchive) {
    if (!modal) return;
    var accent = isArchive ? "amber" : group.accent || "sky";
    var wide = art.orientation === "landscape";
    var priceClass =
      accent === "pink" ? "is-price is-price--pink" : accent === "amber" ? "is-price is-price--amber" : "is-price";

    var specs = [];
    if (art.size) specs.push(["크기", esc(art.size), ""]);
    if (art.medium) specs.push(["재료", esc(art.medium), ""]);
    specs.push([isArchive ? "판매가격" : "판매가격", won(art.price), priceClass]);
    if (isArchive && art.soldDate) specs.push(["판매일", esc(art.soldDate), ""]);

    modal.innerHTML =
      '<div class="modal__box" role="document">' +
      '<button class="modal__close" type="button" data-close-modal="1" aria-label="닫기">' +
      ICON.close +
      "</button>" +
      '<div class="modal__grid">' +
      '<div class="modal__media' +
      (wide ? " modal__media--wide" : "") +
      '">' +
      media(art, { accent: accent }) +
      (isArchive || art.sold ? '<span class="modal__sold font-en">SOLD OUT</span>' : "") +
      "</div>" +
      "<div>" +
      '<h3 id="modal-title" class="modal__title grad-text' +
      (isArchive ? " grad-text--amber" : accent === "pink" ? " grad-text--pink" : "") +
      '">' +
      esc(art.title) +
      "</h3>" +
      (art.collection ? '<p class="modal__collection">' + esc(art.collection) + "</p>" : "") +
      '<div class="modal__note"><h4>작품 설명</h4><p>' +
      (art.description ? esc(art.description) : "작품 설명을 준비하고 있습니다.") +
      "</p></div>" +
      '<dl class="spec">' +
      specs
        .map(function (s) {
          return "<div><dt>" + s[0] + ':</dt><dd class="' + s[2] + '">' + s[1] + "</dd></div>";
        })
        .join("") +
      "</dl>" +
      '<div class="modal__actions">' +
      (isArchive || art.sold
        ? '<div class="sold-note"><p>이 작품은 이미 판매 완료되었습니다</p><p>비슷한 스타일의 작품을 원하시면 문의해 주세요</p></div>' +
          '<div class="btn-group">' +
          '<a class="btn btn--grad" href="' +
          esc(KAKAO_URL) +
          '" target="_blank" rel="noopener noreferrer">오픈카카오톡으로 문의</a>' +
          "</div>"
        : '<div class="btn-group">' +
          '<a class="btn btn--grad" href="' +
          esc(INQUIRY_URL) +
          '" target="_blank" rel="noopener noreferrer">SOOP 채널 문의</a>' +
          '<a class="btn btn--grad" href="' +
          esc(KAKAO_URL) +
          '" target="_blank" rel="noopener noreferrer">오픈카카오톡 문의</a>' +
          "</div>") +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    modal.hidden = false;
    lockScroll();
    var close = modal.querySelector("[data-close-modal]");
    if (close) close.focus();
  }

  /* ---------- 구매문의 선택창 (SOOP / 오픈카카오톡) ---------- */
  function openInquiryChoice() {
    if (!modal) return;
    modal.innerHTML =
      '<div class="modal__box modal__box--compact" role="document">' +
      '<button class="modal__close" type="button" data-close-modal="1" aria-label="닫기">' +
      ICON.close +
      "</button>" +
      '<div class="inquiry-choice">' +
      '<h3 class="modal__title grad-text" style="text-align:center">구매 문의</h3>' +
      '<p style="text-align:center;color:var(--slate-600);margin-bottom:20px;">원하시는 방법으로 문의해 주세요</p>' +
      '<div class="btn-group">' +
      '<a class="btn btn--grad" href="' +
      esc(INQUIRY_URL) +
      '" target="_blank" rel="noopener noreferrer">SOOP 채널 문의</a>' +
      '<a class="btn btn--grad" href="' +
      esc(KAKAO_URL) +
      '" target="_blank" rel="noopener noreferrer">오픈카카오톡 문의</a>' +
      "</div>" +
      "</div>" +
      "</div>";
    modal.hidden = false;
    lockScroll();
    var close = modal.querySelector("[data-close-modal]");
    if (close) close.focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modal.innerHTML = "";
    unlockScroll();
    if (overlayState) {
      var back = overlay.querySelector("[data-close-overlay]");
      if (back) back.focus();
    }
  }

  /* ---------- 클릭 처리 (한 곳에서 모두 위임 처리) ---------- */
  function findGroup(id) {
    return GALLERIES.find(function (g) {
      return g.id === id;
    });
  }

  document.addEventListener("click", function (e) {
    var t = e.target;

    var openG = t.closest && t.closest("[data-open-gallery]");
    if (openG) {
      var g = findGroup(openG.getAttribute("data-open-gallery"));
      if (g) openOverlay(g, false);
      return;
    }

    if (t.closest && t.closest("[data-open-archive]")) {
      openOverlay(
        Object.assign({ id: "archive", accent: "amber" }, ARCHIVE),
        true
      );
      return;
    }

    if (t.closest && t.closest("[data-close-overlay]")) {
      closeOverlay();
      return;
    }

    if (t.closest && t.closest("[data-close-modal]")) {
      closeModal();
      return;
    }

    // 카드 안의 '구매문의'는 상세창 대신 문의 채널 선택창을 엽니다.
    var inquiry = t.closest && t.closest("[data-inquiry]");
    if (inquiry) {
      e.preventDefault();
      e.stopPropagation();
      openInquiryChoice();
      return;
    }

    var openA = t.closest && t.closest("[data-open-art]");
    if (openA && overlayState) {
      var idx = Number(openA.getAttribute("data-open-art"));
      var art = overlayState.items[idx];
      if (art) openArt(art, overlayState.group, overlayState.isArchive);
      return;
    }

    var pageBtn = t.closest && t.closest("[data-page]");
    if (pageBtn && overlayState) {
      var p = Number(pageBtn.getAttribute("data-page"));
      if (p >= 1) {
        overlayState.page = p;
        renderOverlay();
        overlay.scrollTop = 0;
      }
      return;
    }

    // 어두운 바깥 영역을 누르면 상세창을 닫습니다.
    if (modal && !modal.hidden && t === modal) closeModal();
  });

  // ESC로 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (modal && !modal.hidden) closeModal();
    else if (overlay && !overlay.hidden) closeOverlay();
  });

  /* ---------- 문의 링크 연결 ---------- */
  function initLinks() {
    document.querySelectorAll('[data-inquiry-link="soop"]').forEach(function (a) {
      a.setAttribute("href", INQUIRY_URL);
    });
    document.querySelectorAll('[data-inquiry-link="kakao"]').forEach(function (a) {
      a.setAttribute("href", KAKAO_URL);
    });
  }

  /* ---------- 시작 ---------- */
  function start() {
    try {
      renderArtist();
      renderCards();
      initNav();
      initLinks();
      initReveal();
    } catch (err) {
      // 데이터에 실수가 있어도 페이지 전체가 멈추지 않도록 합니다.
      console.error("[붓잽이] 화면을 그리는 중 문제가 발생했습니다:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
