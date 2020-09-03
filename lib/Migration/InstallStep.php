<?php
namespace OCA\Excalidraw\Migration;

require \OC::$SERVERROOT . "/3rdparty/autoload.php";

use OCP\Migration\IOutput;
use OCP\Migration\IRepairStep;
use OCP\ILogger;
use OC\Core\Command\Maintenance\Mimetype\UpdateJS;
use Symfony\Component\Console\Input\StringInput;
use Symfony\Component\Console\Output\ConsoleOutput;

class InstallStep implements IRepairStep {

    /** @var ILogger */
    protected $logger;
    protected $updateJS;

    public function __construct(ILogger $logger, UpdateJS $updateJS) {
            $this->logger = $logger;
            $this->updateJS = $updateJS;
    }

    /**
    * Returns the step's name
    */
    public function getName() {
            return 'Install Excalidraw';
    }

    /**
    * @param IOutput $output
    */
    public function run(IOutput $output) {        
        $currentVersion = implode('.', \OC_Util::getVersion());

        $this->logger->info("Copy excalidraw icon to core/img directory.", ["app" => "excalidraw"]);
        $appImagePath = __DIR__ . '/../../img/excalidraw.svg';
        $coreImagePath = \OC::$SERVERROOT . '/core/img/filetypes/excalidraw.svg';
        if (!file_exists($coreImagePath) || md5_file($coreImagePath) !== md5_file($appImagePath)) {
            copy($appImagePath, $coreImagePath);
        }

        $configDir = \OC::$configDir;
        $mimetypealiasesFile = $configDir . 'mimetypealiases.json';
        $mimetypemappingFile = $configDir . 'mimetypemapping.json';

        $this->appendToFile($mimetypealiasesFile, ['application/excalidraw' => 'excalidraw']);
        $this->appendToFile($mimetypemappingFile, ['excalidraw' => ['application/excalidraw']]);
        $this->logger->info("Add .excalidraw to mimetype list.", ["app" => "excalidraw"]);
        $this->updateJS->run(new StringInput(''), new ConsoleOutput());
    }

    private function appendToFile(string $filename, array $data) {
        $obj = [];
        if (file_exists($filename)) {
            $content = file_get_contents($filename);
            $obj = json_decode($content, true);
        }
        foreach ($data as $key => $value) {
            $obj[$key] = $value;
        }
        file_put_contents($filename, json_encode($obj,  JSON_PRETTY_PRINT|JSON_UNESCAPED_SLASHES));
    }
}
