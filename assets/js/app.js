// app.js
// Reads data from: window.WIKI_LOVES_DATA (defined in data.js)
// Theme: <html data-theme="dark|light">
// Language: <html lang=".."> + <html dir="ltr|rtl">

window.page = function page() {
  const I18N = {
    en: {
      title: "Iranian Wikimedians Group Stats",
      language: "Language",
      navigate: "Navigate",
      actions: "Actions",
      expandAll: "Expand all",
      collapseAll: "Collapse all",
      overall: "Overall",
      allCombined: "All competitions combined.",
      years: "Years",
      uploads: "Uploads",
      uploaders: "Uploaders",
      usedInWikis: "Used in wikis",
      avgUsed: "Avg used",
      avgNewcomers: "Avg newcomers",
      bestYear: "Best year",
      peak: "Peak",
      topComp: "Top comp",
      uploadsOverTime: "Uploads over time",
      hoverBars: "Hover bars for details",
      overallConversion: "Overall conversion",
      conversion: "Conversion",
      averages: "Averages",
      avgRate: "Avg rate",
      totalUsed: "Total used",
      totalUploads: "Total uploads",
      newcomers: "Newcomers",
      avgShare: "Avg share",
      yearlyUploads: "Yearly uploads",
      used: "Used",
      offlineReport: "Offline report",
      source: "Source",
      error: "Error:",
      switchToLight: "Switch to Light",
      switchToDark: "Switch to Night",
    },
    de: {
      title: "Statistiken der iranischen Wikimedianer-Gruppe",
      language: "Sprache",
      navigate: "Navigation",
      actions: "Aktionen",
      expandAll: "Alle öffnen",
      collapseAll: "Alle schließen",
      overall: "Gesamt",
      allCombined: "Alle Wettbewerbe zusammen.",
      years: "Jahre",
      uploads: "Uploads",
      uploaders: "Uploader",
      usedInWikis: "In Wikis verwendet",
      avgUsed: "Ø verwendet",
      avgNewcomers: "Ø Neulinge",
      bestYear: "Bestes Jahr",
      peak: "Spitze",
      topComp: "Top-Wettbewerb",
      uploadsOverTime: "Uploads im Zeitverlauf",
      hoverBars: "Für Details Balken berühren",
      overallConversion: "Gesamt-Konversion",
      conversion: "Konversion",
      averages: "Durchschnitte",
      avgRate: "Ø Rate",
      totalUsed: "Insgesamt verwendet",
      totalUploads: "Insgesamt Uploads",
      newcomers: "Neulinge",
      avgShare: "Ø Anteil",
      yearlyUploads: "Jährliche Uploads",
      used: "Verwendet",
      offlineReport: "Offline-Bericht",
      source: "Quelle",
      error: "Fehler:",
      switchToLight: "Zu Hell wechseln",
      switchToDark: "Zu Nacht wechseln",
    },
    fa: {
      title: "آمار گروه ویکی‌مدین‌های ایرانی",
      language: "زبان",
      navigate: "راهنما",
      actions: "اقدامات",
      expandAll: "باز کردن همه",
      collapseAll: "بستن همه",
      overall: "کلی",
      allCombined: "مجموع همه مسابقات.",
      years: "سال‌ها",
      uploads: "بارگذاری‌ها",
      uploaders: "بارگذاران",
      usedInWikis: "استفاده‌شده در ویکی‌ها",
      avgUsed: "میانگین استفاده",
      avgNewcomers: "میانگین تازه‌واردها",
      bestYear: "بهترین سال",
      peak: "اوج",
      topComp: "برترین مسابقه",
      uploadsOverTime: "بارگذاری‌ها در گذر زمان",
      hoverBars: "برای جزئیات روی ستون‌ها بروید",
      overallConversion: "نرخ تبدیل کلی",
      conversion: "تبدیل",
      averages: "میانگین‌ها",
      avgRate: "میانگین نرخ",
      totalUsed: "کل استفاده‌شده",
      totalUploads: "کل بارگذاری‌ها",
      newcomers: "تازه‌واردها",
      avgShare: "میانگین سهم",
      yearlyUploads: "بارگذاری سالانه",
      used: "استفاده‌شده",
      offlineReport: "گزارش آفلاین",
      source: "منبع",
      error: "خطا:",
      switchToLight: "تغییر به روشن",
      switchToDark: "تغییر به تاریک",
    }
  };

  // Competition name translations by slug.
  const COMP_NAMES = {
    en: {
      earth: "Wiki Loves Earth",
      folklore: "Wiki Loves Folklore",
      monuments: "Wiki Loves Monuments",
      science: "Wiki Science Competition",
    },
    de: {
      earth: "Wiki Loves Earth (Erde)",
      folklore: "Wiki Loves Folklore (Volkskunde)",
      monuments: "Wiki Loves Monuments (Denkmäler)",
      science: "Wiki Science Competition (Wissenschaft)",
    },
    fa: {
      earth: "ویکی دوستدار زمین",
      folklore: "ویکی دوستدار فرهنگ عامه",
      monuments: "ویکی دوستدار بناهای تاریخی",
      science: "مسابقه ویکی‌علم",
    }
  };

  return {
    window,

    ready: false,
    errorMsg: "",
    data: null,

    theme: "dark",
    lang: "en",

    activeId: "overall",

    competitions: [],
    overall: {
      metrics: {
        peak: { year: "—", uploads: 0 },
        bestNewcomer: { year: "—", percent: 0 },
        topCompetitionByUploads: { slug: "—", uploads: 0 },
        totalUploads: 0,
        totalUploaders: 0,
        totalUsedCount: 0,
        totalNewcomers: 0,
        avgUsedPercent: 0,
        avgNewPercent: 0
      },
      series: [],
      spark: { linePath: "", areaPath: "" },
      range: "—",
      anim: { uploads: "0", uploaders: "0", used: "0", newPct: "0%" },
      animatedDone: false,
    },

    init() {
      try {
        const savedTheme = localStorage.getItem("wl_theme");
        this.theme = (savedTheme === "light" || savedTheme === "dark") ? savedTheme : "dark";
        this.applyTheme();

        const savedLang = localStorage.getItem("wl_lang");
        this.lang = (savedLang && I18N[savedLang]) ? savedLang : "en";
        this.applyLang();

        this.data = window.WIKI_LOVES_DATA || null;
        if (!this.data) throw new Error("Missing data: window.WIKI_LOVES_DATA is not defined. Check data.js is included before app.js.");

        this.buildModels();
        this.ready = true;

        this.$nextTick(() => {
          this.updateHeaderOffset();
          window.addEventListener("resize", () => this.updateHeaderOffset());

          this.setupScrollSpy();
          this.setupAnimations();
          this.animateOverall();

          this.$nextTick(() => this.updateHeaderOffset());
        });
      } catch (e) {
        this.errorMsg = String(e?.message ?? e);
      }
    },

    // i18n
    t(key) {
      return (I18N[this.lang] && I18N[this.lang][key]) || I18N.en[key] || key;
    },

    setLang(l) {
      if (!I18N[l]) return;
      this.lang = l;
      localStorage.setItem("wl_lang", this.lang);
      this.applyLang();

      document.title =
        this.lang === "fa" ? "اینفوگرافیک ویکی لاوز — ایران"
        : this.lang === "de" ? "Wiki Loves — Iran Infografik"
        : "Wiki Loves — Iran Infographic";

      this.$nextTick(() => this.updateHeaderOffset());
    },

    applyLang() {
      const dir = (this.lang === "fa") ? "rtl" : "ltr";
      document.documentElement.setAttribute("lang", this.lang);
      document.documentElement.setAttribute("dir", dir);
    },

    compNameBySlug(slug, fallbackOriginalName = "") {
      const langMap = COMP_NAMES[this.lang] || COMP_NAMES.en;
      return langMap?.[slug] || COMP_NAMES.en?.[slug] || fallbackOriginalName || slug || "—";
    },

    compLabel(c) {
      return this.compNameBySlug(c?.slug, c?.originalName || c?.name || "");
    },

    badgeText(name) {
      const s = String(name || "").trim();
      if (!s) return "•";
      const parts = s.split(/\s+/).filter(Boolean);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      const chars = Array.from(s);
      return (chars.slice(0, 2).join("")).toUpperCase();
    },

    // Theme
    toggleTheme() {
      this.theme = this.theme === "dark" ? "light" : "dark";
      localStorage.setItem("wl_theme", this.theme);
      this.applyTheme();
    },

    applyTheme() {
      document.documentElement.setAttribute("data-theme", this.theme);
    },

    updateHeaderOffset() {
      const header = document.getElementById("stickyHeader");
      const h = header ? Math.ceil(header.getBoundingClientRect().height) : 88;
      document.documentElement.style.setProperty("--header-offset", `${h + 12}px`);
    },

    // Build models
    buildModels() {
      const comps = (this.data?.competitions ?? []).map((c) => {
        const rows = this.normalizeCompetition(c);
        const series = this.makeSeries(rows);
        const metrics = this.computeMetrics(rows, c.slug, c.name);
        const spark = this.makeSpark(series);
        const range = this.yearRange(series.map((s) => s.year));

        const anim = {
          uploads: this.fmtInt(metrics.totalUploads),
          uploaders: this.fmtInt(metrics.totalUploaders),
          used: this.fmtInt(metrics.totalUsedCount),
          newPct: `${Math.round(metrics.avgNewPercent)}%`,
        };

        return {
          originalName: c.name,
          name: c.name,
          slug: c.slug,
          open: true,
          rows,
          series,
          metrics,
          spark,
          range,
          anim,
          animatedDone: false,
        };
      });

      this.competitions = comps;

      const allRows = comps.flatMap((c) => c.rows);
      this.overall.series = this.makeSeries(allRows);
      this.overall.metrics = this.computeMetrics(allRows, "all", "All competitions");
      this.overall.spark = this.makeSpark(this.overall.series);
      this.overall.range = this.yearRange(this.overall.series.map((s) => s.year));

      this.overall.anim.uploads = this.fmtInt(this.overall.metrics.totalUploads);
      this.overall.anim.uploaders = this.fmtInt(this.overall.metrics.totalUploaders);
      this.overall.anim.used = this.fmtInt(this.overall.metrics.totalUsedCount);
      this.overall.anim.newPct = `${Math.round(this.overall.metrics.avgNewPercent)}%`;
      this.overall.animatedDone = false;
    },

    normalizeCompetition(comp) {
      return (comp.years ?? [])
        .map((y) => ({
          slug: comp.slug,
          competition: comp.name,
          year: Number(y.year),
          uploads: Number(y.uploads ?? 0),
          usedCount: Number(y.imagesUsedInWikis?.count ?? 0),
          usedPercent: Number(y.imagesUsedInWikis?.percent ?? 0),
          uploaders: Number(y.uploaders ?? 0),
          newCount: Number(y.uploadersRegisteredAfterStart?.count ?? 0),
          newPercent: Number(y.uploadersRegisteredAfterStart?.percent ?? 0),
        }))
        .sort((a, b) => a.year - b.year);
    },

    makeSeries(rows) {
      const byYear = new Map();
      for (const r of rows ?? []) {
        const cur =
          byYear.get(r.year) ?? {
            year: r.year,
            uploads: 0,
            usedCount: 0,
            usedPercentSum: 0,
            usedPercentN: 0,
            uploaders: 0,
            newCount: 0,
            newPercentSum: 0,
            newPercentN: 0,
          };

        cur.uploads += r.uploads;
        cur.usedCount += r.usedCount;
        cur.usedPercentSum += r.usedPercent;
        cur.usedPercentN += 1;

        cur.uploaders += r.uploaders;
        cur.newCount += r.newCount;
        cur.newPercentSum += r.newPercent;
        cur.newPercentN += 1;

        byYear.set(r.year, cur);
      }

      return [...byYear.values()]
        .sort((a, b) => a.year - b.year)
        .map((x) => ({
          year: x.year,
          uploads: x.uploads,
          usedCount: x.usedCount,
          usedPercent: x.usedPercentN ? x.usedPercentSum / x.usedPercentN : 0,
          uploaders: x.uploaders,
          newCount: x.newCount,
          newPercent: x.newPercentN ? x.newPercentSum / x.newPercentN : 0,
        }));
    },

    computeMetrics(rows, slug, name) {
      const totalUploads = (rows ?? []).reduce((a, r) => a + r.uploads, 0);
      const totalUploaders = (rows ?? []).reduce((a, r) => a + r.uploaders, 0);
      const totalUsedCount = (rows ?? []).reduce((a, r) => a + r.usedCount, 0);
      const totalNewcomers = (rows ?? []).reduce((a, r) => a + r.newCount, 0);

      const avgUsedPercent = rows?.length ? rows.reduce((a, r) => a + r.usedPercent, 0) / rows.length : 0;
      const avgNewPercent = rows?.length ? rows.reduce((a, r) => a + r.newPercent, 0) / rows.length : 0;

      const peak = (rows ?? []).reduce(
        (best, r) => (r.uploads > (best.uploads ?? -1) ? { year: r.year, uploads: r.uploads } : best),
        { year: "—", uploads: 0 }
      );

      const bestNewcomer = (rows ?? []).reduce(
        (best, r) => (r.newPercent > (best.percent ?? -1) ? { year: r.year, percent: r.newPercent } : best),
        { year: "—", percent: 0 }
      );

      let topCompetitionByUploads = { slug, uploads: totalUploads };

      if (slug === "all") {
        const byComp = new Map();
        for (const r of rows ?? []) byComp.set(r.slug, (byComp.get(r.slug) ?? 0) + r.uploads);

        topCompetitionByUploads = { slug: "—", uploads: 0 };
        for (const [s, uploads] of byComp.entries()) {
          if (uploads > topCompetitionByUploads.uploads) topCompetitionByUploads = { slug: s, uploads };
        }
      }

      return {
        totalUploads,
        totalUploaders,
        totalUsedCount,
        totalNewcomers,
        avgUsedPercent,
        avgNewPercent,
        peak,
        bestNewcomer,
        topCompetitionByUploads,
      };
    },

    makeSpark(series) {
      if (!series?.length) return { linePath: "", areaPath: "" };
      const W = 1000, H = 200, pad = 18;

      const ys = series.map((s) => s.uploads);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const rangeY = Math.max(1, maxY - minY);

      const xScale = (i) => pad + (i / Math.max(1, series.length - 1)) * (W - pad * 2);
      const yScale = (v) => H - pad - ((v - minY) / rangeY) * (H - pad * 2);

      const points = series.map((s, i) => ({ x: xScale(i), y: yScale(s.uploads) }));
      const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
      const areaPath = `${linePath} L ${points.at(-1).x} ${H - pad} L ${points[0].x} ${H - pad} Z`;
      return { linePath, areaPath };
    },

    setupScrollSpy() {
      const els = [...document.querySelectorAll("[data-section]")];
      if (!els.length) return;

      const obs = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) this.activeId = visible[0].target.getAttribute("data-section");
        },
        { threshold: 0.18 }
      );

      els.forEach((el) => obs.observe(el));
    },

    setupAnimations() {
      const overallEl = document.getElementById("overall");
      if (overallEl) {
        const obs = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) this.animateOverall();
          },
          { threshold: 0.35 }
        );
        obs.observe(overallEl);
      }

      const compEls = [...document.querySelectorAll('article[id^="comp-"]')];
      const compObs = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const slug = e.target.id.replace("comp-", "");
            const c = this.competitions.find((x) => x.slug === slug);
            if (c && !c.animatedDone) this.animateCompetition(c);
          }
        },
        { threshold: 0.25 }
      );

      compEls.forEach((el) => compObs.observe(el));
      this.triggerVisibleNow();
    },

    triggerVisibleNow() {
      const o = document.getElementById("overall");
      if (o) {
        const r = o.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85 && r.bottom > 0) this.animateOverall();
      }

      for (const el of document.querySelectorAll('article[id^="comp-"]')) {
        const r = el.getBoundingClientRect();
        const inView = r.top < window.innerHeight * 0.85 && r.bottom > 0;
        if (!inView) continue;

        const slug = el.id.replace("comp-", "");
        const c = this.competitions.find((x) => x.slug === slug);
        if (c && !c.animatedDone) this.animateCompetition(c);
      }
    },

    animateOverall() {
      if (this.overall.animatedDone) return;
      this.overall.animatedDone = true;

      this.tweenNumber(0, this.overall.metrics.totalUploads, 900, (v) => (this.overall.anim.uploads = this.fmtInt(v)));
      this.tweenNumber(0, this.overall.metrics.totalUploaders, 900, (v) => (this.overall.anim.uploaders = this.fmtInt(v)));
      this.tweenNumber(0, this.overall.metrics.totalUsedCount, 900, (v) => (this.overall.anim.used = this.fmtInt(v)));
      this.tweenNumber(0, Math.round(this.overall.metrics.avgNewPercent), 900, (v) => (this.overall.anim.newPct = `${v}%`));
    },

    animateCompetition(c) {
      c.animatedDone = true;

      this.tweenNumber(0, c.metrics.totalUploads, 850, (v) => (c.anim.uploads = this.fmtInt(v)));
      this.tweenNumber(0, c.metrics.totalUploaders, 850, (v) => (c.anim.uploaders = this.fmtInt(v)));
      this.tweenNumber(0, c.metrics.totalUsedCount, 850, (v) => (c.anim.used = this.fmtInt(v)));
      this.tweenNumber(0, Math.round(c.metrics.avgNewPercent), 850, (v) => (c.anim.newPct = `${v}%`));
    },

    tweenNumber(from, to, durationMs, onUpdate) {
      const start = performance.now();
      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const p = Math.min(1, (now - start) / durationMs);
        const v = Math.round(from + (to - from) * easeOutCubic(p));
        onUpdate(v);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    },

    expandAll() { this.competitions.forEach((c) => (c.open = true)); },
    collapseAll() { this.competitions.forEach((c) => (c.open = false)); },

    jumpTo(hash) {
      if (!hash) return;
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    fmtInt(n) { return new Intl.NumberFormat().format(Number(n ?? 0)); },
    fmtPct(p) { return `${Math.round(Number(p ?? 0))}%`; },

    yearRange(years) {
      if (!years?.length) return "—";
      const ys = [...years].sort((a, b) => a - b);
      return ys[0] === ys.at(-1) ? String(ys[0]) : `${ys[0]}–${ys.at(-1)}`;
    },

    donutDash(percent) {
      const C = 2 * Math.PI * 40;
      const clamped = Math.max(0, Math.min(100, Number(percent ?? 0)));
      const filled = (clamped / 100) * C;
      return `${filled} ${C - filled}`;
    },

    barHeight(value, series) {
      const max = Math.max(...(series ?? []).map((s) => s.uploads), 1);
      const v = Number(value ?? 0);
      return 20 + (v / max) * 140;
    },
  };
};
