var Excalidraw = {
    _currentContext: null,
    _file: {},
    _fileList: null,
    _lastTitle: '',
    _extensions: [],
    
    init: function() {
        this.registerExtension([OCA.Excalidraw.Extensions.Excalidraw]);
        this.registerFileActions();
    },

    registerExtension: function(objs) {
        var self = this;
        if (!Array.isArray(objs)) {
            objs = [objs];
        };
        objs.forEach(function(obj){
            self._extensions.push(obj);
        });        
    },

    getExtensionByMime: function(mime) {
        for (i = 0; i < this._extensions.length; i++) {
            var obj = this._extensions[i];
            if (obj.mimes.indexOf(mime) >= 0) {
                return obj;
            }
        }
        return null;
    },

    isSupportedMime: function(mime) {
        return this.getExtensionByMime(mime) !== null ? true : false;
    },

    showMessage: function(msg, delay, t) {
        var self = this;
        delay = delay || 3000;
        var id = OC.Notification.show(msg, t);
        setTimeout(function(){
            self.hideMessage(id);
        }, delay);
        return id;
    },

    hideMessage: function(id, t) {
        OC.Notification.hide(id, t);
    },

    hide: function() {
        $('#exframe').remove();
        if ($('#isPublic').val() && $('#filesApp').val()){
            $('#controls').removeClass('hidden');
            $('#content').removeClass('full-height');
            $('footer').removeClass('hidden');
        }

        if (!$('#mimetype').val()) {
            FileList.setViewerMode(false);
        }

        // replace the controls with our own
        // $('#app-content #controls').removeClass('hidden');
        $('#app-content #controls').show();

        document.title = this._lastTitle;

        if (!$('#mimetype').val()) {
            this._fileList.addAndFetchFileInfo(this._file.dir + '/' + this._file.name, '');
        } else {
            //TODO
        }
    },

    /**
     * @param downloadUrl
     * @param isFileList
     */
    show: function() {
        var self = this;
        var $iframe;
        var shown = true;
        var viewer = OC.generateUrl('/apps/excalidraw/');
        $iframe = $('<iframe id="exframe" style="width:100%;height:100%;display:block;position:absolute;top:0;' +
            'z-index:1041;" src="'+viewer+'" sandbox="allow-scripts allow-same-origin allow-popups allow-modals ' +
            'allow-top-navigation" allowfullscreen="true"/>');

        if (!$('#mimetype').val()) {
            FileList.setViewerMode(true);
        }

        if ($('#isPublic').val()) {
            // force the preview to adjust its height
            $('#preview').append($iframe).css({height: '100%'});
            $('body').css({height: '100%'});
            $('#content').addClass('full-height');
            $('footer').addClass('hidden');
            $('#imgframe').addClass('hidden');
            $('#controls').addClass('hidden');
        } else {
            $('#app-content').after($iframe);
        }

        $("#pageWidthOption").attr("selected","selected");
        // replace the controls with our own
        // $('#app-content #controls').addClass('hidden');
        $('#app-content #controls').hide();

        $('#exframe').on('load', function(){
            var iframe = $('#exframe').contents();

            // OC.Apps.hideAppSidebar();

            self._lastTitle = document.title;

            var filename = self._file.name ? self._file.name : $('#filename').val();
            document.title = filename + ' - ' + OC.theme.title;
        });

        if(!$('html').hasClass('ie8')) {
            history.pushState({}, '', '#excalidraw');
        }

        if(!$('html').hasClass('ie8')) {
            $(window).one('popstate', function () {
                self.hide();
            });
        }
    },

    save: function(data, success, fail) {
        var url = '';
        var path = this._file.dir + '/' + this._file.name;
        if (this._file.dir === '/') {
            path = '/' + this._file.name;
        }

        var plugin = this.getExtensionByMime(this._file.mime);
        if (plugin.encode === null) {
            fail(t('excalidraw', 'Does not support saving {extension} files.', {extension: plugin.name}));
            return;
        }

        plugin.encode(data).then(function(data) {
            var putObject = {
                filecontents: data,
                path: path
            };
    
            if ($('#isPublic').val()){
                putObject.token = $('#sharingToken').val();
                url = OC.generateUrl('/apps/excalidraw/share/save');
                if (OCA.Excalidraw.isSupportedMime($('#mimetype').val())) {
                    putObject.path = '';
                }
            } else {
                url = OC.generateUrl('/apps/excalidraw/ajax/savefile');
            }
    
    
            $.ajax({
                type: 'PUT',
                url: url,
                data: putObject
            }).done(function(){
                success(t('excalidraw', 'File Saved'));
            }).fail(function(jqXHR){
                var message = t('excalidraw', 'Save failed');
                try{
                    message = JSON.parse(jqXHR.responseText).message;
                }catch(e){}
                fail(message);
            });
        });        
    },

    load: function(success, failure) {
        var self = this;
        var filename = this._file.name;
        var dir = this._file.dir;
        var url = '';
        var sharingToken = '';
        var mimetype = $('#mimetype').val();
        if ($('#isPublic').val() && this.isSupportedMime(mimetype)) {
            sharingToken = $('#sharingToken').val();
            url = OC.generateUrl('/apps/excalidraw/public/{token}', {token: sharingToken});
        } else if ($('#isPublic').val()) {
            sharingToken = $('#sharingToken').val();
            url = OC.generateUrl('/apps/excalidraw/public/{token}?dir={dir}&filename={filename}',
                { token: sharingToken, filename: filename, dir: dir});
        } else {
            url = OC.generateUrl('/apps/excalidraw/ajax/loadfile?filename={filename}&dir={dir}',
                {filename: filename, dir: dir});
        }
        $.get(url).done(function(data) {
            data.filecontents = OCA.Excalidraw.Util.base64Decode(data.filecontents);
            var plugin = self.getExtensionByMime(data.mime);
            if (!plugin || plugin.decode === null) {
                fail(t('excalidraw', 'Unsupported file type: {mimetype}', {mimetype: data.mime}));
            }
            
            plugin.decode(data.filecontents).then(function(exdata){
                data.filecontents = typeof exdata === 'object' ? exdata : JSON.parse(exdata);
                data.supportedWrite = true;
                if (plugin.encode === null) {
                    data.writeable = false;
                    data.supportedWrite = false;
                }

                OCA.Excalidraw._file.writeable = data.writeable;
                OCA.Excalidraw._file.supportedWrite = data.supportedWrite;
                OCA.Excalidraw._file.mime = data.mime;
                OCA.Excalidraw._file.mtime = data.mtime;

                success(data.filecontents);
            }, function(e){
                failure(e);
            })
        }).fail(function(jqXHR) {
            failure(JSON.parse(jqXHR.responseText).message);
        });
    },

    /**
     * @param fileActions
     * @private
     */
    registerFileActions: function() {
        var mimes = this.getSupportedMimetypes(),
            _self = this;

        $.each(mimes, function(key, value) {
            OCA.Files.fileActions.registerAction({
                name: 'Edit',
                mime: value,
                actionHandler: _.bind(_self._onEditorTrigger, _self),
                permissions: OC.PERMISSION_READ,
                icon: function () {
                    return OC.imagePath('core', 'actions/edit');
                }
            });
            OCA.Files.fileActions.setDefault(value, 'Edit');
        });
    },

    _onEditorTrigger: function(fileName, context) {
        this._currentContext = context;
        this._file.name = fileName;
        this._file.dir = context.dir;
        this._fileList = context.fileList;
        var fullName = context.dir + '/' + fileName;
        if (context.dir === '/') {
            fullName = '/' + fileName;
        }
        this.show();
    },

    getSupportedMimetypes: function() {
        var result = [];
        this._extensions.forEach(function(obj){
            result = result.concat(obj.mimes);
        });
        return result;
    },
};

