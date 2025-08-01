provider "aws" {
  region = "us-east-2"
}

# Default VPC and Subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnet" "subnet1" {
  id = "subnet-0906c244cfe901a9a"
}

data "aws_subnet" "subnet2" {
  id = "subnet-0cc813dd4d76bf797"
}

# ECS Cluster
resource "aws_ecs_cluster" "parth_cluster" {
  name = "parth-strapi-cluster"
}

# ALB Security Group
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

# ECS Service Security Group
resource "aws_security_group" "ecs_service_sg" {
  name   = "parth-ecs-service-sg"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port       = 1337
    to_port         = 1337
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ALB
resource "aws_lb" "parth_alb" {
  name               = "parth-strapi-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = [data.aws_subnet.subnet1.id, data.aws_subnet.subnet2.id]
  security_groups    = [aws_security_group.alb_sg.id]
}

# Target Groups (Blue and Green)
resource "aws_lb_target_group" "parth_tg_blue" {
  name        = "parth-strapi-blue"
  port        = 1337
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

resource "aws_lb_target_group" "parth_tg_green" {
  name        = "parth-strapi-green"
  port        = 1337
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
    matcher             = "200-399"
  }
}

# ALB Listener
resource "aws_lb_listener" "parth_listener" {
  load_balancer_arn = aws_lb.parth_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"
    forward {
      target_group {
        arn = aws_lb_target_group.parth_tg_blue.arn
        weight = 1
      }
    }
  }
}

# ECS Task Definition (placeholder)
resource "aws_ecs_task_definition" "parth_task" {
  family                   = "parth-strapi-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = "arn:aws:iam::607700977843:role/ecs-task-execution-role-p"

  container_definitions = jsonencode([{
    name      = "strapi"
    image     = var.ecr_image_url
    portMappings = [{
      containerPort = 1337
      protocol      = "tcp"
    }]
  }])
}

# ECS Service
resource "aws_ecs_service" "parth_service" {
  name            = "parth-strapi-service"
  cluster         = aws_ecs_cluster.parth_cluster.id
  task_definition = aws_ecs_task_definition.parth_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1
  deployment_controller {
    type = "CODE_DEPLOY"
  }

  network_configuration {
    subnets         = [data.aws_subnet.subnet1.id, data.aws_subnet.subnet2.id]
    security_groups = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.parth_tg_blue.arn
    container_name   = "strapi"
    container_port   = 1337
  }

  depends_on = [aws_lb_listener.parth_listener]
}

# CodeDeploy Application
resource "aws_codedeploy_app" "parth_codedeploy_app" {
  name = "parth-strapi-app"
  compute_platform = "ECS"
}

# CodeDeploy Deployment Group
resource "aws_codedeploy_deployment_group" "parth_deployment_group" {
  app_name               = aws_codedeploy_app.parth_codedeploy_app.name
  deployment_group_name  = "parth-strapi-dg"
  service_role_arn       = "arn:aws:iam::607700977843:role/codedeploy-service-role-p"

  deployment_config_name = "CodeDeployDefault.ECSCanary10Percent5Minutes"
  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  ecs_service {
    cluster_name = aws_ecs_cluster.parth_cluster.name
    service_name = aws_ecs_service.parth_service.name
  }

  load_balancer_info {
    target_group_pair_info {
      target_group {
        name = aws_lb_target_group.parth_tg_blue.name
      }
      target_group {
        name = aws_lb_target_group.parth_tg_green.name
      }

      prod_traffic_route {
        listener_arns = [aws_lb_listener.parth_listener.arn]
      }
    }
  }

  deployment_style {
    deployment_type = "BLUE_GREEN"
    deployment_option = "WITH_TRAFFIC_CONTROL"
  }

  depends_on = [aws_ecs_service.parth_service]
}

output "alb_dns_name" {
  value = aws_lb.parth_alb.dns_name
}
