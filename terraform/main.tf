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

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 9.0"

  enable_deletion_protection = false
  name               = "ecs-chat-alb-80"
  load_balancer_type = "application"
  internal           = false
  vpc_id             = data.aws_vpc.default.id
  subnets            = data.aws_subnets.default.ids

  security_group_ingress_rules = {
    http = {
      from_port   = 80
      to_port     = 80
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  target_groups = {
    ecs-chat = {
      backend_protocol = "HTTP"
      backend_port     = 80
      target_type      = "ip"
      create_attachment = false
      health_check = {
        path    = "/"
        matcher = "200-399"
      }
    }
  }

  listeners = {
    http = {
      port     = 80
      protocol = "HTTP"
      forward = {
        target_group_key = "ecs-chat"
      }
    }
  }

  tags = {
    Project = "Chat App"
  }
}

module "ecs" {
  source  = "terraform-aws-modules/ecs/aws"
  version = "~> 5.12.1"

  cluster_name = "ecs-chat-app"

  services = {
    chat-app = {
      cpu    = 256
      memory = 512

      container_definitions = {
        ecs-chat = {
          assign_public_ip = true
          cpu              = 256
          memory           = 512
          essential        = true
          image            = "nginx:latest"

          port_mappings = [
            {
              name          = "ecs-chat"
              containerPort = 80
              hostPort      = 80
              protocol      = "tcp"
            }
          ]
        }
      }

      service_connect_configuration = {
        enable_execute_command = true
        assign_public_ip       = true
        namespace              = aws_service_discovery_private_dns_namespace.this.name
        service = {
          client_alias = {
            port     = 80
            dns_name = "ecs-chat"
          }
          port_name      = "ecs-chat"
          discovery_name = "ecs-chat"
        }
      }

      load_balancer = {
        service = {
          target_group_arn = module.alb.target_groups.ecs-chat.arn
          container_name   = "ecs-chat"
          container_port   = 80
        }
      }

      subnet_ids = data.aws_subnets.default.ids

      security_group_rules = {
        alb_ingress_80 = {
          type                     = "ingress"
          from_port                = 80
          to_port                  = 80
          protocol                 = "tcp"
          description              = "Allow ALB to reach ECS service"
          source_security_group_id = module.alb.security_group_id
        }

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
