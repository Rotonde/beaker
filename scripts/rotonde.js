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
    this.portal.data = {name:"new_name",desc:"new_desc",port:[],feed:[]};
    this.portal.save();
    console.log(this.portal.data)
  }
}

async function main()
{
  // create an archive instance for the current website
  var archive = new DatArchive(window.location.toString())
  var files = await archive.readdir('/')
  console.log(files)
  var files = await archive.readdir('/', {recursive: true})
  console.log(files)
  var indexJs = await archive.readFile('/scripts/index.js')
  console.log(indexJs)
  var beakerPng = await archive.readFile('/img/logo.png', 'base64')
  var img = document.createElement('img')
  img.src = 'data:image/png;base64,'+beakerPng
  document.body.appendChild(img)
  var indexJsStat = await archive.stat('/scripts/index.js')
  console.log(indexJsStat)

  await archive.writeFile('/hello.txt', 'world')
  console.log('Wrote', archive.url + '/hello.txt')
  // await archive.mkdir('/subdir'))

  try {
    var st = await archive.stat('/foo.txt')
    // does exist
  } catch (e) {
    // does not exist
  }

  var fileEvents = archive.createFileActivityStream()
  fileEvents.addEventListener('invalidated', e => {
    console.log(e.path, 'invalidated')
  })
  fileEvents.addEventListener('changed', e => {
    console.log(e.path, 'changed')
  })
}

// main()