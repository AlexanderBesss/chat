resource "aws_ecr_repository" "chat_app" {
  name = "test/chat-app"

  image_tag_mutability = "MUTABLE"

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Project     = "Chat App"
    Environment = "Test"
  }
}

resource "aws_ecr_lifecycle_policy" "chat_app_policy" {
  repository = aws_ecr_repository.chat_app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep only latest 2 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 2
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
