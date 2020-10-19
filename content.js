// Inspired by https://robots.thoughtbot.com/how-to-make-a-chrome-extension
const MESSAGE = 'clicked_browser_action';

const postAllUrls = async urls => {
  try {
    const promises = urls.map(async url => {
      console.info(`Sending POST to ${url}`);
      await fetch(url, {
        method: 'POST',
        credentials: 'include',
      });
      // A successful call is a 302, so don't try to parse the response
    });

    return await Promise.all(promises);
  } catch (error) {
    console.error(error);
    throw new Error('There was an error when renewing at least one of the posts. Try again.');
  }
}

const getRenewUrls = () => {
  const action = 'renew';
  try {
    const renewInputs = document.querySelectorAll(`input[value=${action}][type="submit"]`);

    return [...renewInputs].map((input) => {
      const form = input.parentNode;

      const crypt = form.querySelector('input[name="crypt"]').value;
      const actionUrl = form.getAttribute('action');
      const data = { crypt, action };

      return `${actionUrl}?${new URLSearchParams(data)}`;
    });
  } catch (error) {
    console.error(error);
    throw new Error('There was an error while parsing the page.');
  }
}

chrome.runtime.onMessage.addListener(async ({ message }, sender, sendResponse) => {
  if(message !== MESSAGE) { return; }

  try {
    const urls = getRenewUrls();
    await postAllUrls(urls);

    // We already made the requests. Just let them know that we did before refreshing the page
    if (confirm(`Attempted to renew ${urls.length} posts.`)) {
      return window.location.reload();
    }
  } catch (error) {
    alert(error);
  }
});
