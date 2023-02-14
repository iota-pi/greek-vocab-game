locals {
  application = "greek-game"
  standard_tags = {
    Environment = var.environment
    Application = local.application
  }
  force_api_redeploy = 1
}


# Lambda
resource "aws_lambda_function" "api" {
  function_name = "greek-game-api"

  handler     = "lambda.handler"
  runtime     = "nodejs16.x"
  memory_size = 512
  timeout     = 120

  s3_bucket        = var.code_bucket
  s3_key           = "greek-game/lambda.zip"
  source_code_hash = filebase64sha256("../lambda/build/lambda.zip")

  environment {
    variables = {
      SCORES_TABLE_NAME = aws_dynamodb_table.greek_scores.name
    }
  }

  role = aws_iam_role.broadcaster_role.arn
  tags = local.standard_tags
}

resource "aws_iam_role" "broadcaster_role" {
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "broadcaster_policy" {
  description = "Lambda policy to allow logging"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PutLogs",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": ["arn:aws:logs:*:*:*"]
    },
    {
      "Sid": "ReadWriteCreateTable",
      "Effect": "Allow",
      "Action": [
          "dynamodb:BatchGetItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:BatchWriteItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:CreateTable"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/${aws_dynamodb_table.greek_scores.name}"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "broadcaster_policy_attach" {
  role       = aws_iam_role.broadcaster_role.name
  policy_arn = aws_iam_policy.broadcaster_policy.arn
}


# DynamoDB
resource "aws_dynamodb_table" "greek_scores" {
  name         = "GreekScores_${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "session"

  attribute {
    name = "category"
    type = "S"
  }

  tags = local.standard_tags
}


# API Gateway
resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.greek_api_gateway.execution_arn}/*/*"
}


resource "aws_api_gateway_rest_api" "greek_api_gateway" {
  name        = "greek_api_gateway_${var.environment}"
  description = "Greek game gateway for API"
}

resource "aws_api_gateway_resource" "greek_api_proxy" {
  rest_api_id = aws_api_gateway_rest_api.greek_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.greek_api_gateway.root_resource_id
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "greek_api_proxy_method" {
  rest_api_id   = aws_api_gateway_rest_api.greek_api_gateway.id
  resource_id   = aws_api_gateway_resource.greek_api_proxy.id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "greek_lambda" {
  rest_api_id = aws_api_gateway_rest_api.greek_api_gateway.id
  resource_id = aws_api_gateway_method.greek_api_proxy_method.resource_id
  http_method = aws_api_gateway_method.greek_api_proxy_method.http_method

  integration_http_method = "POST"

  type = "AWS_PROXY"
  uri  = aws_lambda_function.api.invoke_arn
}

resource "aws_api_gateway_method" "greek_api_proxy_method_root" {
  rest_api_id   = aws_api_gateway_rest_api.greek_api_gateway.id
  resource_id   = aws_api_gateway_rest_api.greek_api_gateway.root_resource_id
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "greek_lambda_root" {
  rest_api_id = aws_api_gateway_rest_api.greek_api_gateway.id
  resource_id = aws_api_gateway_method.greek_api_proxy_method_root.resource_id
  http_method = aws_api_gateway_method.greek_api_proxy_method_root.http_method

  integration_http_method = "POST"

  type = "AWS_PROXY"
  uri  = aws_lambda_function.api.invoke_arn
}

resource "aws_api_gateway_deployment" "greek_api_deployment" {
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.greek_api_proxy.id,
      aws_api_gateway_method.greek_api_proxy_method.id,
      aws_api_gateway_method.greek_api_proxy_method_root.id,
      aws_api_gateway_integration.greek_lambda.id,
      aws_api_gateway_integration.greek_lambda_root.id,
      aws_cloudwatch_log_group.debugging.id,
    ]))
  }

  rest_api_id = aws_api_gateway_rest_api.greek_api_gateway.id
  stage_name  = var.environment
}


resource "aws_cloudwatch_log_group" "debugging" {
  name = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.greek_api_gateway.id}/${var.environment}"

  retention_in_days = 7
}

output "invoke_url" {
  value = aws_api_gateway_deployment.greek_api_deployment.invoke_url
}
