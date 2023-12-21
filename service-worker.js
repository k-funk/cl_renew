const MESSAGE = 'clicked_browser_action';
chrome.action.onClicked.addListener(async (tab) => {
  // Send a message to the active tab
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { message: MESSAGE });
});
