function Feed(feed_urls)
{
  this.el = document.createElement('div'); this.el.id = "feed";

  this.install = function(el)
  {
    el.appendChild(this.el);
    this.el.innerHTML = "Feed:";
    this.update();
  }

  this.update = function()
  {
    var html = "";

    var entries = this.get_entries();

    for(id in entries){
      html += new Entry(entries[id]).to_html();
    }
    this.el.innerHTML = html;
  }

  this.get_entries = function()
  {
    var entries = [];

    // Local
    for(id in r.portal.data.feed){
      var entry = new Entry(r.portal.data.feed[id]);
      entries.push(entry);
    }

    // Sort

    var sorted_entries = entries.sort(function(a,b){
       return a.timestamp < b.timestamp ? -1 : 1;
    });

    return sorted_entries.reverse();
  }
}