# MongoDB Setup for OctoFit Tracker

## Overview
MongoDB has been installed and configured for the OctoFit Tracker application using Docker. The setup includes persistence, authentication, and is ready for integration with Django.

## Current Status
- **Status**: ✓ Running
- **Version**: MongoDB 8.2.5
- **Container**: mongodb (Docker)
- **Port**: 27017 (private - accessible on localhost)
- **Data Persistence**: Enabled with named volumes

## Connection Details
- **Host**: `localhost`
- **Port**: `27017`
- **Username**: `admin`
- **Password**: `password`
- **Authentication Database**: `admin`

## Django Integration

### Environment Variables
Add the following to your Django `.env` file:

```
MONGODB_URI=mongodb://admin:password@localhost:27017/octofit?authSource=admin
MONGO_DB_NAME=octofit
```

### Django Settings Example
```python
import os
from mongoengine import connect

# MongoDB Connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://admin:password@localhost:27017/octofit?authSource=admin')
connect('octofit', host=MONGODB_URI)
```

### PyMongo Connection Example
```python
from pymongo import MongoClient

client = MongoClient('mongodb://admin:password@localhost:27017/octofit?authSource=admin')
db = client['octofit']
```

## Scripts

### Start MongoDB
```bash
./start_mongodb.sh
```

### Verify MongoDB Status
```bash
./verify_mongodb.sh
```

## Management Commands

### Check MongoDB Status
```bash
docker ps | grep mongodb
```

### View MongoDB Logs
```bash
docker logs mongodb
```

### Connect to MongoDB Shell
```bash
docker exec -it mongodb mongosh --username admin --password password --authenticationDatabase admin
```

### Stop MongoDB
```bash
docker stop mongodb
```

### Start MongoDB (after stopping)
```bash
docker start mongodb
```

### Remove MongoDB Container (WARNING: Deletes data!)
```bash
docker stop mongodb
docker rm mongodb
```

## Database Persistence

MongoDB data is persisted using Docker named volumes:
- `mongodb_data`: Stores the actual database files
- `mongodb_config`: Stores configuration

These volumes survive container restarts and removals unless explicitly deleted.

### View Volumes
```bash
docker volume ls | grep mongodb
```

### Inspect Volume Location
```bash
docker volume inspect mongodb_data
```

## Verification Commands

### Test Connection
```bash
docker exec mongodb mongosh --eval "db.adminCommand('ping')" --username admin --password password --authenticationDatabase admin
```

### Check Port
```bash
netstat -tlnp | grep 27017
# or
ss -tlnp | grep 27017
```

### Process Check
```bash
ps aux | grep mongod
# or
docker ps | grep mongodb
```

## Troubleshooting

### MongoDB Not Responding
1. Check if container is running: `docker ps | grep mongodb`
2. View logs: `docker logs mongodb`
3. Restart: `./start_mongodb.sh`

### Port Already in Use
If port 27017 is already in use:
1. Find the process: `netstat -tlnp | grep 27017`
2. Kill the process (if appropriate) or modify the port mapping
3. Restart the container with a different port: 
   ```bash
   docker stop mongodb
   docker rm mongodb
   docker run -d --name mongodb -p 27018:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
   ```

### Connection Refused
1. Ensure MongoDB is running: `./verify_mongodb.sh`
2. Check firewall settings
3. Verify credentials are correct
4. Check network connectivity

## Security Notes

⚠️ **Important for Production**
- The current setup uses default credentials (admin/password)
- For production, change these credentials:
  ```bash
  docker stop mongodb
  docker rm mongodb
  # Create with secure password
  docker run -d --name mongodb -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=your_admin \
    -e MONGO_INITDB_ROOT_PASSWORD=your_secure_password \
    mongo:latest
  ```
- Restrict port 27017 access using firewall rules
- Never commit credentials to version control
- Use environment variables for connection strings

## Additional Resources

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [Docker MongoDB Image](https://hub.docker.com/_/mongo)
- [PyMongo Documentation](https://pymongo.readthedocs.io/)
- [MongoEngine Documentation](https://mongoengine-odm.readthedocs.io/)
