function Portal(data)
{
  this.data = data;

  this.archive = new DatArchive(this.data.dat);
  
  this.el = document.createElement('div'); this.el.id = "portal";
  this.icon_el = document.createElement('div'); this.icon_el.className = "icon";
  this.name_el = document.createElement('t'); this.name_el.className = "name";
  this.desc_el = document.createElement('t'); this.desc_el.className = "desc";
  this.port_el = document.createElement('t'); this.port_el.className = "port";
  this.feed_el = document.createElement('t'); this.feed_el.className = "feed";

  this.el.appendChild(this.icon_el);
  this.el.appendChild(this.name_el);
  this.el.appendChild(this.desc_el);
  this.el.appendChild(this.port_el);
  this.el.appendChild(this.feed_el);

  this.install = function(el)
  {
    this.data.dat = window.location.toString();

    el.appendChild(this.el);
    this.icon_el.innerHTML = "<img src='/media/content/icon.svg'/>";
    this.name_el.innerHTML = "@"+this.data.name;
    this.desc_el.innerHTML = this.data.desc;
    this.port_el.innerHTML = this.data.port.length+" portals";
    this.feed_el.innerHTML = this.data.feed.length+" entries";
    document.title = "@"+this.data.name;
    r.load_feed(this.data.port);
  }

  this.update = function()
  {
    this.icon_el.innerHTML = "<img src='/media/content/icon.svg'/>";
    this.name_el.innerHTML = "@"+this.data.name;
    this.desc_el.innerHTML = this.data.desc;
    this.port_el.innerHTML = this.data.port.length+" portals";
    this.feed_el.innerHTML = this.data.feed.length+" entries";    
  }

  this.add_entry = function(entry)
  {
    this.data.feed.push(entry.to_json());
    this.save();
  }

  this.save = async function()
  {
    var archive = new DatArchive(window.location.toString())
    await archive.writeFile('/portal.json', JSON.stringify(this.data));
    await archive.commit();
    r.feed.update();
    this.update();
  }
}