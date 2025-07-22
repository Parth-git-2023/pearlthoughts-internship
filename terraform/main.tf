provider "aws" {
  region = var.region
}

resource "tls_private_key" "strapi_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "strapi_key" {
  key_name   = var.key_name
  public_key = tls_private_key.strapi_key.public_key_openssh
}

resource "local_file" "private_key_pem" {
  content              = tls_private_key.strapi_key.private_key_pem
  filename             = "${path.module}/strapi-key.pem"
  file_permission      = "0400"
  depends_on           = [tls_private_key.strapi_key]
}

resource "aws_security_group" "strapi_sg" {
  name        = "strapi-sg"
  description = "Allow SSH and HTTP"
  ingress = [
    {
      from_port   = 22
      to_port     = 22
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    },
    {
      from_port   = 1337
      to_port     = 1337
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
  egress = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]
}

resource "aws_instance" "strapi_ec2" {
  ami                         = "ami-0a695f0d95cefc163" # Ubuntu 22.04 us-east-2
  instance_type               = var.instance_type
  key_name                    = aws_key_pair.strapi_key.key_name
  vpc_security_group_ids      = [aws_security_group.strapi_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "StrapiInstance"
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt update -y",
      "sudo apt install -y docker.io",
      "sudo systemctl start docker",
      "sudo systemctl enable docker",
      "sudo docker stop strapi || true",
      "sudo docker rm strapi || true",
      "sudo docker pull ${var.image_tag}",
      "sudo docker run -d --name strapi -p 1337:1337 ${var.image_tag}"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = tls_private_key.strapi_key.private_key_pem
      host        = self.public_ip
    }
  }
}
