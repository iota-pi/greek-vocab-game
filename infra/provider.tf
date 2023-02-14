terraform {
  required_version = ">= 1.1"

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }

  backend "s3" {
    bucket         = "crosscode-terraform-state"
    key            = "greek-game/terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "CrossCodeTerraformLocking"
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

provider "aws" {
  region = "us-east-1"
  alias  = "us_east_1"
}

provider "cloudflare" {
}
