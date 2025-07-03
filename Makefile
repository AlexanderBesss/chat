LOCALSTACK_HOST=localhost
LOCALSTACK_PORT=4566
BUCKET_NAME=chat-message-processor
TIMEOUT=60
LAMBDA_DIR=lambda
CHAT_APP_DIR=chat-app

.PHONY: up down wait create-bucket deploy-lambda-local logs start-local list start-nest-app

up:
	docker compose up -d

down:
	docker compose down

wait:
	@echo "Waiting for LocalStack SQS at http://$(LOCALSTACK_HOST):$(LOCALSTACK_PORT)..."
	@start_time=$$(date +%s); \
	until aws --endpoint-url=http://$(LOCALSTACK_HOST):$(LOCALSTACK_PORT) sqs list-queues >/dev/null 2>&1; do \
		sleep 2; \
		now=$$(date +%s); \
		if [ $$((now - start_time)) -ge $(TIMEOUT) ]; then \
			echo "Timed out waiting for LocalStack."; \
			exit 1; \
		fi; \
	done; \
	echo "LocalStack is ready."

create-bucket:
	aws --endpoint-url=http://$(LOCALSTACK_HOST):$(LOCALSTACK_PORT) s3 mb s3://$(BUCKET_NAME) || true

deploy-lambda-local:
	cd $(LAMBDA_DIR) && npx serverless deploy --stage local

start-nest-app: 
	cd $(CHAT_APP_DIR) && npm start

logs:
	cd $(LAMBDA_DIR) && npx serverless logs -f processChatMessage --stage local

list:
	cd $(LAMBDA_DIR) && npx serverless info --stage local

start-local: up wait create-bucket deploy-lambda-local start-nest-app

install:
	(cd $(LAMBDA_DIR) && npm ci)
	(cd $(CHAT_APP_DIR) && npm ci)

deploy-lambda-prod:
	cd $(LAMBDA_DIR) && npx serverless deploy --stage prod
