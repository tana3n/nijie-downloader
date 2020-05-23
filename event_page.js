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
  console.log('sendMessage')
 // if (info.menuItemId === 'nkcM'){
  chrome.tabs.query( {active:true, currentWindow:true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id,{message: 'getImage'})
  console.log('sentMessage')
});
  
  //}
});

//とりあえずこれで受けられてるのでこのままで
chrome.extension.onMessage.addListener(function(request) {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename
    });
});