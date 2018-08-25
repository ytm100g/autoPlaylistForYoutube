// https://developers.google.com/youtube/iframe_api_reference
let playlist = [];

chrome.storage.local.get("youtubeAuto", function (value) {
  playlist = value["youtubeAuto"];
  // playlistの表示
  $.each(playlist, function(index, data){
    $("#video_playlist")
    .append(index + ": <a href='" + data["url"] + "' target=_new>" + data["title"])
    .append('</a><br />');
  });

  // IFrame Player APIを非同期にロード
  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/player_api";
  let firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // APIをダウンロードしたら<iframe>とYouTubeプレイヤーを生成
  let player;
});

// 次を再生
function playNext() {
  // プレイリストにビデオが残ってたら先頭のビデオを再生
  if (playlist.length > 0) {
    player.loadVideoById(playlist.shift()["id"]);
  }
}

function onYouTubePlayerAPIReady() {
  player = new YT.Player("player", {
    "height": "390",
    "width": "640",
    "videoId": playlist[0]["id"],
    "events": {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange,
      "onError": onPlayerError
    }
  });
  // 最初に再生する動画を先頭に指定したため再生待機から削除
  playlist.shift();
}

// プレイヤが準備できたら呼び出される
function onPlayerReady(event) {
  event.target.playVideo();
}

// ビデオが終わったら次を再生
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    playNext();
  }
}

// エラーが起きたら次を再生
function onPlayerError(event) {
  playNext();
}
