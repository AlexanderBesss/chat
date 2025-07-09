terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "= 5.100"
    }
  }
  backend "s3" {
    bucket         = "terraform-state-bucket-chat-app"
    key            = "terraform.tfstate"
    region         = "eu-central-1"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}
