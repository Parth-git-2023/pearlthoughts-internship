variable "region" {
  default = "us-east-2"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  default = "strapi-key"
}

variable "image_tag" {
  description = "Full image path e.g. parthdoc/strapi:strapi-123456"
  type        = string
}
