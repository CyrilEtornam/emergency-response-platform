-- docker/init-db.sql
CREATE DATABASE auth_db;
CREATE DATABASE incident_db;
CREATE DATABASE dispatch_db;
CREATE DATABASE analytics_db;

GRANT ALL PRIVILEGES ON DATABASE auth_db TO erp_user;
GRANT ALL PRIVILEGES ON DATABASE incident_db TO erp_user;
GRANT ALL PRIVILEGES ON DATABASE dispatch_db TO erp_user;
GRANT ALL PRIVILEGES ON DATABASE analytics_db TO erp_user;