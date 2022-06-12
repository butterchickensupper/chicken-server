resource "aws_dynamodb_table" "main-table" {
  name           = var.table-name
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "partitionKey"
  range_key      = "sortKey"

  attribute {
    name = "partitionKey"
    type = "S"
  }

  attribute {
    name = "sortKey"
    type = "S"
  }
  tags = {
    Name        = "${var.table-name}-${var.environment}"
    Environment = var.environment
  }
}

resource "null_resource" "init-db" {
  // This will cause the upload script to only execute when the table changes id (recreate). 
  triggers = {
    new = aws_dynamodb_table.main-table.id
  }
  provisioner "local-exec" {
    command = <<EOT
      aws dynamodb batch-write-item --request-items ${var.json-file-path} --endpoint-url ${var.dynamodb-addr}
    EOT
  }
  depends_on = [aws_dynamodb_table.main-table]
}
