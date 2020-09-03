#!/bin/bash

set -e

make
make appstore
tar -xzf build/artifacts/appstore/nextcloud-excalidraw.tar.gz -C build/artifacts/appstore/
sudo docker exec nextcloud rm -rf /var/www/html/apps/excalidraw
sudo docker cp build/artifacts/appstore/nextcloud-excalidraw nextcloud:/var/www/html/apps/excalidraw
sudo docker exec nextcloud chown -R www-data:www-data /var/www/html/apps/excalidraw
