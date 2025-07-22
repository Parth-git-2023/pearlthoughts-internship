output "instance_public_ip" {
  value = aws_instance.strapi_ec2.public_ip
}

output "key_private_file" {
  value = "${path.module}/strapi-key.pem"
}
