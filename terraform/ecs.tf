
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

resource "aws_cloudwatch_log_group" "chat_app" {
  name              = "/ecs/chat-app"
  retention_in_days = 1
}

module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 5.12.1"

  cluster_name = "chat-app"

  services = {
    chat-app = {
      assign_public_ip = true
      cpu              = 256
      memory           = 512

      execution_role_arn = aws_iam_role.ecs_task_execution_role.arn

      container_definitions = {
        chat-app = {
          cpu       = 256
          memory    = 512
          essential = true
          image     = "294342628786.dkr.ecr.eu-central-1.amazonaws.com/test/chat-app:latest"

          port_mappings = [
            {
              name          = "chat-app"
              containerPort = 3000
              protocol      = "tcp"
            }
          ]
        }
      }

      subnet_ids      = data.aws_subnets.default.ids
      security_groups = [aws_security_group.ecs.id]
      inference_accelerator = []

      security_group_rules = {
        egress_all = {
          type        = "egress"
          from_port   = 0
          to_port     = 0
          protocol    = "-1"
          cidr_blocks = ["0.0.0.0/0"]
        }
      }

      log_configuration = {
        log_driver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.chat_app.name
          "awslogs-region"        = "eu-central-1"
          "awslogs-stream-prefix" = "chat-app"
        }
      }
    }
  }

  tags = {
    Environment = "Development"
    Project     = "Chat App"
  }
}
