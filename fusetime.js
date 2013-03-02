var API_PATH = "http://www.giantbomb.com/api/videos/";
var API_KEY  = "";

chrome.extension.sendMessage('getApiKey', function(r) {
  API_KEY = r;

  initialize();
});

// Customize Moment i18n to make more sense for our usage.
moment.lang('en', {
  relativeTime : {
    future: "in %s",
    past:   "%s ago",
    s:      "seconds",
    m:      "1 minute",
    mm:     "%d minutes",
    h:      "1 hour",
    hh:     "%d hours",
    d:      "1 day",
    dd:     "%d days",
    M:      "a month",
    MM:     "%d months",
    y:      "a year",
    yy:     "%d years"
  }
});

function initialize() {
  var videos = [];

  if (API_KEY == null) {
    alert("FuseTime: You need to set your GiantBomb API key in the extension options.");
  }
  else {
    // Go through each video link and find its unique ID, adding it to the +videos+
    // array.
    $('a[href^="/videos/"]').each(function() {
      var el = $(this);
      var id = el.attr('href').replace(/\/videos\/.+\/\d+-(\d+)\/$/, '$1');

      if (parseInt(id) > 0) {
        $(this).attr('data-video-id', id);
        videos.push(id);
      }
    });

    // Make one API request with all the video IDs we need, then append its length
    // to its byline element.
    $.ajax(API_PATH, {
      data: {
        api_key: API_KEY,
        filter:  "id:" + videos.join('|'),
        format:  "json"
      },
      error: function(x, s, m) {
        console.debug('[FuseTime] Error', x, s, m);
      },
      success: function(response) {
        if (response.status_code == 1)
          fuseTime(response.results);
        else
          console.warn("[FuseTime] GiantBomb API error", response.status_code, response.error);
      }
    });
  }
}

function fuseTime(results) {
  $.each(results, function(i, d) {
    var el = $('a[data-video-id="' + d.id + '"]');
    var length = d.length_seconds;

    if (length > 0) {
      el.children('.byline').append(" | " + moment.duration(length, 'seconds').humanize());
    }
  });
}
