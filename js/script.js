const copyTitleURL = function()
{
    alert("拡張機能を実行しました");
};
 
(function()
{
    chrome.browserAction.onClicked.addListener(copyTitleURL);
})();