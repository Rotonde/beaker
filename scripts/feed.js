function Feed(feed_urls)
{
  this.feed_urls = feed_urls;
  this.el = document.createElement('div'); this.el.id = "feed";

  this.archives = [];
  this.portals = {};

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

  this.update_portals = async function()
  {
    var html = "";

    var portals = r.feed.portals;

    for(name in portals){
      html += "<ln><t data-operation='undat://"+portals[name].replace("dat://","")+"'>"+name+"</t></ln>"
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
          r.feed.update_portals();
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