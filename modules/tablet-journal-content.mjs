import {TABLET_CATALOG} from "./tablet-catalog.mjs";
import {POWER_FAMILY_ICON_BY_ID} from "./tablet-power-families.mjs";
import {deterministicId} from "./skill-pack-data.mjs";

const SYSTEM_ID = "trudvang-chronicles";
const RELIGION_ORDER = ["gerbanis", "ealdTradition", "tenetNid", "haminges", "joaringFaith"];

const escape = value => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const plural = (count, singular, pluralForm) => `${count} ${count === 1 ? singular : pluralForm}`;

function link(uuid, label) {
  return `@UUID[${uuid}]{${escape(label)}}`;
}

function packFor(tablet, language) {
  return `Compendium.${SYSTEM_ID}.${tablet.tabletType === "vitner" ? "vitner" : "religion"}-${language}`;
}

function tabletPage(tablet, language) {
  return language === "fr" ? tablet.pageFr : tablet.page;
}

export function tabletListJournalHtml({localize, language = "en"} = {}) {
  if (typeof localize !== "function") throw new Error("tabletListJournalHtml requires a localize callback");
  const lang = String(language).toLowerCase().startsWith("fr") ? "fr" : "en";
  const text = (key, fallback = "") => {
    const value = localize(`TRUDVANG.Content.Journal.tabletList.${key}`);
    return value && value !== `TRUDVANG.Content.Journal.tabletList.${key}` ? value : fallback;
  };
  const tabletName = tablet => {
    const key = `TRUDVANG.Content.Tablet.${tablet.id}.Name`;
    const value = localize(key);
    return value && value !== key ? value : tablet.name;
  };
  const tabletSummary = tablet => {
    const key = `TRUDVANG.Content.Tablet.${tablet.id}.Summary`;
    const value = localize(key);
    return value && value !== key ? value : "";
  };
  const powerName = power => {
    const key = `TRUDVANG.Content.Power.${power.id}.Name`;
    const value = localize(key);
    return value && value !== key ? value : power.name;
  };
  const religionName = religion => {
    const key = `TRUDVANG.Content.Journal.${religion}.Name`;
    const value = localize(key);
    return value && value !== key ? value : religion;
  };
  const tabletCount = count => plural(count, text("Tablet", "tablet"), text("Tablets", "tablets"));
  const powerCount = count => plural(count, text("Power", "power"), text("Powers", "powers"));
  const levelPrefix = text("Level", "L");
  const pageLabel = text("Page", "p.");

  const byName = (a, b) => tabletName(a).localeCompare(tabletName(b), lang);

  const sacred = TABLET_CATALOG
    .filter(tablet => tablet.tabletType === "holy" && RELIGION_ORDER.includes(tablet.religion));
  const vitner = TABLET_CATALOG.filter(tablet => tablet.tabletType === "vitner");
  const elven = TABLET_CATALOG.filter(tablet => tablet.religion === "toikalokke");
  const runes = TABLET_CATALOG.filter(tablet => tablet.religion === "thuuldom");

  const tabletSection = (tablet, heading) => {
    const name = tabletName(tablet);
    const summary = tabletSummary(tablet);
    const uuid = `${packFor(tablet, lang)}.Item.${deterministicId(`tablet:${tablet.id}`)}`;
    const powers = tablet.powers.map(power => {
      const icon = POWER_FAMILY_ICON_BY_ID.get(power.id) ?? "fa-wand-magic-sparkles";
      const powerUuid = `${packFor(tablet, lang)}.Item.${deterministicId(`power:${power.id}`)}`;
      return `<li><span class="tablet-journal-level">${escape(levelPrefix)}${power.level}</span><i class="fas ${icon}" aria-hidden="true"></i>${link(powerUuid, powerName(power))}</li>`;
    }).join("");
    return `<section class="tablet-journal-tablet" id="tablet-${escape(tablet.id)}">
      <h${heading}>${link(uuid, name)}</h${heading}>
      <p class="tablet-journal-meta">${powerCount(tablet.powers.length)} · ${escape(pageLabel)} ${escape(tabletPage(tablet, lang))}</p>
      ${summary ? `<p class="tablet-journal-summary">${escape(summary)}</p>` : ""}
      <details class="tablet-journal-powers-block">
        <summary>${escape(text("PowersHeading", "Powers"))} (${tablet.powers.length})</summary>
        <ul class="tablet-journal-powers">${powers}</ul>
      </details>
    </section>`;
  };

  const groupSection = (id, title, tablets, {religion = false} = {}) => {
    const tabletsHtml = [...tablets].sort(byName).map(tablet => tabletSection(tablet, religion ? 4 : 3)).join("");
    const totalPowers = tablets.reduce((sum, tablet) => sum + tablet.powers.length, 0);
    return `<section class="tablet-journal-group" id="group-${escape(id)}">
      <h2>${escape(title)}</h2>
      <p class="tablet-journal-meta">${tabletCount(tablets.length)} · ${powerCount(totalPowers)}</p>
      ${tabletsHtml}
      <p class="tablet-journal-back"><a href="#tablet-journal-toc">${escape(text("BackToContents", "Back to contents"))}</a></p>
    </section>`;
  };

  const sacredSections = RELIGION_ORDER.map(religion => {
    const tablets = sacred.filter(tablet => tablet.religion === religion);
    const totalPowers = tablets.reduce((sum, tablet) => sum + tablet.powers.length, 0);
    const title = religionName(religion);
    return `<section class="tablet-journal-religion" id="group-${escape(religion)}">
      <h3>${escape(title)}</h3>
      <p class="tablet-journal-meta">${tabletCount(tablets.length)} · ${powerCount(totalPowers)}</p>
      ${[...tablets].sort(byName).map(tablet => tabletSection(tablet, 4)).join("")}
    </section>`;
  }).join("");

  const toc = `<nav class="tablet-journal-toc" id="tablet-journal-toc">
    <h2>${escape(text("Contents", "Contents"))}</h2>
    <ul>
      <li><a href="#group-sacred">${escape(text("Sacred", "Sacred tablets"))}</a>
        <ul>${RELIGION_ORDER.map(religion => {
          const tablets = sacred.filter(tablet => tablet.religion === religion);
          const totalPowers = tablets.reduce((sum, tablet) => sum + tablet.powers.length, 0);
          return `<li><a href="#group-${escape(religion)}">${escape(religionName(religion))}</a> <span class="tablet-journal-count">${tabletCount(tablets.length)} · ${powerCount(totalPowers)}</span></li>`;
        }).join("")}</ul>
      </li>
      <li><a href="#group-vitner">${escape(text("Vitner", "Vitner tablets"))}</a> <span class="tablet-journal-count">${tabletCount(vitner.length)} · ${powerCount(vitner.reduce((sum, tablet) => sum + tablet.powers.length, 0))}</span></li>
      <li><a href="#group-elf">${escape(text("Elf", "Elven tablets"))}</a> <span class="tablet-journal-count">${tabletCount(elven.length)} · ${powerCount(elven.reduce((sum, tablet) => sum + tablet.powers.length, 0))}</span></li>
      <li><a href="#group-rune">${escape(text("Rune", "Dwarven runes"))}</a> <span class="tablet-journal-count">${tabletCount(runes.length)} · ${powerCount(runes.reduce((sum, tablet) => sum + tablet.powers.length, 0))}</span></li>
    </ul>
  </nav>`;

  return `<article class="trudvang-tablet-journal">
    <p class="tablet-journal-intro">${escape(text("Intro", ""))}</p>
    ${toc}
    <section class="tablet-journal-sacred" id="group-sacred">
      <h2>${escape(text("Sacred", "Sacred tablets"))}</h2>
      <p class="tablet-journal-meta">${tabletCount(sacred.length)} · ${powerCount(sacred.reduce((sum, tablet) => sum + tablet.powers.length, 0))}</p>
      ${sacredSections}
      <p class="tablet-journal-back"><a href="#tablet-journal-toc">${escape(text("BackToContents", "Back to contents"))}</a></p>
    </section>
    ${groupSection("vitner", text("Vitner", "Vitner tablets"), vitner)}
    ${groupSection("elf", text("Elf", "Elven tablets"), elven)}
    ${groupSection("rune", text("Rune", "Dwarven runes"), runes)}
  </article>`;
}
