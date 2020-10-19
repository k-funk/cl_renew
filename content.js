// https://robots.thoughtbot.com/how-to-make-a-chrome-extension
const MESSAGE = 'clicked_browser_action';

chrome.runtime.onMessage.addListener(({ message }, sender, sendResponse) => {
  if(message !== MESSAGE) { return; }

  const renewForms = $("input[value='renew']:submit").parent();
  const promises = [];

  // Construct requests and gather promises
  $.each(renewForms, () => {
    const actionUrl = $(this).attr('action');
    const data = {
      crypt: $(this).children('input[name="crypt"]').val(),
      action: 'renew',
    };
    const urlWithQueryString = `${actionUrl}?${$.param(data)}`;

    const promise = $.ajax({
      type: 'POST',
      url: urlWithQueryString,
      xhrFields: {
        withCredentials: true,
      },
      crossDomain: true,
    })
    .always(() => {
      console.log(`POST sent to ${urlWithQueryString}`);
    })

    promises.push(promise);
  });

  $.when.apply($, promises).always(() => {
    if (confirm(`Attempted to renew ${promises.length} posts.`)) {
      window.location.reload();
    }
  });
});
