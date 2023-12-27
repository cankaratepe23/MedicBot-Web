npm run build;
ssh ubuntu@comaristan.cf "sudo rm -r /var/www/medicbot-gui/*"
scp -r .\dist\* ubuntu@comaristan.cf:/var/www/medicbot-gui/
