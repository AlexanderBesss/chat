variable "aws_region" {
  default = "eu-central-1"
}

variable "db_username" {
  default = "admin"
}

variable "db_password" {
  description = "The password for the MySQL master user"
  sensitive   = true
  default     = "test123"
}

variable "db_name" {
  default = "chat"
}
