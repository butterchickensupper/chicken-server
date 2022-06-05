
output "lambda_function_arn" {
  value = aws_lambda_function.test_hello_lambda.invoke_arn
}

output "lambda_function_name" {
  value = aws_lambda_function.test_hello_lambda.function_name
}
