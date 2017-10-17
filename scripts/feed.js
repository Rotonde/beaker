function Feed(feed_urls) {
  this.feed_urls = feed_urls;
  this.el = document.createElement("div");
  this.el.id = "feed";

  this.archives = [];
  this.portals = {};
  this.filter = "";

  this.install = function(el) {
    el.appendChild(this.el);

    this.el.innerHTML = "Fetching " + this.feed_urls.length + " feeds..";

    for (id in this.feed_urls) {
      var archive = new DatArchive(this.feed_urls[id]);
      var fileEvents = archive.createFileActivityStream();
      fileEvents.addEventListener("changed", e => {
        console.log("Automated update");
        r.feed.update();
      });
      archive.gateway = this.feed_urls[id];
      this.archives.push(archive);
    }
    this.archives.push(r.portal.archive);

    this.update();
  };

  this.update = async function() {
    this.get_entries();
  };

  this.get_entries = function() {
    var entries = [];
    var online_ports_count = 0;

    var archive_promises = this.archives.map(archive =>
      this.get_feed(archive)
        .then(feed_entries => {
          online_ports_count += 1;
          entries = entries.concat(feed_entries);
          this.debounced_sort_refresh(entries);
          r.portal.port_list_el.innerHTML = this.feed_html;
        })
        .catch(e => {
          console.warn(e);
          console.warn(
            `Unable to fetch, this feed appears to be offline: ${archive.url}`
          );
        })
    );

    Promise.all(archive_promises).then(() => {
      console.log("DONE");
      // Finished attempting to load all ports, maybe do something here?
    });
  };

  this.get_feed = function(archive) {
    this.feed_html = "";

    return archive.readFile("portal.json").then(portal_data => {
      var portal = JSON.parse(portal_data);
      var last_entry = portal.feed[portal.feed.length - 1];
      var is_active = Math.floor((new Date() - last_entry.timestamp) / 1000);
      var rune = portal.port.indexOf(r.portal.data.dat) > -1 ? "@" : "~";

      if (is_active > 190000 && portal.name != r.portal.data.name) {
        this.feed_html +=
          "<ln title='" +
          timeSince(last_entry.timestamp) +
          "' class='dead' data-operation='un" +
          archive.gateway +
          "'>" +
          rune +
          "" +
          portal.name +
          "</ln>";
      } else {
        this.feed_html +=
          "<ln title='" +
          timeSince(last_entry.timestamp) +
          "' class='" +
          (is_active < 150000 ? "active" : "inactive") +
          "'><a href='" +
          portal.dat +
          "'>" +
          rune +
          "" +
          portal.name +
          "</a></ln>";
      }

      this.portals[portal.name] = portal;

      return portal.feed
        .filter(entry => {
          if (!this.filter) return true;
          if ("@" + portal.name === this.filter) return true;
          return entry.message
            .toLowerCase()
            .includes(this.filter.toLowerCase());
        })
        .map(
          (entry, entry_id) =>
            new Entry(
              Object.assign({}, entry, {
                portal: portal.name,
                dat: archive.url,
                id: entry_id,
                seed: portal.port.indexOf(r.portal.data.dat) > -1
              })
            )
        );
    });
  };

  this.debounced_sort_refresh = debounce(
    function(entries) {
      // Sort
      var sorted_entries = entries.sort(function(a, b) {
        return a.timestamp < b.timestamp ? -1 : 1;
      });

      this.refresh(sorted_entries.reverse());
    },
    1000,
    false
  );

  this.refresh = function(entries) {
    console.log("Refresh!");

    var html = this.filter
      ? "<c class='clear_filter' data-operation='clear_filter'>Filtering by " +
        this.filter +
        "</c>"
      : "";
    var c = 0;
    for (id in entries) {
      var entry = entries[id];
      if (!entry) {
        continue;
      }
      html += entry.to_html();
      if (c > 40) {
        break;
      }
      c += 1;
    }
    this.el.innerHTML = html;
  };
}

// See https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      // if (!immediate) func.apply(context, args);
      func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function portal_from_hash(hash) {
  for (name in r.feed.portals) {
    var portal = r.feed.portals[name];
    if (r.feed.portals[name].dat == hash) {
      return portal;
    }
  }
  return hash.substr(0, 12) + ".." + hash.substr(hash.length - 3, 2);
}
