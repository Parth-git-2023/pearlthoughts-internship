provider "aws" {
  region = "us-east-2"
}

# Default VPC
data "aws_vpc" "default" {
  default = true
}

# Use only 2 subnets from different AZs
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

locals {
  selected_subnets = slice(data.aws_subnets.default.ids, 0, 2)
}

resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow HTTP"
  vpc_id      = data.aws_vpc.default.id

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

resource "aws_lb" "strapi_alb" {
  name               = "parth-strapi-alb"
  load_balancer_type = "application"
  subnets            = local.selected_subnets
  security_groups    = [aws_security_group.alb_sg.id]
}

resource "aws_lb_target_group" "blue" {
  name     = "parth-strapi-blue-tg"
  port     = 1337
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"
}

resource "aws_lb_target_group" "green" {
  name     = "parth-strapi-green-tg"
  port     = 1337
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
  target_type = "ip"
}

resource "aws_lb_listener" "listener" {
  load_balancer_arn = aws_lb.strapi_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.blue.arn
  }
}

resource "aws_ecs_cluster" "strapi_cluster" {
  name = "parth-strapi-cluster"
}

resource "aws_ecs_task_definition" "strapi_task" {
  family                   = "parth-strapi-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = "arn:aws:iam::607700977843:role/ecs-task-execution-role-p"

  container_definitions = jsonencode([
    {
      name  = "strapi"
      image = "607700977843.dkr.ecr.us-east-2.amazonaws.com/parth-strapi-ecr:latest"
      portMappings = [
        {
          containerPort = 1337
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "strapi_service" {
  name            = "parth-strapi-service"
  cluster         = aws_ecs_cluster.strapi_cluster.id
  task_definition = aws_ecs_task_definition.strapi_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  deployment_controller {
    type = "CODE_DEPLOY"
  }

  network_configuration {
    subnets         = local.selected_subnets
    assign_public_ip = true
    security_groups = [aws_security_group.alb_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.blue.arn
    container_name   = "strapi"
    container_port   = 1337
  }

  depends_on = [aws_lb_listener.listener]
}

resource "aws_codedeploy_app" "strapi_app" {
  name = "parth-strapi-codedeploy-app"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "strapi_group" {
  app_name              = aws_codedeploy_app.strapi_app.name
  deployment_group_name = "parth-strapi-deploy-group"
  service_role_arn      = "arn:aws:iam::607700977843:role/codedeploy-service-role-p"

  deployment_config_name = "CodeDeployDefault.ECSCanary10Percent5Minutes"

  ecs_service {
    cluster_name = aws_ecs_cluster.strapi_cluster.name
    service_name = aws_ecs_service.strapi_service.name
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  deployment_style {
    deployment_type = "BLUE_GREEN"
    deployment_option = "WITH_TRAFFIC_CONTROL"
  }

  blue_green_deployment_config {
    terminate_blue_instances_on_deployment_success {
      action = "TERMINATE"
      termination_wait_time_in_minutes = 5
    }

    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
      wait_time_in_minutes = 0
    }
  }

  load_balancer_info {
    target_group_pair_info {
      target_group {
        name = aws_lb_target_group.blue.name
      }
      target_group {
        name = aws_lb_target_group.green.name
      }

      prod_traffic_route {
        listener_arns = [aws_lb_listener.listener.arn]
      }
    }
  }
}
