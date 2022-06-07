########################
# Main Table
########################
output "main-table-id" {
  value = aws_dynamodb_table.main-table.id
}

output "main-table-arn" {
  value = aws_dynamodb_table.main-table.arn
}

output "main-table-stream-arn" {
  value = aws_dynamodb_table.main-table.stream_arn
}

########################
# Lambda module
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
