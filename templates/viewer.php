<?php
  /** @var array $_ */
  /** @var OCP\IURLGenerator $urlGenerator */
  $urlGenerator = $_['urlGenerator'];
  $version = \OCP\App::getAppVersion('excalidraw');
  if (method_exists(\OC::$server, 'getContentSecurityPolicyNonceManager')) {
      $nonce = \OC::$server->getContentSecurityPolicyNonceManager()->getNonce();
  } else {
      $nonce = '';
  }
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Excalidraw</title>

    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <div id="root"></div>
    
    <script nonce="<?=$nonce?>" src="<?php p($urlGenerator->linkTo('excalidraw', 'js/viewer.js')) ?>?v=<?php p($version) ?>"></script>
</body>

</html>
