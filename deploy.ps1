npm run build;
ssh ubuntu@comaristan.com "sudo rm -r /var/www/medicbot-gui/*"
scp -r .\dist\* ubuntu@comaristan.com:/var/www/medicbot-gui/
