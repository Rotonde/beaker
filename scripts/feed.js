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

  this.update_portals_list = async function()
  {
    var html = "";

    var portals = r.feed.portals;
    var archive = new DatArchive(window.location.toString());
    var is_owner = await archive.getInfo();

    for(name in portals){
      html += !is_owner.isOwner ? "<ln><a href='"+portals[name]+"'>"+name+"</a></ln>" : "<ln><t data-operation='undat://"+portals[name].replace("dat://","")+"'>"+name+"</t></ln>"
    }
    r.portal.port_list_el.innerHTML = "<list>"+html+"</list>";
  }

  this.get_entries = function()
  {
    var entries = [];
    var online_ports_count = 0;
    var list_html = "";

    var archive_promises = this.archives.map((archive) => (
      this.get_feed(archive)
        .then((feed_entries) => {
          online_ports_count += 1;
          r.portal.port_status_el.innerHTML = (online_ports_count - 1)+" online";
          r.feed.update_portals_list();
          entries = entries.concat(feed_entries);

          // Sort
          var sorted_entries = entries.sort(function(a,b){
            return a.timestamp < b.timestamp ? -1 : 1;
          });

          this.refresh(sorted_entries.reverse());
        })
        .catch((e) => {
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
            })
          ))
      });
  }

  this.refresh = function(entries)
  {
    var html = "";

    if (this.filter) {
      html += "<c class='clear_filter' data-operation='clear_filter'>Filtering by  "+this.filter+"</c>";
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
      if(c > 25){ break; }
      c += 1;
    }
    this.el.innerHTML = html;
  }
}