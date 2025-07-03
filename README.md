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

### Lambda Dployment

I assume you have already configured AWS-CLI on your local machine (`aws configure`) and your AWS user has all required IAM roles (S3, Lambda, SQS, CloudFormation, etc).

To deploy the lambda, run: `make deploy-lambda-prod`

### Endpoints

By default, frontend chat should be avalidable at: http://localhost:3000, 

and 2 http endpoints: 
- http://localhost:3000/messages?skip=0&limit=10
- http://localhost:3000/messages/room?skip=0&limit=10
