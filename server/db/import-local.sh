#!/bin/sh
mongoimport --authenticationDatabase admin --username root --password example --host mongodb --db creditpulse --collection purchases --type json --file /seed-purchases.json --jsonArray
echo "import local data to MongoDB completed"