const filter = {
    urls: ["*://api.twitter.com/2/timeline/conversation/*", "*://api.twitter.com/2/guide*"]
};
const webRequestFlags = ['blocking'];

browser.webRequest.onBeforeRequest.addListener(page => {
        if (isActiveRun()) return;

        return {
            cancel: true,
        };
    },
    filter,
    webRequestFlags
);

const exclude = {
    timeout: null,
    timeout_duration: 1000 * 5,
    runnable: null,
    timer: 0
}

browser.browserAction.onClicked.addListener(() => {
    if (!isActiveRun()) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
        chrome.browserAction.setBadgeTextColor({ color: [255, 255, 255, 255] });

        exclude.runnable = setInterval(updateBadge, 1000);
        updateBadge();

        exclude.timeout = setTimeout(() => {
            clearInterval(exclude.runnable);
            exclude.timeout = null;
            exclude.runnable = null;
            exclude.timer = 0;
            chrome.browserAction.setBadgeText({ text: null });
        }, exclude.timeout_duration);
    }
});

function updateBadge() {
    const time = exclude.timeout_duration / 1000 - exclude.timer;
    chrome.browserAction.setBadgeText({ text: `${time}` });
    exclude.timer++;
}

function isActiveRun() {
    return !!exclude.timeout;
}