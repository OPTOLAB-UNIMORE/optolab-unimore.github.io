/*
 * Faceted filtering for the Publications page.
 *
 * The publication list stays a plain, hand-maintained Markdown list: this script
 * reads the rendered list, derives year / authors / type for every entry and
 * builds the filter controls from what it finds. Adding a publication therefore
 * needs no change here, as long as the entry keeps the IEEE shape used on the
 * page: AUTHORS, "TITLE," [in ]*VENUE*, ..., YEAR, doi: ...
 */
(function () {
  'use strict';

  var MEMBER_SURNAMES = ['Rovati', 'Cattini', 'Gibertoni', 'Cassanelli', 'Gibaldi', 'Goldoni', 'Besozzi'];
  var OPEN_QUOTES = ['“', '"'];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function titleStart(text) {
    for (var i = 0; i < OPEN_QUOTES.length; i++) {
      var at = text.indexOf(', ' + OPEN_QUOTES[i]);
      if (at > -1) return at;
    }
    return -1;
  }

  function parseAuthors(raw) {
    var etAl = /\bet\s+al\.?\s*$/i.test(raw);
    var names = raw
      .replace(/\bet\s+al\.?\s*$/i, '')
      .replace(/\s+and\s+/g, ', ')
      .split(/\s*,\s*/)
      .map(function (name) { return name.replace(/\s+/g, ' ').trim(); })
      .filter(function (name) { return name.length > 1; });
    return { names: names, etAl: etAl };
  }

  function classify(item, venue) {
    var em = item.querySelector('em');
    var before = em && em.previousSibling ? em.previousSibling.textContent : '';
    var inProceedings = /\bin\s*$/.test(before);
    if (/data\s?set|data in brief|zenodo|figshare|dryad/i.test(venue)) return 'Dataset';
    if (!inProceedings) return 'Journal article';
    if (/workshop/i.test(venue)) return 'Workshop paper';
    return 'Conference paper';
  }

  function isMember(name) {
    var surname = name.split(/\s+/).pop();
    return MEMBER_SURNAMES.indexOf(surname) > -1;
  }

  function collect() {
    var entries = [];
    var sections = document.querySelectorAll('main section.level2');
    Array.prototype.forEach.call(sections, function (section) {
      var heading = section.querySelector('h2');
      if (!heading) return;
      var year = heading.textContent.trim();
      if (!/^\d{4}$/.test(year)) return;
      var items = section.querySelectorAll(':scope > ul > li');
      Array.prototype.forEach.call(items, function (item) {
        var text = item.textContent.replace(/\u00a0/g, ' ');
        var cut = titleStart(text);
        var authors = parseAuthors(cut > -1 ? text.slice(0, cut) : '');
        var em = item.querySelector('em');
        var venue = em ? em.textContent.trim() : '';
        var type = classify(item, venue);
        item.setAttribute('data-pub-year', year);
        item.setAttribute('data-pub-type', type);
        entries.push({
          el: item,
          section: section,
          year: year,
          type: type,
          authors: authors.names,
          etAl: authors.etAl,
          haystack: text.toLowerCase()
        });
      });
    });
    return entries;
  }

  function option(value, label) {
    var el = document.createElement('option');
    el.value = value;
    el.textContent = label;
    return el;
  }

  function fillYears(select, entries) {
    var years = [];
    entries.forEach(function (e) { if (years.indexOf(e.year) < 0) years.push(e.year); });
    years.sort().reverse();
    years.forEach(function (year) {
      var count = entries.filter(function (e) { return e.year === year; }).length;
      select.appendChild(option(year, year + ' (' + count + ')'));
    });
  }

  function fillTypes(select, entries) {
    var order = ['Journal article', 'Conference paper', 'Workshop paper', 'Book chapter', 'Dataset'];
    var counts = {};
    entries.forEach(function (e) { counts[e.type] = (counts[e.type] || 0) + 1; });
    Object.keys(counts)
      .sort(function (a, b) {
        var ia = order.indexOf(a) < 0 ? 99 : order.indexOf(a);
        var ib = order.indexOf(b) < 0 ? 99 : order.indexOf(b);
        return ia - ib;
      })
      .forEach(function (type) {
        select.appendChild(option(type, type + 's (' + counts[type] + ')'));
      });
  }

  function fillAuthors(select, entries) {
    var counts = {};
    entries.forEach(function (e) {
      e.authors.forEach(function (name) { counts[name] = (counts[name] || 0) + 1; });
    });
    var names = Object.keys(counts).sort(function (a, b) {
      if (counts[b] !== counts[a]) return counts[b] - counts[a];
      return a.split(/\s+/).pop().localeCompare(b.split(/\s+/).pop());
    });
    [
      { label: 'OptoLAB members', names: names.filter(isMember) },
      { label: 'Co-authors', names: names.filter(function (n) { return !isMember(n); }) }
    ].forEach(function (group) {
      if (!group.names.length) return;
      var optgroup = document.createElement('optgroup');
      optgroup.label = group.label;
      group.names.forEach(function (name) {
        optgroup.appendChild(option(name, name + ' (' + counts[name] + ')'));
      });
      select.appendChild(optgroup);
    });
  }

  function field(id, label) {
    var wrap = document.createElement('div');
    wrap.className = 'pub-filter-field';
    var el = document.createElement('label');
    el.setAttribute('for', id);
    el.textContent = label;
    wrap.appendChild(el);
    return wrap;
  }

  function buildToolbar(mount, entries) {
    var controls = document.createElement('div');
    controls.className = 'pub-filter-controls';
    var selects = {};

    [
      { id: 'pub-filter-year', label: 'Year', any: 'All years', fill: fillYears },
      { id: 'pub-filter-author', label: 'Author', any: 'All authors', fill: fillAuthors },
      { id: 'pub-filter-type', label: 'Type', any: 'All types', fill: fillTypes }
    ].forEach(function (spec) {
      var wrap = field(spec.id, spec.label);
      var select = document.createElement('select');
      select.id = spec.id;
      select.appendChild(option('', spec.any));
      spec.fill(select, entries);
      wrap.appendChild(select);
      controls.appendChild(wrap);
      selects[spec.id] = select;
    });

    var searchWrap = field('pub-filter-search', 'Search');
    var search = document.createElement('input');
    search.type = 'search';
    search.id = 'pub-filter-search';
    search.placeholder = 'Title, venue or DOI';
    searchWrap.appendChild(search);
    controls.appendChild(searchWrap);

    var reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'pub-filter-reset';
    reset.textContent = 'Reset';
    controls.appendChild(reset);

    var status = document.createElement('p');
    status.className = 'pub-filter-status';
    status.setAttribute('role', 'status');

    var note = document.createElement('p');
    note.className = 'pub-filter-note';
    note.hidden = true;

    mount.appendChild(controls);
    mount.appendChild(status);
    mount.appendChild(note);

    return {
      year: selects['pub-filter-year'],
      author: selects['pub-filter-author'],
      type: selects['pub-filter-type'],
      search: search,
      reset: reset,
      status: status,
      note: note
    };
  }

  function tocItemFor(section) {
    var link = document.querySelector('#TOC a[data-scroll-target="#' + section.id + '"]');
    return link ? link.closest('li') : null;
  }

  ready(function () {
    var mount = document.getElementById('pub-filter');
    if (!mount) return;

    var entries = collect();
    if (!entries.length) return;

    var ui = buildToolbar(mount, entries);
    var sections = [];
    entries.forEach(function (e) { if (sections.indexOf(e.section) < 0) sections.push(e.section); });
    var abbreviated = entries.filter(function (e) { return e.etAl; }).length;

    var last = sections[sections.length - 1];
    var empty = document.createElement('p');
    empty.className = 'pub-filter-empty';
    empty.textContent = 'No entries match the current filters.';
    empty.hidden = true;
    last.parentNode.insertBefore(empty, last.nextSibling);

    function apply() {
      var year = ui.year.value;
      var author = ui.author.value;
      var type = ui.type.value;
      var query = ui.search.value.trim().toLowerCase();
      var shown = 0;

      entries.forEach(function (e) {
        var match = (!year || e.year === year) &&
                    (!type || e.type === type) &&
                    (!author || e.authors.indexOf(author) > -1) &&
                    (!query || e.haystack.indexOf(query) > -1);
        e.el.hidden = !match;
        if (match) shown++;
      });

      sections.forEach(function (section) {
        var visible = entries.some(function (e) { return e.section === section && !e.el.hidden; });
        section.hidden = !visible;
        var tocItem = tocItemFor(section);
        if (tocItem) tocItem.hidden = !visible;
      });

      empty.hidden = shown > 0;
      ui.status.textContent = shown === entries.length
        ? 'Showing all ' + entries.length + ' entries'
        : 'Showing ' + shown + ' of ' + entries.length + ' entries';

      ui.note.hidden = !(author && abbreviated);
      ui.note.textContent = 'Entries abbreviated with “et al.” match on their listed authors only, so ' +
        abbreviated + ' of the ' + entries.length + ' records may under-report co-authorship.';
    }

    [ui.year, ui.author, ui.type].forEach(function (el) { el.addEventListener('change', apply); });
    ui.search.addEventListener('input', apply);
    ui.reset.addEventListener('click', function () {
      ui.year.value = '';
      ui.author.value = '';
      ui.type.value = '';
      ui.search.value = '';
      apply();
    });

    apply();
  });
})();
