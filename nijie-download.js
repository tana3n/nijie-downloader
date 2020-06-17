  'use strict'; 
  var checkLogin, getSrcURL,　getExttype,　getDiff, getFile, BT, dl;
  //macro
  var getTagnum,getTags,getTag, getTitle, getIllustID, getFilename, getDiffmacro, getUsername, getUserID;
  
  checkLogin = function(){
   if($('#main>div').attr("class") == 'login'){
    return false
   } else {
    return true
   }
  }
  getSrcURL = function(diff) {
  //一枚目
    if(diff == 0){    
      var imgfilter = $('#img_filter img').attr("src");
      if (imgfilter == null) {
        imgfilter = $('#img_filter video').attr("src");
        if (imgfilter.length == null){
          return null;
        }
        }
        return imgfilter;
    }else if(diff > 0){
      var imgfilter = $('#img_diff img').eq(diff-1).attr("src");
      imgfilter　= imgfilter.replace('__rs_l120x120/','');
      return imgfilter;
    } else {
      console.log('no detect img_diff')
    }
  };

  getDiff =　function() {
    var diff = $('#img_diff a').length;
    if (diff == null){
      return 0
    }else{
      return diff;
    }
  }
  getTag = function(Tagnum){
    var e = $('#view-tag .tag').eq(Tagnum).text()
    //replace Taglock
    return e.replace('*','');
  }
  //タグ数取得
  getTagnum = function(){
    return $('#view-tag .tag').length;
  }
  getTags = function(){
    var Tagnum = getTagnum();
    console.log(Tagnum)
    for(var num = 0; num < Tagnum ; num++){
     console.log(getTag(num))
    }
  }
//img_diff内に中身があるかどうかで判定かなぁ
//最後のdiff_*を引っ張り出して枚数検出
    getDiffmacro　=　function(num){
      return (''+(num+1)).padStart(2,'0');
    }//0パテ用
    
    getIllustID = function(){
      var img = $('#img_filter img').attr('illust_id');
      if (img == null){
        return $('#img_filter video').attr('illust_id');
        } else{
      return img 
      }
    };
    getUserID = function(){
      var img = $('#img_filter img').attr('user_id');
      if (img == null){
        return $('#img_filter video').attr('user_id');
        } else{
      return img
      }    };
    getTitle = function(){
      var img = $('#img_filter img').attr('alt');
      if (img == null){
        return $('#img_filter video').attr('alt');
        } else{
      return img
      }    };
    getUsername = function(){
      return $('#pro img').attr('alt');
    };
    getExttype = function(url){
      return url.match(/\.[^.]+$/);
    };
    // $('#ID名 ほげほげ')でaとかliとかの子要素がとれる（空白だとJqueryだと孫要素いけます ＞だと子だけなので明示したいときはそっちかな
//attr('ほげ');で(classとかhrefとか)の内容が拾える


getFilename　= function(num){
//とりあえずマクロ化するはずだけどとりあえず仮処理
//macro
var Exttype = getExttype(getSrcURL(getDiff()));
//ExtTypeは必須なのでなんかうまーくreturnにねじ込む
var Pagenum2 = getDiffmacro(num)
var Pagenum = num
var Maxpagenum2 = getDiffmacro(getDiff())
var Maxpagenum = getDiff()

var basename = getUsername()+String('(')+getUserID()+String(')')+String(' - ')+getTitle()+String('(')+getIllustID()+String(')')
var diffmacro = String(' [')+Pagenum2+String(' - ')+Maxpagenum2+String(']')
// basename+diffmacroにするかbasename2作るかは要検討
if(getDiff() == 0){
return　basename+Exttype;
}else{
return　basename+diffmacro+Exttype;

}
//とりあえずデフォはこれで、あとはタグに任意のやつが含まれてたらフォルダ分けぐらいはしたいなぁ（Ex:VOICEROID)
}


//dlボタンはしばらく忘れよう
/*
BT = function(){
  var img = $('<img>');
//  view-center-button>');
  //imgタグに追加する奴
  img.attr('src', chrome.extension.getURL('icon_32.png'));
  img.attr('draggable', false);
  var a = $('<a>');
  a.attr('href', 'javascript:void(0);');
    var main = function() {
    if(checkLogin() == true){
    a.one('click',dl());   
    }else{
    alert("ログイン状態を確認できませんでした");
    }
    div = $('<div>');
    div.attr('id', 'SD');
    div.append(a);
    var parent = $('.thum_large').eq(0);
    return parent.prepend(div);
  };
}*/
  dl = function(){
    var diff = getDiff();
    for(var num = 0; num <= diff ; num++){
      var filename = getFilename(num);
      var url = 'https:'+getSrcURL(num);
      console.log(filename);
      console.log(url);
      getFile(url,filename);
  }
  }

  getFile = function(url, filename) {
    return chrome.extension.sendMessage({
     type: 'download',
     url: url,
     filename: filename
    });
  };

  console.log('for Debug');
  console.log('get TagNum:'+getTagnum());
  console.log('get All Tag');
  getTags()
  console.log(getDiff())
  chrome.runtime.onMessage.addListener(function(request,sender){
console.log('login:'+checkLogin());
if (checkLogin() == true){
  //OK
  console.log("GetPageInfomation")
  console.log('Username:'+getUsername());  
  console.log('user_id:'+getUserID());  
  console.log('Title:'+getTitle());  
  console.log('illust_id:'+getIllustID());  
  console.log('差分数:'+getDiffmacro(getDiff()));  
  dl();

}
});
