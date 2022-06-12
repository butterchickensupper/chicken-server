########################
# dynamo module
########################
output "test1" {
  value = module.dynamo.main-table-id
}

output "test12" {
  value = module.dynamo.main-table-arn
}

########################
# lambda module
########################
output "test" {
  value = module.lambda.lambda_function_name
}

########################
# api_gateway module
########################
output "api_gw_name" {
  value = module.api_gateway.rest_name
}
output "api_test" {
  value = module.api_gateway.module_that_was_input
}
