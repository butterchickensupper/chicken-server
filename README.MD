# Chicken Server

This is an example project to showcase how to use DynamoDB locally while leveraging Terraform, localstack, and noSQL Workbench for DynamoDB.

## Changing JSON Content

You can either replace the JSON content inside the file `static/raw-data.json` OR provide your own file. Just make sure you change the variable value `json-file-path` in the `terraform.tfvars` file. If you want to leverage the AWS CLI approach then follow the same steps, either replace `static/formatted-data.json` OR change the content inside. Just ensure that the content is in the correct format that DynamoDB expects (DynamoDB JSON).
