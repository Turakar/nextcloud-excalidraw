#!/bin/bash

set -e

npx webpack --mode=development --debug --devtool inline-source-map --output-pathinfo
sudo docker exec nextcloud rm -r /var/www/html/apps/excalidraw
sudo docker cp . nextcloud:/var/www/html/apps/excalidraw
sudo docker exec nextcloud chown -R www-data:www-data /var/www/html/apps/excalidraw
