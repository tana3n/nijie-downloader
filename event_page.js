  //コンテキスト表示
  chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    'id' : "mkcM",
    'title' : 'Nijie Download',
    'type' : 'normal',
    "contexts" : ["page"],
    "documentUrlPatterns" : ["*://nijie.info/view.php?id=*"]
    /*,
    'onclick' : function(info){
      chrome.extention.sendMessage({type: 'get'});
    }*/
  });
  });
  //選択時のイベント
chrome.contextMenus.onClicked.addListener(function (info,tab) {
  chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id,{message: 'getImage'})
});

});

//とりあえずこれで受けられてるのでこのままで
chrome.runtime.onMessage.addListener(function(request) {
  console.log(request.url)
    chrome.downloads.download({
      url: request.url,
      filename: request.filename
    });
});