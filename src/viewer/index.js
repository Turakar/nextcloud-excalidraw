/**
 * Checks if the page is displayed in an iframe. If not redirect to /.
 **/
function redirectIfNotDisplayedInFrame () {
    try {
        if (window.top != window) {
            return;
        }
    } catch (e) {}
    
    console.warn("viewer not loaded in iframe, redirecting...");
    window.location.href = '/';
}
redirectIfNotDisplayedInFrame();

/*(function() {
    var t = function(msg) {
        return window.parent.t('excalidraw', msg);
    };

    var Excalidraw = {
        _changed: false,
        _loadStatus: false,
        init: function() {
            var self = this;
            
            window.parent.OCA.Excalidraw.load(function(data){
                console.log(data);
            }, function(e) {
                console.log(e);
            });
        },
        // TODO
        initHotkey: function() {
            var self = this;
            $(document).keydown(function(e) {
                if((e.ctrlKey || e.metaKey) && e.which === 83){
                    self.save();
                    e.preventDefault();
                    return false;
                }
            });
        },
        bindEvent: function() {
            // var self = this;
            // $('#export-png').click(function(){
            //     self.exportPNG();
            // });
        },
        close: function() {
            var self = this;
            var doHide = function() {
                window.parent.OCA.Excalidraw.hide();
            }
            if (this._changed && window.parent.OCA.Excalidraw._file.supportedWrite) {
                window.parent.OC.dialogs.confirm(t('The file has not been saved. Is it saved?'),
                    t('Unsaved file'), function(result){
                    if (result) {
                        self.save(function(status){
                            if (status) {
                                doHide();
                            }
                        });
                    } else {
                        doHide();
                    }
                },true);
            } else {
                doHide();
            }
        },
        showMessage: function(msg, delay) {
            return window.parent.OCA.Excalidraw.showMessage(msg, delay);
        },
        hideMessage: function(id) {
            return window.parent.OCA.Excalidraw.hideMessage(id);
        },
        setStatusMessage: function(msg) {
            this.showMessage(msg);
        },
        // TODO
        save: function(callback) {
            var self = this;
            if (self._changed) {
                self.setStatusMessage(t('Saving...'));
                var data = JSON.stringify(minder.exportJson());
                window.parent.OCA.Excalidraw.save(data, function(msg){
                    self.setStatusMessage(msg);
                    self._changed = false;
                    if (undefined !== callback) {
                        callback(true, msg);
                    }
                }, function(msg){
                    self.setStatusMessage(msg);
                    if (undefined !== callback) {
                        callback(false, msg);
                    }
                });
            }
        },
        loadData: function() {
            var self = this;
            window.parent.OCA.Excalidraw.load(function(data){
                var obj = {"root":
                        {"data":
                                {"id":"bopmq"+String(Math.floor(Math.random() * 9e15)).substr(0, 7),
                                    "created":(new Date()).getTime(),
                                    "text":t('Main Topic')
                                },
                            "children":[]
                        },
                    "template":"default",
                    "theme":"fresh-blue",
                    "version":"1.4.43"
                };
                if (data !== ' ') {
                    try {
                        obj = JSON.parse(data);
                    } catch (e){
                        window.alert(t('This file is not a valid mind map file and may cause file ' +
                            'corruption if you continue editing.'));
                    }
                }
                minder.importJson(obj);
                if (data === ' ') {
                    self._changed = true;
                    self.save();
                }
                self._loadStatus = true;
                self._changed = false;

                // When file is readonly, hide autosave checkbox
                if (!window.parent.OCA.Excalidraw._file.writeable) {
                    $('#autosave-div').hide();
                }
                // When extension cannot write, hide save checkbox
                if (!window.parent.OCA.Excalidraw._file.supportedWrite) {
                    $('#save-div').hide();
                }
            }, function(msg){
                self._loadStatus = false;
                window.alert(t('Load file fail!') + msg);
                window.parent.OCA.Excalidraw.hide();
            });
        },
        isDataSchema: function (url) {
            var i = 0,
                ii = url.length;
            while (i < ii && url[i].trim() === '') {
                i++;
            }
            return url.substr(i, 5).toLowerCase() === 'data:';
        },
    };

    window.Excalidraw = Excalidraw;
})();

window.Excalidraw.init();*/

import React from "react";
import ReactDOM from "react-dom";

import App from "./App.js";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
