# Chicken Server

[![CI Build](https://github.com/butterchickensupper/chicken-server/actions/workflows/main.yml/badge.svg)](https://github.com/butterchickensupper/chicken-server/actions/workflows/main.yml)

-TF + AWS
-local development uses localstack

## Local Dev

Run the following command in the root folder

```docker
docker-compose up -d
```

## Deploy the application

```terraform
terraform init && terraform plan -out="myplan"
terraform apply -auto-approve myplan
```

## View The Data

NoSQL Workbench should be used to view the local dynamoDb tables. Under Operation Builder, create new local connection for port: 4566.

## Clean Up

```terraform
terraform destroy -auto-approve
```
