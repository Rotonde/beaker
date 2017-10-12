function Entry(data)
{
  this.portal = data.portal ? data.portal : r.portal.data.name;
  this.message = data.message;
  this.timestamp = data.timestamp;
  this.dat = data.dat;

  this.to_json = function()
  {
    return {message:this.message,timestamp:this.timestamp};
  }

  this.to_html = function()
  { 
    var html = "";

    html += "<img class='icon' src='"+this.dat+"/media/images/icon.svg'>";
    html += "<t class='message'>"+this.message+"</t><br/>";
    html += "<t class='portal'><a href='"+this.dat+"'>@"+this.portal+"</a></t>";
    html += "<t class='timestamp'>"+timeSince(this.timestamp)+" ago</t>";

    return "<div class='entry'>"+html+"<hr/></div>";
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
  return Math.floor(seconds) + " seconds";
}