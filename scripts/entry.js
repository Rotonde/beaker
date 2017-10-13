function Entry(data)
{
  this.portal = data.portal ? data.portal : r.portal.data.name;
  this.message = data.message;
  this.timestamp = data.timestamp;
  this.dat = data.dat;
  this.id = data.id;
  this.editstamp = data.editstamp;
  this.media = data.media;

  this.to_json = function()
  {
    return {message:this.message,timestamp:this.timestamp,editstamp:this.editstamp,media:this.media};
  }

  this.to_html = function()
  { 
    var html = "";

    html += "<img class='icon' src='"+this.dat+"/media/content/icon.svg'>";
    html += "<t class='message'>"+(this.formatter(this.message))+"</t><br/>";
    
    if(this.media){
      html += "<img class='media' src='"+this.dat+"/media/content/"+this.media+".jpg'/>"
    }
    html += "<t class='portal'><a href='"+this.dat+"'>@"+this.portal+"</a></t>";

    if(this.portal == r.portal.data.name){
      html += this.editstamp ? "<c class='editstamp' data-operation='"+(this.dat == r.portal.data.dat ? 'edit:'+this.id+' '+this.message : '')+"'>edited "+timeSince(this.editstamp)+" ago</c>" : "<c class='timestamp' data-operation='edit:"+this.id+" "+this.message+"'>"+timeSince(this.timestamp)+" ago</c>";
    }
    else{
      html += this.editstamp ? "<c class='editstamp'>edited "+timeSince(this.editstamp)+" ago</c>" : "<c class='timestamp'>"+timeSince(this.timestamp)+" ago</c>";  
    }
    
    return "<div class='entry'>"+html+"<hr/></div>";
  }

  this.formatter = function(message)
  {
    var m = message;

    m = this.format_links(m);

    return m.replace('@'+r.portal.data.name,'<t class="highlight">@'+r.portal.data.name+"</t>");
  }

  this.format_links = function(m)
  {
    var words = m.split(" ");
    var n = [];
    for(id in words){
      var word = words[id];
      if(word.substr(0,6) == "dat://"){
        var compressed = word.substr(0,12)+".."+word.substr(word.length-3,2);
        n.push("<a href='"+word+"'>"+compressed+"</a>");
      }
      else{
        n.push(word)
      }
    }
    return n.join(" ").trim();
  }

  this.time_ago = function()
  {
    return timeSince(this.timestamp);
  }
}

function timeSince(date)
{
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return "seconds";
}