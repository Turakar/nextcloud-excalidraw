<?php

namespace OCA\Excalidraw\AppInfo;

use OCA\Excalidraw\AppInfo\Application;

$eventDispatcher = \OC::$server->getEventDispatcher();

if (\OC::$server->getUserSession()->isLoggedIn()) {
    $eventDispatcher->addListener('OCA\Files::loadAdditionalScripts', function() {
        \OCP\Util::addStyle(Application::APP_ID, 'style');
        \OCP\Util::addScript(Application::APP_ID, 'excalidraw');
    });
}


$eventDispatcher->addListener('OCA\Files_Sharing::loadAdditionalScripts', function () {
    \OCP\Util::addStyle(Application::APP_ID, 'style');
    \OCP\Util::addScript(Application::APP_ID, 'excalidraw');
});

$app = \OC::$server->query(Application::class);
$app->register();
