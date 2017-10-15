function Feed(feed_urls)
{
  this.feed_urls = feed_urls;
  this.el = document.createElement('div'); this.el.id = "feed";

  this.archives = [];
  this.portals = {};
  this.filter = "";

  this.install = function(el)
  {
    el.appendChild(this.el);

    this.el.innerHTML = "Fetching "+this.feed_urls.length+" feeds..";

    for(id in this.feed_urls){
      var archive = new DatArchive(this.feed_urls[id]);
      try {
        fileEvents = archive.createFileActivityStream();
      } catch (err) {
        console.warn(err);
        continue;
      }

      fileEvents.addEventListener('changed', e => {
        console.log("Automated update")
        r.feed.update();
      });
      this.archives.push(archive);
    }

    this.archives.push(r.portal.archive);

    this.update();
  }

  this.update = async function()
  {
    this.get_entries();
  }

  this.get_entries = function()
  {
    var entries = [];
    var online_ports_count = 0;
    r.portal.port_list_el.innerHTML = "";

    var archive_promises = this.archives.map((archive) => (
      this.get_feed(archive)
        .then((feed_entries) => {
          r.portal.port_list_el.innerHTML += "<ln><a href='"+archive.url+"'>"+name_from_hash(archive.url)+"</a></ln>"
          online_ports_count += 1;
          entries = entries.concat(feed_entries);
          this.debounced_sort_refresh(entries);
        })
        .catch((e) => {
          r.portal.port_list_el.innerHTML += "<ln style='color:red'><a href='"+archive.url+"'>"+name_from_hash(archive.url)+"</a></ln>"
          console.warn(e);
          console.warn(`Unable to fetch, this feed appears to be offline: ${archive.url}`);
        })
    ));

    Promise.all(archive_promises).then(() => {

      // Finished attempting to load all ports, maybe do something here?

    });
  }

  this.get_feed = function(archive)
  {
    return archive.readFile('portal.json')
      .then((portal_data) => {
        var portal = JSON.parse(portal_data);
        this.portals[portal.name] = archive.url;

        return portal.feed
          .filter((entry) => {
            if (!this.filter) return true;
            if ("@"+portal.name === this.filter) return true;
            return entry.message.toLowerCase().includes(this.filter.toLowerCase());
          })
          .map((entry, entry_id) => new Entry(
            Object.assign({}, entry, {
              portal: portal.name,
              dat: archive.url,
              id: entry_id,
              seed: portal.port.indexOf(r.portal.data.dat) > -1
            })
          ))
      });
  }

  this.debounced_sort_refresh = debounce(function(entries) {
    // Sort
    var sorted_entries = entries.sort(function (a, b) {
      return a.timestamp < b.timestamp ? -1 : 1;
    });

    this.refresh(sorted_entries.reverse());
  }, 100, false);

  this.refresh = function(entries)
  {
    var html = "";

    if (this.filter) {
      html += "<c class='clear_filter' data-operation='clear_filter'>Filtering by "+this.filter+"</c>";
    }

    var c = 0;
    for(id in entries){
      var entry = entries[id];
      if (!entry) {
        // TODO: Sometimes creating an entry fails and returns `undefined`,
        // for now filter those ones out.
        continue;
      }
      html += entry.to_html();
      if(c > 40){ break; }
      c += 1;
    }
    this.el.innerHTML = html;
  }
}

// See https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
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
};

function name_from_hash(hash)
{
  for(name in r.feed.portals){
    if(r.feed.portals[name] == hash){
      return name;
    }
  }
  return hash.substr(0,12)+".."+hash.substr(hash.length-3,2);
}