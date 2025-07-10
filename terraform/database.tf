module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier           = "chat-app-mysql"
  engine               = "mysql"
  engine_version       = "8.0"
  family               = "mysql8.0"
  major_engine_version = "8.0"

  instance_class = "db.t4g.micro"
  allocated_storage = 10
  storage_encrypted   = false
  skip_final_snapshot = true
  deletion_protection = false

  manage_master_user_password = false
  db_name                     = var.DB_NAME
  username                    = var.DB_USERNAME
  port                        = "3306"
  password                    = var.DB_PASSWORD


  create_db_subnet_group = true
  subnet_ids             = data.aws_subnets.default.ids

  vpc_security_group_ids = [aws_security_group.mysql.id]

  publicly_accessible = true
  multi_az            = false

  tags = {
    Environment = "Development"
    Project     = "Chat App"
  }
}
