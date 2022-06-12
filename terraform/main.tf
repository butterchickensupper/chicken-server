module "dynamo" {
  source         = "./modules/dynamo"
  table-name     = var.table-name
  dynamodb-addr  = var.dynamodb-addr
  json-file-path = var.json-file-path
  environment    = var.environment
}

module "lambda" {
  source = "./modules/lambda"
}

module "api_gateway" {
  source        = "./modules/api_gateway"
  lambda_module = module.lambda
}
