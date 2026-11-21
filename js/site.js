/* Shared behaviour: navigation, credential switches, price, reviews, cookies, contact links. */
(function () {
  var cfg = window.SITE_CONFIG || {};
  var root = document.documentElement.getAttribute("data-root") || ".";

  function abs(path) {
    return root === "." ? path : root + "/" + path;
  }

  function qs(sel, scope) { return (scope || document).querySelector(sel); }
  function qsa(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  var toggle = qs("[data-nav-toggle]");
  var panel = qs("#nav-panel");
  if (toggle && panel) {
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  var showMs = !cfg.features || cfg.features.showMicrosoftNaming !== false;
  var showLg = !!(cfg.features && cfg.features.showLetsGo === true);
  qsa('[data-ms="on"]').forEach(function (el) { el.hidden = !showMs; });
  qsa('[data-ms="off"]').forEach(function (el) { el.hidden = showMs; });
  qsa('[data-flag="microsoft"]').forEach(function (el) { el.hidden = !showMs; });
  qsa('[data-flag="letsgo"]').forEach(function (el) { el.hidden = !showLg; });
  qsa("[data-letsgo-href]").forEach(function (el) {
    if (cfg.letsgo && cfg.letsgo.profileUrl) el.href = cfg.letsgo.profileUrl;
  });

  var year = qs("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  function applyContact() {
    var email = cfg.business && cfg.business.email;
    var phone = cfg.business && cfg.business.phoneE164;
    qsa("[data-email-link]").forEach(function (el) {
      if (!email) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.href = "mailto:" + email;
      if (!el.getAttribute("data-keep-label")) el.textContent = email;
    });
    qsa("[data-whatsapp-link]").forEach(function (el) {
      if (!phone) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.href = "https://wa.me/" + phone;
    });
    qsa("[data-email-missing]").forEach(function (el) { el.hidden = !!email; });
    var photo = cfg.business && cfg.business.photo;
    var portrait = qs("[data-portrait]");
    if (portrait && photo) {
      portrait.textContent = "";
      var img = document.createElement("img");
      img.src = abs(photo);
      img.alt = (cfg.business && cfg.business.photoAlt) || "Jordana Young";
      portrait.appendChild(img);
    }
    var vat = cfg.business && cfg.business.vatNote;
    if (vat) {
      qsa("[data-vat-note]").forEach(function (el) { el.textContent = vat; });
    }
    var cancel = cfg.business && cfg.business.cancellationNote;
    if (cancel) {
      qsa("[data-cancellation-note]").forEach(function (el) { el.textContent = cancel; });
    }
    var list = qs("[data-processors]");
    var processors = (cfg.business && cfg.business.processors) || [];
    if (list && processors.length) {
      list.textContent = "";
      processors.forEach(function (item) {
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        strong.textContent = item.name || "Tool";
        li.appendChild(strong);
        li.appendChild(document.createTextNode(". " + (item.purpose || "")));
        list.appendChild(li);
      });
    }
  }
  applyContact();

  function endpointUrl(key) {
    if (key === "cohortWaitlist") return cfg.cohortWaitlistEndpoint || "";
    return (cfg.endpoints && cfg.endpoints[key]) || "";
  }

  function endpointReady(key) {
    var url = endpointUrl(key);
    if (!url) return false;
    if (/placeholder|example\.com|your-form/i.test(url)) return false;
    return true;
  }

  window.SiteHelpers = {
    root: root,
    abs: abs,
    cfg: cfg,
    endpointReady: endpointReady,
    endpointUrl: endpointUrl
  };

  var logic = window.SiteLogic;
  var inventoryPromise = null;

  function loadJson(url) {
    return fetch(url, { cache: "no-store" }).then(function (res) {
      if (!res.ok) throw new Error("Could not load " + url);
      return res.json();
    });
  }

  function loadInventory() {
    if (!inventoryPromise) {
      inventoryPromise = (cfg.inventoryLiveUrl
        ? loadJson(cfg.inventoryLiveUrl).catch(function () { return null; })
        : Promise.resolve(null)
      ).then(function (live) {
        if (live && Array.isArray(live.tiers)) return live;
        return loadJson(abs("data/inventory.json"));
      });
    }
    return inventoryPromise;
  }

  window.SiteHelpers.loadInventory = loadInventory;
  window.SiteHelpers.loadJson = loadJson;

  function renderPrice(data) {
    var state = logic.priceState(data.sold, data.tiers);
    qsa("[data-price-amount]").forEach(function (el) {
      el.textContent = state.soldOut ? "Sold out" : logic.formatIls(state.priceIls);
    });
    qsa("[data-price-left]").forEach(function (el) { el.textContent = logic.leftLine(state); });
    qsa("[data-price-next]").forEach(function (el) { el.textContent = logic.nextLine(state); });
    qsa("[data-price-status]").forEach(function (el) {
      el.textContent = state.soldOut
        ? "This release is sold out."
        : logic.leftLine(state) + " " + logic.nextLine(state);
    });
    qsa("[data-price-sold]").forEach(function (el) {
      el.textContent = state.sold + " of " + state.total + " sessions sold in this release.";
    });
    qsa("[data-when='available']").forEach(function (el) { el.hidden = state.soldOut; });
    qsa("[data-when='soldout']").forEach(function (el) { el.hidden = !state.soldOut; });
    qsa("[data-price-ladder]").forEach(function (list) {
      list.textContent = "";
      var start = 1;
      data.tiers.forEach(function (tier, index) {
        var slots = Number(tier.slots || 0);
        var end = start + slots - 1;
        var li = document.createElement("li");
        if (!state.soldOut && index === state.bandIndex) li.className = "is-current";
        else if (index < state.bandIndex) li.className = "is-past";
        var range = document.createElement("span");
        range.className = "ladder-range";
        range.textContent = "Sessions " + start + " to " + end;
        var price = document.createElement("span");
        price.className = "ladder-price";
        price.textContent = logic.formatIls(tier.priceIls);
        var label = document.createElement("span");
        label.className = "ladder-state";
        if (state.soldOut || index < state.bandIndex) label.textContent = "Sold";
        else if (index === state.bandIndex) label.textContent = "Current price";
        else label.textContent = "Opens after the current step sells out";
        li.appendChild(range);
        li.appendChild(price);
        li.appendChild(label);
        list.appendChild(li);
        start = end + 1;
      });
    });
    document.documentElement.setAttribute("data-sold-out", state.soldOut ? "true" : "false");
    return state;
  }

  if (logic && (qs("[data-price-amount]") || qs("[data-when]") || qs("[data-price-ladder]"))) {
    loadInventory().then(renderPrice).catch(function () {
      qsa("[data-price-status]").forEach(function (el) {
        el.textContent = "I could not load the current price. Use the contact form and I will tell you how many sessions are left.";
      });
      qsa("[data-price-left]").forEach(function (el) {
        el.textContent = "Price unavailable just now.";
      });
    });
  }

  function renderReviews(target) {
    return loadJson(abs("data/reviews.json")).then(function (data) {
      var all = (data.reviews || []).filter(function (review) {
        return review && review.approved === true && review.sample !== true;
      });
      target.textContent = "";
      if (!all.length) {
        var empty = document.createElement("div");
        empty.className = "empty";
        var p = document.createElement("p");
        p.textContent = "Reviews from students will appear here after a session, once I have read them and the student has agreed to publish. I do not publish sample quotes.";
        var a = document.createElement("a");
        a.href = abs("review.html");
        a.textContent = "Leave a review";
        empty.appendChild(p);
        empty.appendChild(a);
        target.appendChild(empty);
        return all;
      }
      var sum = all.reduce(function (total, review) { return total + Number(review.rating || 0); }, 0);
      var average = Math.round((sum / all.length) * 10) / 10;
      var summary = document.createElement("p");
      summary.className = "review-meta";
      summary.textContent = average + " out of 5, from " + all.length + (all.length === 1 ? " published review." : " published reviews.");
      target.appendChild(summary);
      if (!document.getElementById("review-schema")) {
      var schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: "Jordana Young AI teaching",
        url: (cfg.siteUrl || "") + "/",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: String(average),
          reviewCount: String(all.length),
          bestRating: "5",
          worstRating: "1"
        },
        review: all.map(function (review) {
          return {
            "@type": "Review",
            author: { "@type": "Person", name: review.displayName || "Student" },
            reviewBody: review.text || "",
            datePublished: review.date || undefined,
            reviewRating: {
              "@type": "Rating",
              ratingValue: String(review.rating || ""),
              bestRating: "5",
              worstRating: "1"
            }
          };
        })
      };
      var schemaScript = document.createElement("script");
      schemaScript.id = "review-schema";
      schemaScript.type = "application/ld+json";
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
    }
    all.forEach(function (review) {
        var article = document.createElement("article");
        article.className = "review";
        var stars = document.createElement("p");
        stars.className = "stars";
        stars.setAttribute("aria-hidden", "true");
        var rating = Math.max(0, Math.min(5, Math.round(Number(review.rating || 0))));
        stars.textContent = "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
        var sr = document.createElement("p");
        sr.className = "visually-hidden";
        sr.textContent = rating + " out of 5";
        var quote = document.createElement("blockquote");
        var quoteP = document.createElement("p");
        quoteP.textContent = review.text || "";
        quote.appendChild(quoteP);
        var meta = document.createElement("p");
        meta.className = "review-meta";
        var bits = [review.displayName || "Student", review.sessionType || "", review.date || ""].filter(Boolean);
        meta.textContent = bits.join(" · ");
        article.appendChild(stars);
        article.appendChild(sr);
        article.appendChild(quote);
        article.appendChild(meta);
        target.appendChild(article);
      });
      return all;
    }).catch(function () {
      target.textContent = "Reviews could not be loaded just now.";
    });
  }

  qsa("[data-reviews]").forEach(renderReviews);

  var banner = qs("#cookie-banner");
  var analytics = cfg.analytics || {};
  var consentKey = "jyt_analytics";
  function loadAnalytics() {
    if (!analytics.enabled || !analytics.src) return;
    if (document.getElementById("analytics-script")) return;
    var script = document.createElement("script");
    script.id = "analytics-script";
    script.src = analytics.src;
    script.defer = true;
    var dataset = analytics.dataset || {};
    Object.keys(dataset).forEach(function (key) { script.dataset[key] = dataset[key]; });
    document.head.appendChild(script);
  }
  if (banner && analytics.enabled) {
    var existing = null;
    try { existing = localStorage.getItem(consentKey); } catch (err) { existing = null; }
    if (existing === "accept") {
      banner.hidden = true;
      loadAnalytics();
    } else if (existing === "reject") {
      banner.hidden = true;
    } else {
      banner.hidden = false;
    }
    var accept = qs("#cookie-accept");
    var reject = qs("#cookie-reject");
    if (accept) {
      accept.addEventListener("click", function () {
        try { localStorage.setItem(consentKey, "accept"); } catch (err) { /* storage blocked */ }
        banner.hidden = true;
        loadAnalytics();
      });
    }
    if (reject) {
      reject.addEventListener("click", function () {
        try { localStorage.setItem(consentKey, "reject"); } catch (err) { /* storage blocked */ }
        banner.hidden = true;
      });
    }
  }
})();