Excalidraw.Extensions = {};

Excalidraw.Extensions.Excalidraw = {
    name: 'excalidraw',
    mimes: ['application/excalidraw'],
    encode: function(data) {
        return new Promise(function(resolve, reject) {
            resolve(JSON.stringify(data));
        });
    },
    decode: function(data) {
        return new Promise(function(resolve, reject) {
            try {
                if(data.trim().length == 0) {
                    resolve({
                        type: "excalidraw",
                        version: 2,
                        source: "https://excalidraw.com",
                        elements: [],
                        appState: {
                            viewBackgroundColor: "#ffffff",
                            gridSize: null
                        }
                    });
                } else {
                    parsed = JSON.parse(data);
                    resolve(parsed);
                }
            } catch (e) {
                resolve(data);
            }
        });
    }
};

Excalidraw.Util = {
    base64Encode: function(string) {
        return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode(parseInt(p1, 16))
        }))
    },
    base64Decode: function(base64) {
        try {
            return decodeURIComponent(Array.prototype.map.call(atob(base64), function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            }).join(''));
        } catch (e) {
            var binary = atob(base64);
            var array = new Uint8Array(binary.length);
            for    (var i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            return new Blob([array]);
        }
    },
};

Excalidraw.NewFileMenuPlugin = {

    attach: function(menu) {
        var fileList = menu.fileList;

        // only attach to main file list, public view is not supported yet
        if (fileList.id !== 'files') {
            return;
        }

        // register the new menu entry
        menu.addMenuEntry({
            id: 'excalidrawfile',
            displayName: t('excalidraw', 'New excalidraw file'),
            templateName: t('excalidraw', 'New drawing.excalidraw'),
            iconClass: 'icon-excalidraw',
            fileType: 'application/excalidraw',
            actionHandler: function(name) {
                var dir = fileList.getCurrentDirectory();
                fileList.createFile(name).then(function() {
                    Excalidraw._onEditorTrigger(
                        name,
                        {
                            fileList: fileList,
                            dir: dir
                        }
                    );
                });
            }
        });
    }
};


OCA.Excalidraw = Excalidraw;

OC.Plugins.register('OCA.Files.NewFileMenu', Excalidraw.NewFileMenuPlugin);

$(document).ready(function(){
    OCA.Excalidraw.init();
    if ($('#isPublic').val() && OCA.Excalidraw.isSupportedMime($('#mimetype').val())) {
        var sharingToken = $('#sharingToken').val();
        var downloadUrl = OC.generateUrl('/s/{token}/download', {token: sharingToken});
        var viewer = OCA.Excalidraw;
        viewer.show(downloadUrl, false);
    }
});
