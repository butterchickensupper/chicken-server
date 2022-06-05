#############################
# DynamoDB
#############################
resource "aws_dynamodb_table" "main-table" {
  name           = var.table-name
  billing_mode   = "PROVISIONED"
  read_capacity  = 2
  write_capacity = 2
  hash_key       = "orderId"
  range_key      = "customerId"

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "customerId"
    type = "S"
  }

  attribute {
    name = "shipped"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi-shipped"
    hash_key        = "orderId"
    range_key       = "shipped"
    write_capacity  = 1
    read_capacity   = 1
    projection_type = "ALL"
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
