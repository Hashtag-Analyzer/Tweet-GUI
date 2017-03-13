var escape = function(match) {
  match = "\\" + match;
  return match;
}

function clean(word) {
  word = word.replace(/"/g, escape);
  return word.slice(0, word.length);
}

function ParseFullResults(document) {
  var docArray = document.split(", {");
  var jsonResult = {};
  for(var i = 0; i < docArray.length; i++) {
    console.log(i);
    switch(i) {
      case 0:
      jsonResult.score = jQuery.parseJSON(docArray[i]).score
      break;
      case 1:
      jsonResult.name = jQuery.parseJSON('{' + docArray[i]).name
      break;
      case 2:
      var message = docArray[i].split(': "')[1];
      console.log("a", message);
      message = clean(message.substring(0, message.length - 2));
      console.log("b", message);
      jsonResult.message = jQuery.parseJSON('{"message" : "' + message + '"}').message
      break;
      case 3:
      if(docArray[i].indexOf('[]') != -1)
        jsonResult.hashtags = jQuery.parseJSON('{"hashtags" : "none"}').hashtags;
      else {
        var hashtags = docArray[i].split(': [')[1];
        hashtags = hashtags.substring(0, hashtags.length - 2).split(', ');
        var jsonHashtags = '{"hashtags" : [';
        for(var j = 0; j < hashtags.length; j++) {
          if(j < hashtags.length - 1)
            jsonHashtags += ('"' + hashtags[j] + '", ')
          else
            jsonHashtags += ('"' + hashtags[j] + '"]}')
        }
        jsonResult.hashtags = jQuery.parseJSON(jsonHashtags).hashtags;
      }
      break;
      case 4:
      jsonResult.location = jQuery.parseJSON('{' + docArray[i]).location
      if(jsonResult.location  == "")
        jsonResult.location = "not shown";
      break;
      case 5:
      console.log(docArray[i])
      if(docArray[i].indexOf(': null') != -1) {
        console.log('a');
        jsonResult.url_titles = jQuery.parseJSON('{"url_titles" : "none"}').url_titles
      }
      else if(docArray[i].indexOf(': [') != -1) {
        console.log('b');
      }
      else {
        console.log('c');
        var url_title = docArray[i].split('" : ')[1];
        url_title = '"' + clean(url_title.substring(0, url_title.length - 1)) + '"';
        console.log(url_title)
        jsonResult.url_titles = jQuery.parseJSON('{"url_titles" : ' + url_title + '}').url_titles
        console.log('{"url_titles" : ' + url_title + '}');
      }
      break;
      case 6:
      jsonResult.timestamp = jQuery.parseJSON('{' + docArray[i]).timestamp
      break;
    }
  }
  console.log(jsonResult)
  return jsonResult;
}
