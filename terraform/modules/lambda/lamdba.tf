data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "../src/services/index.js"
  output_path = "service.zip"
}

data "archive_file" "hello_lambda_zip" {
  type        = "zip"
  source_file = "../src/services/hello.js"
  output_path = "hello.zip"
}

resource "aws_lambda_function" "test_lambda" {
  filename         = "service.zip"
  function_name    = "test_lambda"
  role             = aws_iam_role.iam_for_lambda_tf.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs14.x"
}

resource "aws_lambda_function" "hello_lambda" {
  filename         = "hello.zip"
  function_name    = "hello_lambda"
  role             = aws_iam_role.iam_for_lambda_tf.arn
  handler          = "hello.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs14.x"
}

resource "aws_lambda_function" "hello_get_lambda" {
  filename         = "hello.zip"
  function_name    = "hello_get_lambda"
  role             = aws_iam_role.iam_for_lambda_tf.arn
  handler          = "hello.get"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  runtime          = "nodejs14.x"
}

# resource "aws_cloudwatch_log_group" "lambda_logs" {
#   name              = "aws/lambda/${aws_lambda_function.hello_lambda.function_name}"
#   retention_in_days = 30
# }

resource "aws_iam_role" "iam_for_lambda_tf" {
  name = "iam_for_lambda_tf"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.iam_for_lambda_tf.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
