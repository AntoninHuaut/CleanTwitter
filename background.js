const filter = {
    urls: ["*://api.twitter.com/2/timeline/conversation/*", "*://api.twitter.com/2/guide*"]
};
const webRequestFlags = ['blocking'];

browser.webRequest.onBeforeRequest.addListener(page => {
        if (isActiveRun() || disableExtension) return;

        return {
            cancel: true,
        };
    },
    filter,
    webRequestFlags
);

const exclude = {
    timeout: null,
    timeout_duration: 1000 * 15,
    runnable: null,
    timer: 0
};

var disableExtension = false;

browser.browserAction.onClicked.addListener(() => {
    if (disableExtension) {
        stopRunnable();
        disableExtension = false;
    } else if (!isActiveRun()) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 255] });
        chrome.browserAction.setBadgeTextColor({ color: [255, 255, 255, 255] });

        exclude.runnable = setInterval(updateBadge, 1000);
        updateBadge();

        exclude.timeout = setTimeout(stopRunnable, exclude.timeout_duration);
    } else {
        stopRunnable();
        disableExtension = true;
        setBadgeText("∞");
    }

    setIcon();
});

function setIcon() {
    const path = isActiveRun() || disableExtension ? "icons/icon_color.png" : "icons/icon_black.png";
    chrome.browserAction.setIcon({
        path: path
    });
}

function stopRunnable() {
    if (!!exclude.runnable) clearInterval(exclude.runnable);
    if (!!exclude.timeout) clearTimeout(exclude.timeout);

    exclude.timeout = null;
    exclude.runnable = null;
    exclude.timer = 0;
    setBadgeText(null);
    setIcon();
}

function updateBadge() {
    const time = exclude.timeout_duration / 1000 - exclude.timer;
    setBadgeText(`${time}`);
    exclude.timer++;
}

function isActiveRun() {
    return !!exclude.timeout;
}

function setBadgeText(text) {
    chrome.browserAction.setBadgeText({ text: text });
}