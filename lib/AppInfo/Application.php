<?php

namespace OCA\Excalidraw\AppInfo;

use OCP\AppFramework\App;
use OCP\EventDispatcher\IEventDispatcher;
use OCP\Files\IMimeTypeDetector;

class Application extends App {

    const APP_ID = 'excalidraw';

    public function __construct() {
        parent::__construct(self::APP_ID);
    }

    public function register() {
        $server = $this->getContainer()->getServer();

        /** @var IMimeTypeDetector $mimeTypeDetector */
        $mimeTypeDetector = $server->query(IMimeTypeDetector::class);

        // registerType without getAllMappings will prevent loading nextcloud's default mappings.
        $mimeTypeDetector->getAllMappings();
        $mimeTypeDetector->registerType('excalidraw', 'application/excalidraw');
    }
}
