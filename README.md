### Software requirements:
- Node.js v22
- Docker 28
- AWS-CLI (for deployment)
- make - `sudo apt install make`
- OS: Linux, MacOS(maybe)

### Local testing:

To start the application locally, you need to follow two steps:
1. Install all dependencies in projects by running `make install`. 
2. Up all required resources (MySQL, localstack + configuration) and start all projects. You can do this by running a single command: `make start-local`.

### Lambda Deployment

I assume you have already configured AWS-CLI on your local machine (`aws configure`) and your AWS user has all required IAM roles (S3, Lambda, SQS, CloudFormation, etc).

Before deploying, you need to create an S3 bucket for the Lambda code. You can find the correct bucket name in the serverless.yml file under the `deploymentBucket` property.

To deploy the lambda, run: `make deploy-lambda-prod`

### Endpoints

By default, frontend chat should be available at: http://localhost:3000, 

and 2 http endpoints: 
- all messages: http://localhost:3000/messages?skip=0&limit=10
- all messages in a room: http://localhost:3000/messages/room?skip=0&limit=10
