// var typist = (function(){
//remove the duplication - speed key to diff divs(not its own)

//safety on page
$(document).ready(function(){
  $('body').click(function() {
    window.onbeforeunload = null;
    window.location='file:///Users/Skynet/Desktop/Dropbox/smoothgit/ParameterGetter/index.html';
  });
  window.onbeforeunload = function() {
    var message = 'wipe work bench clean?';
    return message;
  }
});

document.getElementById('search').focus()
//inputID, keycode, divID
var combined = [
  ['search', undefined, '#list'],
  ['projectsInput', 80, '#projects'],
  ['search2',       65, '#actionVerb'],
  ['',              67, '#calendar'],
  ['aofInput',      70, '#aof'],
  ['goalsInput',    71, '#goals'],
  ['visionInput',   86, '#vision'],
  ['waitingInput',  87, '#waiting']
];
//input, div coresponding
var combinedAppend = [
  ['actionAttached','#actionVerb'],
  ['aofAttached','#projects'],
  ['goalsAttached','#aof'],
  ['visionAttached','#goals']
];

//print each action li into output
$('button').click(function() {
  var contents = ''
  $("#actionVerb li").each(function() {
    contents = contents + $(this).text() + '\n';
  });
  $('#output').val( contents );
});

//import textarea
$('#import').click(function() {
  var items = $('#newItems').val().split('\n');
  if(items == false){return false}
  $('#newItems').val('');
  _.each(items, function(item){
     $('#list').prepend('<li>' + item + '</li>');
  });
  return false;
})

//add new items into inbox
$("#search").keyup(function (e) {
  var value = $(this).val();
  if(value == false){return false}
  else if (e.keyCode == 13) {
    $(this).val('');
    $('#list').append('<li>' + value + '</li>');
    return false;
  }
}).keyup();

//insert each item respectively from any activeElement.
$('body').bind('keydown', function(e) {
  //delivers the input id;
  var $currentInput = $(document.activeElement).attr('id');
  for(var i = 0; i < combined.length; i++) {
    if( $currentInput == combined[i][0]){
      for(var j = 0; j < combined.length; j++){
        if(e.shiftKey && e.keyCode == combined[j][1]){
          var passed = $(combined[i][2]).children().first()
          $(combined[j][2]).append(passed);
          return false
        }
      }
    }
  }
})

//verb highlights
function doWork() {
  repeater = setTimeout(doWork, 50000);
  $("#actionVerb li").each(function( index, elem ) {
    var string = $(this).html();
    for(var i = 0; i < verb.length; i++){
      if(string.indexOf(verb[i]) != -1){
       $(this).html(string.replace(verb[i], '<span>'+ verb[i] +'</span>'))
      }
    }
  })
}
doWork();

//shift + T : output actions in form as a list
$("body").bind('keydown', function(e) {
  if (e.shiftKey && e.keyCode == 84) {
    $( "#reveal" ).show( "slow" );
    var formFill = '';
    $('#actionVerb li').each(function(index, elem) {
      var content = $(this).text();
      formFill = formFill + content + '\n';
    })
  $('#output').val(formFill);
  //projects feild for output2
  var formFill2 = '';
    $('#projects li').each(function(index, elem) {
      var content2 = $(this).text();
      formFill2 = formFill2 + content2 + '\n';
    })
    $('#output2').val(formFill2)
    return false;
  }
})

//delete object in view area:

//delete within each list * //create class of inputs for integrated deletion.
$("body").bind('keydown', function(e) {
  if (e.shiftKey && e.keyCode == 68) {
    var doc = document.activeElement;
    for (var i = 0; i < combined.length; i++) {
      if($(doc).attr('id') == combined[i][0]){
        $(combined[i][2]).children().first().remove();
      }
    }
    return false;
  }
});

//click observed
$('body').bind('keydown', function(e) {
  var activeInput = document.activeElement;
  var lengthen = 0;
  //if it is an active input
  for (var i = 1; i < combined.length; i++) {
    if($(activeInput).attr('id') == combined[i][0]){
      lengthen = $(combined[i][2] + ' ' + 'li').length;
      var value = $('#' + combined[i][0]).val();
      //hit return to
      if (e.keyCode == 13) {
        $(combined[i][2]).append('<li>' + value + '</li>');
        $(combined[i][2]).children().first().remove()
        $('#' + combined[i][0]).val('');
        $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');
        return false;
      }
      else if (e.shiftKey && e.keyCode == 78) { //next => n
        $('#' + combined[i][0]).val('');
        var contained = $(combined[i][2]).children().first().get()
        $(combined[i][2]).append(contained);
        $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');
        e.preventDefault()
      }
    }
  }
  //additional attched inputs
  for (var j = 0; j < combinedAppend.length; j++) {
    if($(activeInput).attr('id') == combinedAppend[j][0]){
      var connected = '#'+ combinedAppend[j][0];
      var connector = combinedAppend[j][1];
      $(connected).bind('keydown', function(e) {
        var value2 = $(connected).val();
        console.log(value2)
        if (e.keyCode == 13) { //newone => enter
          if(value2 == false){return false}
          $(connector).prepend('<li>' + value2 + '</li>');
          $(connected).val('');
        }
        else if (e.shiftKey && e.keyCode == 68) { //delete => d
          $(connected).children().first().remove();
          $(connected).val('');
        }
        else if (e.shiftKey && e.keyCode == 78) { //next => n
          $(connected).val('');
          var contained = $(connected).children().first().get()
          $(connected).append(contained);
          e.preventDefault()
        }
      })
    }
  }
})

// return typist;//where it is called

// }).call(this);

