<?php

return ['routes' => [
    ['name' => 'display#showExcalidrawViewer', 'url' => '/', 'verb' => 'GET'],
    ['name' => 'FileHandling#save', 'url' => '/ajax/savefile', 'verb' => 'PUT'],
    ['name' => 'FileHandling#load', 'url' => '/ajax/loadfile', 'verb' => 'GET'],
    ['name' => 'PublicFileHandling#save', 'url' => '/share/save', 'verb' => 'PUT'],
    ['name' => 'PublicFileHandling#load', 'url' => '/public/{token}', 'verb' => 'GET'],
]];
