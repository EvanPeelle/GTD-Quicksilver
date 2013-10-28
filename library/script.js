//http://www.sefol.com/?p=1090
// var scripts = (function() {

  //authenticate dropbox client
  var client = new Dropbox.Client({key: });
  client.authenticate();

  if (client.isAuthenticated()) {
    // Client is authenticated. Display UI.
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }
      var taskTable = datastore.getTable('tasks');
      console.log(taskTable);
      // Now you have a datastore. The next few examples can be included here.
      var results = taskTable.query({completed: false});
      var firstResult = results[3];
      // var firstTask = taskTable.insert({
      //   taskname: 'Buy milk',
      //   completed: false,
      //   created: new Date()
      // });

      // var taskname = firstTask.get('taskname');
      // console.log(taskname);

      // firstTask.set('completed', true);
      // var status = firstTask.get('completed');
      // console.log(status);
      console.log(results);
      console.log(firstResult);
      // firstTask.deleteRecord();

    });
  };

//---app logic---//

//filter actions when clicked on body
$('body').click(function() {
  $('#actionVerb li').sort(function(a, b) {
      var at = $(a).text(), bt = $(b).text();
      return (at > bt)?1:((at < bt)?-1:0);
  }).appendTo($('#filtered'));
});

  //safety on page
  $(document).ready(function(){
    $('body').click(function() {
      window.onbeforeunload = null;
      window.location='http://localhost:8888/';
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
  });

  //add new items into inbox
  $("#search").keyup(function (e) {
    var value = $(this).val();
    if(value == false){return false};
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
            var passed = $(combined[i][2]).children().first();
            $(combined[j][2]).append(passed);
            return false;
          }
        }
      }
    }
  });

  //verb highlights
  function doWork() {
    repeater = setTimeout(doWork, 18000);
    $("#actionVerb li").each(function( index, elem ) {
      var string = $(this).html();
      for(var i = 0; i < verb.length; i++){
        if(string.indexOf(verb[i]) != -1){
          console.log(this);//I don't think it is iterating over each li, only one.
          // if(!$(this).has( 'span' )){
            $(this).html(string.replace(verb[i], '<span>'+ verb[i] +'</span>'))
          // }
        }
      }
    });
  }
  doWork();

  //shift + T : output actions in form as a list
  $("body").bind('keydown', function(e) {
    if (e.shiftKey && e.keyCode == 84) {
      $( "#reveal" ).show( "slow" );
      var formFill = '';

      $('#actionVerb li').sort(function(a, b) {
      var at = $(a).text(), bt = $(b).text();
      return (at > bt)?1:((at < bt)?-1:0);
      }).appendTo($('#filtered'));
//remove this extra step.
      $('#filtered li').each(function(index, elem) {
        var content = $(this).text();
        formFill = formFill + content + '\n';
      });
    $('#output').val(formFill);
    //projects feild for output2
    var formFill2 = '';
      $('#projects li').each(function(index, elem) {
        var content2 = $(this).text();
        formFill2 = formFill2 + content2 + '\n';
      });
      $('#output2').val(formFill2);
      return false;
    }
  });

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
          //$(combined[i][2]).append('<li>' + value + '</li>').hide().fadeIn('slow');
          $('<li>' + value + '</li>').appendTo(combined[i][2]).hide().fadeIn(8500);
          $(combined[i][2]).children().first().remove()
          $('#' + combined[i][0]).val('');
          $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');
          return false;
        }
        else if (e.shiftKey && e.keyCode == 78) { //next => n
          $('#' + combined[i][0]).val('');
          var contained = $(combined[i][2]).children().first().get()
          $(contained).appendTo(combined[i][2]).hide().fadeIn(8500);
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
        var connectee = combinedAppend[j+1][1];
        var value2 = $(connected).val();
        if (e.keyCode == 13) { //newone => enter
          if(value2 == false){return false}
          $(connector).prepend('<li>' + value2 + '</li>');
          $(connected).val('');
          return false;
        }
        else if (e.shiftKey && e.keyCode == 68) { //delete => d
          $(connectee).children().first().remove();
          $(connectee).val('');
          return false;
        }
        else if (e.shiftKey && e.keyCode == 78) { //next => n
          $(connectee).val('');
          var contained = $(connectee).children().first().get()
          $(connectee).append(contained);
          e.preventDefault();
          return false;
        }
      }
    }
  })