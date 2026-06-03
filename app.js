/* Final Frame Snooker Club — all site behaviour.
   External file so the page can ship a strict CSP (script-src 'self', no 'unsafe-inline'). */
(function () {
  "use strict";

  // Google Fonts were loaded as media="print" (non-render-blocking); switch them on now.
  var gf = document.getElementById("gfonts");
  if (gf) gf.media = "all";

  /* ---------- WhatsApp links ---------- */
  var WHATSAPP_NUMBER = "923155482934";
  var waBase = "https://wa.me/" + WHATSAPP_NUMBER;
  document.getElementById("waFloat").href = waBase + "?text=" + encodeURIComponent("Hi Final Frame! I'd like to book a snooker table.");
  document.getElementById("waFooter").href = waBase;
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById("nav");
  addEventListener("scroll", function () { nav.classList.toggle("scrolled", scrollY > 30); });

  /* ---------- mobile menu ---------- */
  function setMenu(open) {
    document.getElementById("navLinks").classList.toggle("open", open);
    document.getElementById("navBackdrop").classList.toggle("open", open);
    document.getElementById("burger").classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
  }
  function toggleMenu() { setMenu(!document.getElementById("navLinks").classList.contains("open")); }
  function closeMenu() { setMenu(false); }

  document.getElementById("burger").addEventListener("click", toggleMenu);
  document.getElementById("navClose").addEventListener("click", closeMenu);
  document.getElementById("navBackdrop").addEventListener("click", closeMenu);
  document.querySelectorAll(".nav-links > a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- logo fallback (shows wordmark if logo.png is ever missing) ---------- */
  document.querySelectorAll(".brand .logo").forEach(function (img) {
    var fb = img.nextElementSibling;
    function onErr() {
      img.style.display = "none";
      if (!fb) return;
      fb.style.display = "flex";
      var ball = fb.querySelector(".ball");
      if (ball) ball.style.display = "block";
    }
    if (img.complete && img.naturalWidth === 0) onErr();
    else img.addEventListener("error", onErr);
  });

  /* ---------- booking -> WhatsApp ---------- */
  document.getElementById("bookingForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var msg =
      "🎱 *NEW BOOKING — Final Frame Snooker Club*\n\n" +
      "👤 Name: " + v("name") + "\n" +
      "📞 Phone: " + v("phone") + "\n" +
      "📅 Date: " + v("date") + "\n" +
      "🕑 Time: " + v("time") + "\n" +
      "🎯 Table: " + v("table") + "\n" +
      "⏱️ Duration: " + v("duration") + "\n\n" +
      "Please confirm my table. Thank you!";
    // noopener/noreferrer stops the opened tab from controlling this page (reverse tabnabbing)
    window.open(waBase + "?text=" + encodeURIComponent(msg), "_blank", "noopener,noreferrer");
  });

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- date picker: no past dates ---------- */
  document.getElementById("date").min = new Date().toISOString().split("T")[0];

  /* ===================== 3D COVERFLOW + ANIMATED LIGHTBOX ===================== */
  var cards = Array.prototype.slice.call(document.querySelectorAll(".cf-card"));
  if (!cards.length) return;
  var dotsWrap = document.getElementById("cfDots");
  var ghost = document.getElementById("cfGhost");
  var capWrap = document.getElementById("cfCap");
  var capH3 = capWrap.querySelector("h3");
  var capP = capWrap.querySelector("p");
  var idx = 0, timer;

  cards.forEach(function (_, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Go to photo " + (i + 1));
    b.addEventListener("click", function () { go(i); });
    dotsWrap.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function layout() {
    cards.forEach(function (card, i) {
      var off = i - idx;
      var a = Math.abs(off);
      var x = off * 56;
      var z = -a * 200;
      var rot = off === 0 ? 0 : (off < 0 ? 32 : -32);
      var sc = off === 0 ? 1 : Math.max(0.62, 0.82 - (a - 1) * 0.12);
      card.style.transform = "translate(-50%,-50%) translateX(" + x + "%) translateZ(" + z + "px) rotateY(" + rot + "deg) scale(" + sc + ")";
      card.style.opacity = a > 2 ? 0 : 1;
      card.style.zIndex = 10 - a;
      card.style.pointerEvents = a > 2 ? "none" : "auto";
      card.classList.toggle("active", off === 0);
    });
    dots.forEach(function (d, i) { d.classList.toggle("active", i === idx); });
    var c = cards[idx];
    capH3.textContent = c.dataset.title;
    capP.textContent = c.dataset.sub;
    ghost.textContent = String(idx + 1).padStart(2, "0");
    capWrap.classList.remove("swap"); void capWrap.offsetWidth; capWrap.classList.add("swap");
  }
  function go(i) { idx = (i + cards.length) % cards.length; layout(); restart(); }
  function next() { go(idx + 1); }
  function prev() { go(idx - 1); }
  function restart() { clearInterval(timer); timer = setInterval(next, 4500); }

  document.getElementById("cfNext").addEventListener("click", next);
  document.getElementById("cfPrev").addEventListener("click", prev);

  var cf = document.getElementById("cf");
  var down = false, startX = 0, moved = false;

  cards.forEach(function (card, i) {
    card.addEventListener("click", function () {
      if (moved) { moved = false; return; }   // ignore the click that ends a swipe
      if (i === idx) openLB(i); else go(i);
    });
  });

  function startDrag(x) { down = true; startX = x; moved = false; clearInterval(timer); }
  function moveDrag(x) { if (!down) return; if (Math.abs(x - startX) > 60) { (x < startX ? next : prev)(); down = false; moved = true; } }
  function endDrag() { down = false; restart(); }
  cf.addEventListener("mousedown", function (e) { startDrag(e.clientX); });
  cf.addEventListener("mousemove", function (e) { moveDrag(e.clientX); });
  window.addEventListener("mouseup", endDrag);
  cf.addEventListener("touchstart", function (e) { startDrag(e.touches[0].clientX); }, { passive: true });
  cf.addEventListener("touchmove", function (e) { moveDrag(e.touches[0].clientX); }, { passive: true });
  cf.addEventListener("touchend", endDrag);
  cf.addEventListener("mouseenter", function () { clearInterval(timer); });
  cf.addEventListener("mouseleave", restart);

  layout(); restart();

  /* ---- Lightbox (iris reveal + flip-in) ---- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbIdx = 0;

  function showImg(i) {
    lbIdx = (i + cards.length) % cards.length;
    var c = cards[lbIdx], img = c.querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCap.innerHTML = "<b>" + c.dataset.title + "</b>" + c.dataset.sub;
    lbImg.classList.remove("in"); void lbImg.offsetWidth; lbImg.classList.add("in");
  }
  function openLB(i) { showImg(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeLB() { lb.classList.remove("open"); document.body.style.overflow = ""; }

  document.getElementById("lbClose").addEventListener("click", closeLB);
  document.getElementById("lbNext").addEventListener("click", function () { showImg(lbIdx + 1); });
  document.getElementById("lbPrev").addEventListener("click", function () { showImg(lbIdx - 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
  addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLB();
    else if (e.key === "ArrowRight") showImg(lbIdx + 1);
    else if (e.key === "ArrowLeft") showImg(lbIdx - 1);
  });
})();
