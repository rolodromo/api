
echo "Backing...."
mongodump  -u rolodromodb -p 16d4c7806f6321438d2c3a02cae8d135 --host 159.89.15.172 --port 17042 -d rolodromodb --out ./backup/

echo "Restoring...."
mongorestore ./backup/rolodromodb/  -d rolodromo-local --drop
