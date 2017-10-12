function Feed(feed_urls)
{
  this.el = document.createElement('div'); this.el.id = "feed";

  this.install = function(el)
  {
    el.appendChild(this.el);
    this.el.innerHTML = "Feed:";
    this.update();
  }

  this.update = async function()
  {
    this.get_entries();
  }

  this.get_entries = async function()
  {
    var entries = [];

    // Local
    for(id in r.portal.data.feed){
      var entry_data = r.portal.data.feed[id];
      entry_data.dat = window.location.toString();
      var entry = new Entry(entry_data);
      entries.push(entry);
    }

    // Remote
    for(id in r.portal.data.port){
      var portal_url = r.portal.data.port[id];
      var archive = new DatArchive(portal_url)
      var portal_data = await archive.readFile('portal.json');
      var portal = JSON.parse(portal_data);
      for(entry_id in portal.feed){
        var entry_data = portal.feed[entry_id];
        entry_data.portal = portal.name;
        entry_data.dat = portal_url;
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
      html += new Entry(entries[id]).to_html();
    }
    this.el.innerHTML = html;
  }
}