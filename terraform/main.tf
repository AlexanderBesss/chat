data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_service_discovery_private_dns_namespace" "this" {
  name        = "test"
  description = "Private namespace for ECS Service Connect"
  vpc         = data.aws_vpc.default.id
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ecs-tasks.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_security_group" "ecs" {
  name        = "ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  egress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow public access to ECS chat-app on port 3000"
  }

  tags = {
    Name = "ECS SG"
  }
}

module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 5.12.1"

  cluster_name = "chat-app"

  services = {
    chat-app = {
      assign_public_ip = true
      cpu    = 256
      memory = 512

      execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

      container_definitions = {
        chat-app = {
          cpu              = 256
          memory           = 512
          essential        = true
          image            = "294342628786.dkr.ecr.eu-central-1.amazonaws.com/test/chat-app:latest"

          port_mappings = [
            {
              name          = "chat-app"
              containerPort = 3000
              hostPort      = 3000
              protocol      = "tcp"
            }
          ]
        }
      }

      subnet_ids = data.aws_subnets.default.ids

      security_group_rules = {
        egress_all = {
          type        = "egress"
          from_port   = 0
          to_port     = 0
          protocol    = "-1"
          cidr_blocks = ["0.0.0.0/0"]
        }
      }

    }
  }

  tags = {
    Environment = "Development"
    Project     = "Chat App"
  }
}

module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "chat-app-mysql"
  engine     = "mysql"
  engine_version = "8.0"
  family               = "mysql8.0"
  major_engine_version = "8.0"

  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_encrypted      = false
  skip_final_snapshot    = true
  deletion_protection    = false

  manage_master_user_password = false
  db_name  =  var.DB_NAME
  username = var.DB_USERNAME
  port     = "3306"
  password    = var.DB_PASSWORD


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

resource "aws_security_group" "mysql" {
  name        = "mysql-sg"
  vpc_id      = data.aws_vpc.default.id
  description = "Allow ECS service to connect to RDS MySQL"

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
    cidr_blocks = ["0.0.0.0/0"]
    description     = "ECS access"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "MySQL SG"
  }
}
