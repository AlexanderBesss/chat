variable "aws_region" {
  default = "eu-central-1"
}

variable "DB_USERNAME" {
  default = "admin"
}

variable "DB_PASSWORD" {
  description = "The password for the MySQL master user"
  sensitive   = true
  default     = "test123" # hardcoded for testing
}

variable "DB_NAME" {
  default = "chat"
}

variable "aws_raw_sqs_url" {
  default = "https://sqs.eu-central-1.amazonaws.com/294342628786/RawChatMessageQ"
}

variable "aws_clean_sqs_url" {
  default = "https://sqs.eu-central-1.amazonaws.com/294342628786/CleanChatMessageQ"
}