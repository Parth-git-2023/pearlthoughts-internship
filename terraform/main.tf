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

resource "aws_lb" "strapi_alb" {
  name               = "parth-strapi-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = slice(data.aws_subnets.default.ids, 0, 2)

  security_groups = [aws_security_group.alb_sg.id]

  tags = {
    Name = "parth-strapi-alb"
  }
}

resource "aws_lb_target_group" "blue_tg" {
  name     = "parth-strapi-blue-tg"
  port     = 1337
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
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

resource "aws_lb_target_group" "green_tg" {
  name     = "parth-strapi-green-tg"
  port     = 1337
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.default.id
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

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.strapi_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "forward"

    forward {
      target_group {
        arn = aws_lb_target_group.blue_tg.arn
        weight = 1
      }

      target_group {
        arn = aws_lb_target_group.green_tg.arn
        weight = 0
      }

      stickiness {
        enabled  = false
        duration = 1
      }
    }
  }
}

resource "aws_security_group" "alb_sg" {
  name        = "parth-strapi-alb-sg"
  description = "Allow HTTP inbound"
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

resource "aws_security_group" "task_sg" {
  name        = "parth-strapi-task-sg"
  description = "Allow traffic from ALB"
  vpc_id      = data.aws_vpc.default.id

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

resource "aws_ecs_cluster" "strapi_cluster" {
  name = "parth-strapi-cluster"
}

resource "aws_ecs_task_definition" "strapi_task" {
  family                   = "parth-strapi-task"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = "512"
  memory                  = "1024"
  execution_role_arn      = "arn:aws:iam::607700977843:role/ecs-task-execution-role-p"

  container_definitions = jsonencode([
    {
      name  = "strapi"
      image = var.ecr_image_url
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
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets         = slice(data.aws_subnets.default.ids, 0, 2)
    security_groups = [aws_security_group.task_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.blue_tg.arn
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

resource "aws_codedeploy_app" "strapi_app" {
  name = "parth-strapi-codedeploy-app"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "strapi_deploy_group" {
  app_name              = aws_codedeploy_app.strapi_app.name
  deployment_group_name = "parth-strapi-deploy-group"
  service_role_arn      = "arn:aws:iam::607700977843:role/codedeploy-service-role-p"
  deployment_config_name = "CodeDeployDefault.ECSCanary10Percent5Minutes"

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
    }
  }

  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }

  ecs_service {
    cluster_name = aws_ecs_cluster.strapi_cluster.name
    service_name = aws_ecs_service.strapi_service.name
  }

  load_balancer_info {
    target_group_pair_info {
      target_group {
        name = aws_lb_target_group.blue_tg.name
      }

      target_group {
        name = aws_lb_target_group.green_tg.name
      }

      prod_traffic_route {
        listener_arns = [aws_lb_listener.http.arn]
      }
    }
  }
}
