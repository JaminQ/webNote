/*global require, chrome*/

require.load = function (context, module, url) {
    'use strict';
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', chrome.extension.getURL(url) + '?r=' + (new Date()).getTime(), true);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4 && xhr.status === 200) {
            eval(xhr.responseText);
            context.completeLoad(module);
        }
    };
    xhr.send(null);
};