variable "vpc_id" {}
variable "subnet_ids" {
  type = list(string)
}
variable "codedeploy_role_arn" {}
