function Operator()
{
  this.el = document.createElement('div'); this.el.id = "operator";
  this.input_el = document.createElement('input'); this.input_el.id = "commander";
  this.input_el.setAttribute("placeholder","Input command here");
  this.hint_el = document.createElement('t'); this.hint_el.id = "hint";
  this.el.appendChild(this.input_el);
  this.el.appendChild(this.hint_el);

  this.install = function(el)
  {
    el.appendChild(this.el);

    this.input_el.addEventListener('keydown',r.operator.key_down, false);
    this.update();
  }

  this.update = function()
  {
    var words = this.input_el.value.trim().split(" ").length;
    var chars = this.input_el.value.trim().length;
    this.hint_el.innerHTML = chars+"C "+words+"W";
  }

  this.validate = function()
  {
    var command = this.input_el.value.indexOf(" ") ? this.input_el.value.split(" ")[0] : this.input_el.value;
    var params  = this.input_el.value.indexOf(" ") ? this.input_el.value.split(' ').slice(1).join(' ') : null;

    var option = command.indexOf(":") > -1 ? command.split(":")[1] : null;
    command = command.indexOf(":") > -1 ? command.split(":")[0] : command;
    
    if(this.commands[command]){
      this.commands[command](params,option);   
    }
    else{
      this.commands.say(this.input_el.value.trim());
    }
    this.input_el.value = "";   
  }

  this.inject = function(text)
  {
    this.input_el.value = text;
    this.input_el.focus();
  }

  this.commands = {};

  this.commands.say = function(p)
  {
    var message = p;
    var media = null;
    // Rich content
    if(message.indexOf(" >> ") > -1){
      media = message.split(" >> ")[1].split(" ")[0].trim();
      message = message.split(" >> ")[0].trim();
    }

    var data = {message:message,timestamp:Date.now()};
    if(media){
      data.media = media;
    }
    if(message.indexOf("@") == 0){
      var name = message.split(" ")[0].replace("@","").trim();
      data.target = r.feed.portals[name];
    }
    r.portal.add_entry(new Entry(data));
  }

  this.commands.edit = function(p,option)
  {
    if(option == "name"){
      r.portal.data.name = p;
    }
    else if(option == "desc"){
      r.portal.data.desc = p;
    }
    else if(option == "site"){
      r.portal.data.site = p;
    }
    else{
      r.portal.data.feed[option].message = p;
      r.portal.data.feed[option].editstamp = Date.now();      
    }

    console.log(r.portal.data.site);
    
    r.portal.save();
    r.portal.update();
    r.feed.update();
  }

  this.commands.undat = function(p,option)
  {
    var path = "dat://"+option;

    // Remove
    if(r.portal.data.port.indexOf(path) > -1){
      r.portal.data.port.splice(r.portal.data.port.indexOf(path), 1);
    }
    r.portal.save();
    r.portal.update();
    r.feed.update();
  }

  this.commands.dat = function(p,option)
  {
    var path = "dat:"+option;
    if(r.portal.data.dat == path){ return; }

    // Remove
    if(r.portal.data.port.indexOf(path) == -1){
      r.portal.data.port.push(path);
    }

    r.portal.save();
    r.portal.update();
    r.feed.update();
  }

  this.commands.delete = function(p,option)
  {
    r.portal.data.feed.splice(option, 1)
    r.portal.save();
    r.feed.update();
  }

  this.key_down = function(e)
  {
    if(e.key == "Enter"){
      r.operator.validate();
    }

    if((e.key == "Backspace" || e.key == "Delete") && (e.ctrlKey || e.metaKey) && e.shiftKey){
      e.preventDefault();
      r.reset();
      return;
    }
    r.operator.update();
  }
}