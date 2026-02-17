#!/bin/bash

# MongoDB Management Script for OctoFit Tracker
# Provides common MongoDB operations for development

set -e

function show_help() {
    cat << EOF
MongoDB Management Script for OctoFit Tracker

Usage: ./mongodb.sh [command]

Commands:
  start       - Start MongoDB container
  stop        - Stop MongoDB container
  restart     - Restart MongoDB container
  status      - Check MongoDB status
  logs        - Show MongoDB logs
  shell       - Open MongoDB shell
  verify      - Verify MongoDB connection
  create-db   - Create the octofit database
  backup      - Backup MongoDB data (to backup_mongodb_\$(date +%s).tar.gz)
  restore     - Restore MongoDB from backup
  clean       - Stop and remove MongoDB (WARNING: deletes data!)
  help        - Show this help message

Examples:
  ./mongodb.sh start
  ./mongodb.sh status
  ./mongodb.sh shell
  ./mongodb.sh backup
EOF
}

function start_mongodb() {
    echo "Starting MongoDB..."
    ./start_mongodb.sh
}

function stop_mongodb() {
    echo "Stopping MongoDB..."
    docker stop mongodb || echo "MongoDB not running"
}

function restart_mongodb() {
    echo "Restarting MongoDB..."
    stop_mongodb
    sleep 2
    start_mongodb
}

function check_status() {
    echo "Checking MongoDB status..."
    ./verify_mongodb.sh
}

function show_logs() {
    echo "MongoDB logs:"
    docker logs -f mongodb
}

function open_shell() {
    echo "Opening MongoDB shell..."
    docker exec -it mongodb mongosh --username admin --password password --authenticationDatabase admin
}

function verify_connection() {
    echo "Verifying MongoDB connection..."
    ./verify_mongodb.sh
}

function create_database() {
    echo "Creating octofit database..."
    docker exec mongodb mongosh --eval "
        use octofit;
        db.createCollection('users');
        print('Database and collection created');
    " --username admin --password password --authenticationDatabase admin
}

function backup_data() {
    BACKUP_FILE="backup_mongodb_$(date +%s).tar.gz"
    echo "Backing up MongoDB data to $BACKUP_FILE..."
    docker exec mongodb tar czf - /data/db | tar xzf - -C . 2>/dev/null || {
        echo "Using alternative backup method..."
        docker run --rm --volumes-from mongodb -v $(pwd):/backup alpine tar czf /backup/$BACKUP_FILE -C /data/db .
    }
    echo "✓ Backup created: $BACKUP_FILE"
}

function restore_data() {
    if [ -z "$1" ]; then
        echo "Usage: ./mongodb.sh restore <backup_file>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        echo "Backup file not found: $1"
        exit 1
    fi
    
    echo "Restoring from backup: $1"
    docker run --rm --volumes-from mongodb -v $(pwd):/backup alpine tar xzf /backup/$1 -C /
    echo "✓ Backup restored"
}

function clean_mongodb() {
    read -p "WARNING: This will delete all MongoDB data. Continue? (yes/no): " -r
    echo
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo "Stopping MongoDB..."
        docker stop mongodb || true
        echo "Removing container..."
        docker rm mongodb || true
        echo "Removing volumes..."
        docker volume rm mongodb_data mongodb_config || true
        echo "✓ MongoDB cleaned up"
    else
        echo "Cancelled"
    fi
}

# Main script logic
case "${1:-help}" in
    start)
        start_mongodb
        ;;
    stop)
        stop_mongodb
        ;;
    restart)
        restart_mongodb
        ;;
    status)
        check_status
        ;;
    logs)
        show_logs
        ;;
    shell)
        open_shell
        ;;
    verify)
        verify_connection
        ;;
    create-db)
        create_database
        ;;
    backup)
        backup_data
        ;;
    restore)
        restore_data "$2"
        ;;
    clean)
        clean_mongodb
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
