provider "aws" {
  region = "us-east-2"
}

# Get default VPC
data "aws_vpc" "default" {
  default = true
}

# Get all subnets in default VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Choose 2 unique subnets in different AZs
locals {
  distinct_subnets = slice(distinct(data.aws_subnet_ids.default.ids), 0, 2)
}

resource "aws_security_group" "alb_sg" {
  name   = "parth-alb-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "parth_alb" {
  name               = "parth-strapi-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = local.distinct_subnets
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_lb_target_group" "parth_tg" {
  name        = "parth-strapi-tg"
  port        = 1337
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200"
  }
}

resource "aws_lb_listener" "parth_listener" {
  load_balancer_arn = aws_lb.parth_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.parth_tg.arn
  }
}

resource "aws_ecs_cluster" "parth_cluster" {
  name = "parth-strapi-cluster"
}

resource "aws_ecs_task_definition" "parth_task" {
  family                   = "parth-strapi-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = "arn:aws:iam::607700977843:role/ecs-task-execution-role"

  container_definitions = jsonencode([{
    name      = "parth-strapi"
    image     = var.ecr_image_url
    portMappings = [{
      containerPort = 1337
      protocol      = "tcp"
    }]
  }])
}

resource "aws_ecs_service" "parth_service" {
  name            = "parth-strapi-service"
  cluster         = aws_ecs_cluster.parth_cluster.id
  task_definition = aws_ecs_task_definition.parth_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = local.distinct_subnets
    security_groups = [aws_security_group.alb_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.parth_tg.arn
    container_name   = "parth-strapi"
    container_port   = 1337
  }

  depends_on = [aws_lb_listener.parth_listener]
}

# OPTIONAL: ECR repo only if you want Terraform to manage it
# REMOVE this block if GitHub Actions already creates it
# Or keep it with prevent_destroy to avoid future conflicts
resource "aws_ecr_repository" "parth_strapi" {
  name = "parth-strapi-ecr"

  lifecycle {
    prevent_destroy = true
    ignore_changes  = [image_tag_mutability, encryption_configuration]
  }
}
