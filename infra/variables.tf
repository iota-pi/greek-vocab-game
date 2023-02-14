variable "environment" {
  type    = string
  default = "production"
}

variable "code_bucket" {
  type    = string
  default = "crosscode-lambdas"
}

variable "root_domain" {
  type    = string
  default = "cross-code.org"
}

variable "cloudflare_zone_id" {
  type    = string
  default = "1c8492a5fb75b8646814b0d4dcfe314c"
}
