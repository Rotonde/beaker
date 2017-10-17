function Rotonde() {
  this.el = document.createElement("div");
  this.el.className = "rotonde";

  this.portal = null;
  this.feed = null;
  this.operator = new Operator();

  this.install = function() {
    document.body.appendChild(this.el);
    document.addEventListener("mousedown", r.mouse_down, false);
  };

  this.start = function() {
    this.operator.install(this.el);
    this.load_account();
  };

  this.load_account = async function() {
    var dat = window.location.toString();
    var archive = new DatArchive(dat);
    var info = await archive.getInfo();
    var portal_str;
    var portal_data;

    try {
      portal_str = await archive.readFile("/portal.json");
    } catch (err) {
      // If the portal.json does not exist ignore the error as we will create
      // it with defaults below.
    }

    if (!portal_str) {
      portal_data = {
        name: "new_name",
        desc: "new_desc",
        port: [
          // @neauoire
          window.location.toString()
        ],
        feed: [],
        site: "",
        dat: ""
      };
      await archive.writeFile(
        "/portal.json",
        JSON.stringify(portal_data, null, 2)
      );
    } else {
      try {
        portal_data = JSON.parse(portal_str);
      } catch (err) {
        // TODO: handle invalid portal.json
        console.error("Malformed JSON in portal.json");
      }
    }

    portal_data.dat = dat;
    this.portal = new Portal(portal_data);
    this.portal.install(this.el);

    if (!info.isOwner) {
      this.operator.el.style.display = "none";
    }
  };

  this.load_feed = async function(feed) {
    this.feed = new Feed(feed);
    this.feed.install(this.el);
  };

  this.mouse_down = function(e) {
    if (!e.target.getAttribute("data-operation")) {
      return;
    }
    e.preventDefault();
    r.operator.inject(e.target.getAttribute("data-operation"));
  };

  this.reset = function() {
    this.portal.data = {
      name: "Newly Joined",
      desc: "Click on this text to edit your description.",
      site: "Anywhere",
      port: [],
      feed: []
    };
    this.portal.save();
    console.log(this.portal.data);
  };
}
