function Operator()
{
  this.el = document.createElement('div'); this.el.id = "operator";
  this.input_el = document.createElement('input'); this.input_el.id = "commander";
  this.input_el.setAttribute("placeholder","Input command here")
  this.el.appendChild(this.input_el);

  this.install = function(el)
  {
    el.appendChild(this.el);

    this.input_el.addEventListener('keydown',r.operator.key_down, false);
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
    var entry = new Entry(data);
    r.portal.add_entry(entry);
  }

  this.commands.edit = function(p,option)
  {
    if(option == "name"){
      r.portal.data.name = p;
    }
    else if(option == "desc"){
      r.portal.data.desc = p;
    }
    else{
      r.portal.data.feed[option].message = p;
      r.portal.data.feed[option].editstamp = Date.now();      
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
  }
}