function Rotonde()
{
  this.el = document.createElement('div');
  this.el.className = "rotonde";

  this.portal = null;
  this.feed = null;
  this.operator = new Operator();

  this.install = function()
  {
    document.body.appendChild(this.el);
    document.addEventListener('mousedown',r.mouse_down, false);
  }

  this.start = function()
  {
    this.operator.install(this.el);
    this.load_account();
  }

  this.load_account = async function()
  {
    var dat = window.location.toString();
    var archive = new DatArchive(dat)
    var portal_str = await archive.readFile('/portal.json');
    var portal_data = JSON.parse(portal_str);
    portal_data.dat = dat;
    this.portal = new Portal(portal_data);
    this.portal.install(this.el);

    var archive = new DatArchive(window.location.toString());
    var is_owner = await archive.getInfo();
    if(!is_owner.isOwner){
      this.operator.el.style.display = "none";
    }
  }

  this.load_feed = async function(feed)
  {
    this.feed = new Feed(feed);
    this.feed.install(this.el);
  }

  this.mouse_down = function(e)
  {
    if(!e.target.getAttribute("data-operation")){ return; }

    r.operator.inject(e.target.getAttribute("data-operation"));
  }

  this.reset = function()
  {
    this.portal.data = {name:"Newly Joined",desc:"Click on this text to edit your description.",site:"Anywhere",port:[],feed:[]};
    this.portal.save();
    console.log(this.portal.data)
  }
}