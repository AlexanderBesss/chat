variable "aws_region" {
  default = "eu-central-1"
}

variable "DB_USERNAME" {
  default = "test"
}

variable "DB_PASSWORD" {
  description = "The password for the MySQL master user"
  sensitive   = true
  default     = "NewPassword123!" # hardcoded for testing
}

variable "DB_NAME" {
  default = "chat"
}
