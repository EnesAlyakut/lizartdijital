CREATE DATABASE IF NOT EXISTS lizart
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'lizart'@'localhost' IDENTIFIED BY 'lizart';
CREATE USER IF NOT EXISTS 'lizart'@'%' IDENTIFIED BY 'lizart';

GRANT ALL PRIVILEGES ON lizart.* TO 'lizart'@'localhost';
GRANT ALL PRIVILEGES ON lizart.* TO 'lizart'@'%';

FLUSH PRIVILEGES;
