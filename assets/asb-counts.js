/* Arcade Side B archive totals — derived from the published directory cards. */
(function () {
  "use strict";
  var fallback = { companies: 18, games: 13 };

  function countCards(html, selector) {
    var doc = new DOMParser().parseFromString(html, "text/html");
    return doc.querySelectorAll(selector).length;
  }

  function render(kind, value) {
    document.querySelectorAll('[data-archive-count="' + kind + '"]').forEach(function (node) {
      node.textContent = String(value);
    });
  }

  function update() {
    render("companies", fallback.companies);
    render("games", fallback.games);

    Promise.all([
      fetch("companies.html", { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : ""; }),
      fetch("games.html", { cache: "no-store" }).then(function (r) { return r.ok ? r.text() : ""; })
    ]).then(function (pages) {
      var companies = pages[0] ? countCards(pages[0], ".company-card") : fallback.companies;
      var games = pages[1] ? countCards(pages[1], ".game-card") : fallback.games;
      render("companies", companies || fallback.companies);
      render("games", games || fallback.games);
    }).catch(function () {
      /* The visible fallback already contains the last published totals. */
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
}());
