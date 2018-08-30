document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("btn").addEventListener("click", Action, false);
}, false);

function Action(){
  // 宣言・初期化
  let queryInfo = new Object();
  let youtubePages = [];
  // div要素の初期化
  $("#text").text("");

  // タブで開いてるURLを全件取得
  chrome.tabs.query(queryInfo, function(tabs){
    // コールバックされたオブジェクトの中からTitleとURLだけ取り出す
    tabs.forEach(tab => {
      youtubePages.push({
        "title": parseTitle(tab.title),
        "url": tab.url,
      });
    });

    // フィルタを用いてオブジェクトの中からyoutubeのURLを含むだけを抽出
    youtubePages = youtubePages.filter(isYoutube);

    // IDを追加
    youtubePages = addYoutubeId(youtubePages);

    // なかったとき
    if(!youtubePages.length > 0){
      $("#text").append("youtubeのURLを見つけられませんでした。").append('<br />');
    }else{
      // youtubeの再生リストを作成
      openPlayer(youtubePages);
    };
  });
}

// youtubeのURLのみにするフィルタ
function isYoutube(element){
  if(element["url"].match(/youtube.com\/watch\?/)){
    return element;
  }
}

// urlから動画のidを切り出しオブジェクトに格納する関数
function addYoutubeId(youtubePages){
  youtubePages.forEach(youtubePage => {
    let tmp = (youtubePage["url"].replace(/v=/, "*").split("*")[1])
    .split("&")[0];
    youtubePage["id"] = tmp;
  });
  return youtubePages;
}

// プレイリストを作る関数
function openPlayer(youtubePages){
  let url = location.href;
  let createProperties = {
    url: "/youtube.html"
  };
  let entity = {
    "youtubeAuto": youtubePages
  }
  chrome.storage.local.set(entity, function(){
    chrome.tabs.create(createProperties, function(){});
  });
}

// titleをparseする関数
function parseTitle(tabTitle){
  return tabTitle.replace(/^\([0-9]+\)| - YouTube$/g, "");
}