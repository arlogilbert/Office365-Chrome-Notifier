(function(win){
    'use strict';
    
    var listeners = [], 
    doc = win.document, 
    MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
    observer;
    
    function ready(selector, fn){
        // Store the selector and callback to be monitored
        listeners.push({
            selector: selector,
            fn: fn
        });
        if(!observer){
            // Watch for changes in the document
            observer = new MutationObserver(check);
            observer.observe(doc.documentElement, {
                childList: true,
                subtree: true
            });
        }
        // Check if the element is currently in the DOM
        check();
    }
        
    function check(){
        // Check the DOM for elements matching a stored selector
        for(var i = 0, len = listeners.length, listener, elements; i < len; i++){
            listener = listeners[i];
            // Query for elements matching the specified selector
            elements = doc.querySelectorAll(listener.selector);
            for(var j = 0, jLen = elements.length, element; j < jLen; j++){
                element = elements[j];
                // Make sure the callback isn't invoked with the 
                // same element more than once
                if(!element.ready){
                    element.ready = true;
                    // Invoke the callback with the element
                    listener.fn.call(element, element);
                    observer.disconnect();
                }
            }
        }
    }

    // Expose `ready`
    win.ready = ready;
            
})(this);

ready('.o365cs-notifications-notificationPopupArea', function(){
 	Notification.requestPermission();
	var breakNotification = false;
	var OutlookMutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
	var mylist = document.querySelector('.o365cs-notifications-notificationPopupArea');
	var observer = new OutlookMutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (breakNotification == true) {
				return;
			}
			if (mutation.type == 'attributes' && mutation.attributeName == 'style' && mutation.target.style.display == 'block') {
				mutation.target.style.display = 'none';
				breakNotification = true;
				var elements = $(mutation.target.innerHTML);
				var sender = $('.wf-size-x14.o365cs-notifications-text.o365cs-segoeRegular', elements);
				//alert(sender[0].innerText);
				var content = $('.ms-fcl-ns', elements);
				//console.log(content[0].innerText);
				if (window.Notification) {
					  var notification = new Notification('Outlook.com', {
						type: 'basic',
					  	icon: 'data:image/png;base64,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',
					  	body: 'From: ' + sender[0].innerText + "\n" + content[0].innerText
  					});
  					setTimeout(notification.close.bind(notification), 4000);
  					notification.onclick = function () {
  						window.focus();
  						this.close();
  					};
				}
			}
		});
		breakNotification = false;
	});
	observer.observe(mylist, {
		attributes: true,
		childList: true,
		characterData: true
	});
});