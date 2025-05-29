#!/bin/bash

echo "Copy the following URL:"
echo "chrome://certificate-manager/localcerts/usercerts"
echo "Press Enter to continue..."
read -r

start chrome --new-window

echo "Manually import the crt from the data/nginx directory"
echo "Press Enter to continue..."
read -r
