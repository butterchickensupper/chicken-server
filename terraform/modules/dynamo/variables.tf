variable "environment" {
  type        = string
  description = "The environment for the infrastrcutrue (dev, test, prod)"
}

variable "table-name" {
  type        = string
  description = "The name of the table"
}

variable "dynamodb-addr" {
  type        = string
  description = "The localhost address for DynamodB"
  default     = "http://localhost:4566"
}

variable "json-file-path" {
  type        = string
  description = "The file path to the menu data"
  default     = null
}