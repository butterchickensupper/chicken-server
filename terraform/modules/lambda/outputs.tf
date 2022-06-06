
output "lambda_function_arn" {
  value = aws_lambda_function.hello_lambda.invoke_arn
}

output "lambda_function_name" {
  value = aws_lambda_function.hello_lambda.function_name
}
