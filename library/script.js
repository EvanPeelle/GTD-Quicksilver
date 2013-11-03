//http://www.sefol.com/?p=1090
// var scripts = (function() {
  //look at design patterns - to solve this data leak issue, } not lining up.
  // Deal with the async issues in a sequencial manner.

//import deletes after click?
//list send changes the horizon to each...?
//append each list into each div on start...

//build out workplace

var client = new Dropbox.Client({key: 'j37v18c5tdi8xu4'});
client.authenticate();
  if (client.isAuthenticated()) {
    // Client is authenticated. Display UI.
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }
      var taskTable = datastore.getTable('tasks');
      //each record specified by horizon.
      var results = taskTable.query();
      var action = taskTable.query({horizon: 'action'});
      var project = taskTable.query({horizon: 'project'});
      var focus = taskTable.query({horizon: 'focus'});
      var goal = taskTable.query({horizon: 'goal'});
      var vision = taskTable.query({horizon: 'vision'});
      var wait = taskTable.query({horizon: 'wait'});
      var calendar = taskTable.query({horizon: 'calendar'});


    var queries = [
      {horizon: 'action'},
      {horizon: 'project'},
      {horizon: 'focus'},
      {horizon: 'goal'},
      {horizon: 'vision'},
      {horizon: 'wait'},
      {horizon: 'calendar'},
      {completed: false}
    ];

  //append all db items to projects div from the start.
  for (var k=0; k<results.length;k++ ) {
    $("#projects").append( "<li>"+results[k].get("taskname") + "</li>");
  };

  //delete all completed items on button click.
  $('#eraser').click(function() {
    var erasethem = taskTable.query();
    for (var i = 0; i < erasethem.length; i++) {
      erasethem[i].deleteRecord();
      console.log('deleted', erasethem[i]);
      console.log('worked');
    }
    $('li').remove();
  });

  //filter actions into div filter when clicked on any button
  $('#filtration').click(function() {
    $('#actionVerb li').sort(function(a, b) {
        var at = $(a).text(), bt = $(b).text();
        return (at > bt)?1:((at < bt)?-1:0);
    }).appendTo($('#filtered'));
  });

//===first page:

    //safety on page
    $(document).ready(function(){
      $('#d').click(function() {
        window.onbeforeunload = null;
        window.location='http://localhost:8888/';
      });
      window.onbeforeunload = function() {
        var message = 'wipe work bench clean?';
        return message;
      };
    });

    document.getElementById('search').focus();
    //inputID, keycode, divID
    var combined = [
      ['search', undefined, '#list',       'listed'],
      ['search2',       65, '#actionVerb', 'action'],
      ['projectsInput', 80, '#projects',   'project'],
      ['aofInput',      70, '#aof',        'focus'],
      ['',              67, '#calendar',   'calendar'],
      ['goalsInput',    71, '#goals',      'goal'],
      ['visionInput',   86, '#vision',     'vision'],
      ['waitingInput',  87, '#waiting',    'wait']
    ];
    //input, div coresponding
    var combinedAppend = [
      ['actionAttached', '#actionVerb', 'action'],
      ['aofAttached',    '#projects',   'project'],
      ['goalsAttached',  '#aof',        'focus'],
      ['visionAttached', '#goals',      'goal']
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
        //add to dp from importer
        $('#list').prepend('<li>' + item + '</li>');
        var firstTask = taskTable.insert({
          taskname: item,
          completed: false,
          horizon: 'listed',
          created: new Date()
        })
      });
    });

    //add new items into inbox
    $("#search").keyup(function (e) {
      var value = $(this).val();
      if(value == false){return false};
      if(e.keyCode == 13) {
        $(this).val('');
        $('#list').append('<li>' + value + '</li>');
        //add new record into dp
        var firstTask = taskTable.insert({
          taskname: value,
          completed: false,
          horizon: 'listed',
          created: new Date()
        })
        return false;
      }
    }).keyup();

    //insert each item respectively from any activeElement.
    $('body').bind('keydown', function(e) {
      var $currentInput = $(document.activeElement).attr('id'); //input id
      for(var i = 0; i < combined.length; i++) {
        if( $currentInput == combined[i][0]){

          for(var j = 0; j < combined.length; j++){
            if(e.shiftKey && e.keyCode == combined[j][1]){

              var passed = $(combined[i][2]).children().first();
              $(combined[j][2]).append(passed);

              // results[0].set('horizon', combined[i][3]);
              firstTask.set('horizon', combined[i][3]);
              // return false;
            }
          }
        }
      }
    });

    //verb highlighter
    function doWork() {
      repeater = setTimeout(doWork, 100);
      $("#actionVerb li").each(function( index, elem ) {
        var string = $(this).html();
        for(var i = 0; i < verb.length; i++){
          if(string.indexOf(verb[i]) != -1){
            if($("li > span").length < 1){
              $(this).html(string.replace(verb[i], '<span>'+ verb[i] +'</span>'));
            }
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

    //delete within each list[√]
    $("body").bind('keydown', function(e) {
      if (e.shiftKey && e.keyCode == 68) {
        var doc = document.activeElement;
        for (var i = 0; i < combined.length; i++) {
          if($(doc).attr('id') == combined[i][0]){

            //removing from dp in any div
            var data = $(combined[i][2]).children().first().text();
            console.log(data);
            var results = taskTable.query({taskname: data});
            console.log(results);
            results[0].deleteRecord();

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
            $('<li>' + value + '</li>').appendTo(combined[i][2]).hide().fadeIn(8500);
            var firstEl = $(combined[i][2]).children().first().text();
            $(combined[i][2]).children().first().remove();
            $('#' + combined[i][0]).val('');
            $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');

            //updating each li to dp in all div[√]
            var results = taskTable.query({taskname: firstEl});
            results[0].set('taskname', value);
            results[0].set('horizon', combined[i][3]);
            var valueString = value + "";
            // return false;
          }
          else if (e.shiftKey && e.keyCode == 78) { //next => n
            $('#' + combined[i][0]).val('');
            var contained = $(combined[i][2]).children().first().get();
            $(contained).appendTo(combined[i][2]).hide().fadeIn(8500);
            $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');
            e.preventDefault();
          }
        }
      }
      //additional attached inputs
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

            //add new record into dp
            var firstTask = taskTable.insert({
            taskname: value2,
            completed: false,
            horizon: combinedAppend[j][2],
            created: new Date()
            })

            return false;
          }
          else if (e.shiftKey && e.keyCode == 68) { //delete => d
            //removing from dp in other div
            var inputfirst = $(connectee).children().first().text();
            var inputresults = taskTable.query({taskname: inputfirst});
            inputresults[0].deleteRecord();

            $(connectee).children().first().remove();
            $(connectee).val('');
            return false;
          }
          else if (e.shiftKey && e.keyCode == 78) { //next => n
            $(connectee).val('');
            var contained = $(connectee).children().first().get();
            $(connectee).append(contained);
            e.preventDefault();
            return false;
          }
        }
      }
    });
  });
};