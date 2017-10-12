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
    
    if(this.commands[command]){
      this.commands[command](params);   
      this.input_el.value = "";   
    }
  }

  this.commands = {};

  this.commands.say = function(p)
  {
    var data = {message:p,timestamp:Date.now()};
    var entry = new Entry(data);
    r.portal.add_entry(entry);
  }

  this.key_down = function(e)
  {
    if(e.key == "Enter"){
      r.operator.validate();
    }
  }
}