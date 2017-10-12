function Feed(feed_urls)
{
  this.feed_urls = feed_urls;
  this.el = document.createElement('div'); this.el.id = "feed";

  this.archives = [];

  this.install = function(el)
  {
    el.appendChild(this.el);
    this.el.innerHTML = "Feed:";

    for(id in this.feed_urls){
      var archive = new DatArchive(this.feed_urls[id])
      // var fileEvents = archive.createFileActivityStream()
      // fileEvents.addEventListener('changed', e => {
      //   console.log(e.path, 'changed')
      // })
      this.archives.push(archive);
    }
    this.archives.push(r.portal.archive);

    this.update();
  }

  this.update = async function()
  {
    this.get_entries();
  }

  this.get_entries = async function()
  {
    var entries = [];

    for(id in this.archives){
      var archive = this.archives[id];
      var portal_data = await archive.readFile('portal.json');
      var portal = JSON.parse(portal_data);
      for(entry_id in portal.feed){
        var entry_data = portal.feed[entry_id];
        entry_data.portal = portal.name;
        entry_data.dat = archive.url;
        entries.push(new Entry(entry_data))
      }
    }

    // Sort

    var sorted_entries = entries.sort(function(a,b){
       return a.timestamp < b.timestamp ? -1 : 1;
    });

    this.refresh(sorted_entries.reverse());
  }

  this.refresh = function(entries)
  {
    var html = "";

    for(id in entries){
      var entry = entries[id];
      html += entry.to_html();
    }
    this.el.innerHTML = html;
  }
}