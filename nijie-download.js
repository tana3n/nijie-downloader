"use strict";

function checkLogin() {
  if (document.getElementsByClassName("login").length == 1) {
    return false;
  } else {
    return true;
  }
}

async function getSrcURL(PopUpPage, diff) {
  try {
    return getImage(PopUpPage, diff);
  } catch {
    return console.log("no detect img_diff");
  }
}

async function getImage(PopUpPage, diff) {
  return PopUpPage.getElementsByClassName("box-shadow999")[diff].src;
}

async function getPage(uri) {
  const res = await fetch(uri, { credentials: "include" });
  const text = await res.text();
  const PopUpPage = new DOMParser().parseFromString(text, "text/html");
  return PopUpPage;
}
async function getPopUpPage() {
  const uri =
    "https://nijie.info/view_popup.php?id=" +
    document.baseURI.match(/(?<=id=)[0-9]*/);
  console.log(uri);
  return await getPage(uri);
}

function getDiff(PopUpPage) {
  var diff = PopUpPage.getElementsByClassName("box-shadow999").length;
  if (diff == null) {
    return 0;
  } else {
    return diff;
  }
}

function getTag(Tagnum) {
  var e = document.getElementById("view-tag").querySelectorAll(".tag")[
    Tagnum
  ].innerText;
  return e.replace("*", ""); //replace Taglock
}
//タグ数取得
function getTagnum() {
  return document.getElementById("view-tag").querySelectorAll(".tag").length;
}

function getTags() {
  var Tagnum = getTagnum();
  for (var num = 0; num < Tagnum; num++) {
    console.log(getTag(num));
  }
}
//3桁枚はあり得る、のか……？
function getCurrentDiffmacro(num) {
  return ("" + (num + 1)).padStart(2, "0");
}
function getDiffmacro(num) {
  return ("" + (num)).padStart(2, "0");
}
//この3つは統合できそう&img videoは初手で判定させた方がきれいなので保留
function getIllustID() {
  try {
    return document
      .getElementById("img_filter")
      .querySelector("img")
      .getAttribute("illust_id");
  } catch {
    return document
      .getElementById("img_filter")
      .querySelector("video")
      .getAttribute("illust_id");
  }
}
function getUserID() {
  try {
    return document
      .getElementById("img_filter")
      .querySelector("img")
      .getAttribute("user_id");
  } catch {
    return document
      .getElementById("img_filter")
      .querySelector("video")
      .getAttribute("user_id");
  }
}
function getTitle() {
  try {
    return document
      .getElementById("img_filter")
      .querySelector("img")
      .getAttribute("alt");
  } catch {
    return document
      .getElementById("img_filter")
      .querySelector("video")
      .getAttribute("alt");
  }
}

function getUsername() {
  return document.getElementById("pro").querySelector("img").alt;
}

function getExttype(url) {
  return url.match(/\.[^.]+$/);
}

async function getFilename(uri, num, diff) {
  const Exttype = getExttype(uri);
  const Pagenum2 = getCurrentDiffmacro(num);
  const Maxpagenum2 = getDiffmacro(diff);

  var basename =
    getUsername() +
    String("(") +
    getUserID() +
    String(")") +
    String(" - ") +
    getTitle() +
    String("(") +
    getIllustID() +
    String(")");
  var diffmacro =
    String(" [") + Pagenum2 + String(" - ") + Maxpagenum2 + String("]");
  // basename+diffmacroにするかbasename2作るかは要検討
  if (diff <= 1) {
    return basename + Exttype;
  } else {
    return basename + diffmacro + Exttype;
  }
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
async function dl() {
  console.log("get TagNum:" + getTagnum());
  console.log("get All Tag");
  getTags();

  console.log("GetPageInfomation");
  console.log("Username:" + getUsername());
  console.log("user_id:" + getUserID());
  console.log("Title:" + getTitle());
  console.log("illust_id:" + getIllustID());

  // fetch popup.php
  const PopUp = await getPopUpPage();
  const diff = getDiff(PopUp);

  console.log(diff);

  for (var num = 0; num < diff; num++) {
    var url = await getSrcURL(PopUp, num);
    console.log(url);
    var filename = await getFilename(url, num, diff);
    console.log(filename);

    getFile(url, filename);
  }
}

function getFile(url, filename) {
  console.log(url);
  return chrome.runtime.sendMessage({
    type: "download",
    url: url,
    filename: filename,
  });
}

function main() {
  console.log("for Debug");
  chrome.runtime.onMessage.addListener(function (request, sender) {
    console.log("login:" + checkLogin());
    if (checkLogin()) {
      dl();
    } else {
      console.log("Failed login check");
    }
  });
}
main();
