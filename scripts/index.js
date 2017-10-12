async function main()
{
  // create an archive instance for the current website
  var archive = new DatArchive(window.location.toString())
  var files = await archive.readdir('/')
  console.log(files)
  var files = await archive.readdir('/', {recursive: true})
  console.log(files)
  var indexJs = await archive.readFile('/js/index.js')
  console.log(indexJs)
  var beakerPng = await archive.readFile('/img/logo.png', 'base64')
  var img = document.createElement('img')
  img.src = 'data:image/png;base64,'+beakerPng
  document.body.appendChild(img)
  var indexJsStat = await archive.stat('/js/index.js')
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

main()