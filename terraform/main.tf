provider "aws" {
  region = "us-east-2"
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

locals {
  selected_subnets = [
    "subnet-0906c244cfe901a9a",
    "subnet-0cc813dd4d76bf797"
  ]
}

resource "aws_ecr_repository" "strapi_repo" {
  name = "parth-strapi-repo"
}

resource "aws_lb" "parth_alb" {
  name               = "parth-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = local.selected_subnets
  security_groups    = [aws_security_group.parth_alb_sg.id]
}

resource "aws_security_group" "parth_alb_sg" {
  name        = "parth-alb-sg"
  description = "Allow HTTP/HTTPS"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
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

resource "aws_security_group" "parth_ecs_sg" {
  name        = "parth-ecs-sg"
  description = "Allow traffic from ALB to ECS on port 1337"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 1337
    to_port         = 1337
    protocol        = "tcp"
    security_groups = [aws_security_group.parth_alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb_target_group" "parth_tg_blue" {
  name        = "parth-tg-blue"
  port        = 1337
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    path                = "/"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "parth_tg_green" {
  name        = "parth-tg-green"
  port        = 1337
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    path                = "/"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "parth_listener" {
  load_balancer_arn = aws_lb.parth_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.parth_tg_blue.arn
  }
}

resource "aws_ecs_cluster" "parth_cluster" {
  name = "parth-strapi-cluster"
}

resource "aws_ecs_task_definition" "parth_task" {
  family                   = "parth-strapi-task"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  network_mode             = "awsvpc"
  execution_role_arn       = "arn:aws:iam::607700977843:role/ecs-task-execution-role-p"

  container_definitions = jsonencode([
    {
      name      = "strapi",
      image     = "607700977843.dkr.ecr.us-east-2.amazonaws.com/parth-strapi-repo:latest",
      essential = true,
      portMappings = [
        {
          containerPort = 1337,
          hostPort      = 1337,
          protocol      = "tcp"
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "parth_service" {
  name            = "parth-strapi-service"
  cluster         = aws_ecs_cluster.parth_cluster.id
  task_definition = aws_ecs_task_definition.parth_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = local.selected_subnets
    assign_public_ip = true
    security_groups  = [aws_security_group.parth_ecs_sg.id]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.parth_tg_blue.arn
    container_name   = "strapi"
    container_port   = 1337
  }

  deployment_controller {
    type = "CODE_DEPLOY"
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}

resource "aws_codedeploy_app" "parth_app" {
  name             = "parth-strapi-codedeploy-app"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "parth_deploy_group" {
  app_name               = aws_codedeploy_app.parth_app.name
  deployment_group_name  = "parth-strapi-deploy-group"
  service_role_arn       = "arn:aws:iam::607700977843:role/codedeploy-service-role-p"
  deployment_config_name = "CodeDeployDefault.ECSCanary10Percent5Minutes"

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  blue_green_deployment_config {
    terminate_blue_instances_on_deployment_success {
      action                              = "TERMINATE"
      termination_wait_time_in_minutes    = 5
    }

    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }
  }

  deployment_style {
    deployment_option = "WITH_TRAFFIC_CONTROL"
    deployment_type   = "BLUE_GREEN"
  }

  ecs_service {
    cluster_name = aws_ecs_cluster.parth_cluster.name
    service_name = aws_ecs_service.parth_service.name
  }

  load_balancer_info {
    target_group_pair_info {
      prod_traffic_route {
        listener_arns = [aws_lb_listener.parth_listener.arn]
      }

      target_group {
        name = aws_lb_target_group.parth_tg_blue.name
      }

      target_group {
        name = aws_lb_target_group.parth_tg_green.name
      }
    }
  }
}
