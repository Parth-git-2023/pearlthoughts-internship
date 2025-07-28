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
  distinct_subnets = slice(distinct(data.aws_subnets.default.ids), 0, 2)
}

# ALB Security Group (allows internet traffic on port 80)
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

# ECS Task Security Group (allows traffic from ALB on 1337)
resource "aws_security_group" "ecs_service_sg" {
  name   = "parth-ecs-strapi-sg"
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

  tags = {
    Name = "ecs-strapi-sg"
  }
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "strapi_logs" {
  name              = "/ecs/strapi-parth-logs"
  retention_in_days = 7
}

# ALB
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

# ECS Cluster
resource "aws_ecs_cluster" "parth_cluster" {
  name = "parth-strapi-cluster"
}

# ECS Task Definition with CloudWatch Logs
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
    }],
    logConfiguration = {
      logDriver = "awslogs",
      options = {
        awslogs-group         = "/ecs/strapi-parth-logs",
        awslogs-region        = "us-east-2",
        awslogs-stream-prefix = "ecs/strapi"
      }
    }
  }])
}

# ECS Service
resource "aws_ecs_service" "parth_service" {
  name            = "parth-strapi-service"
  cluster         = aws_ecs_cluster.parth_cluster.id
  task_definition = aws_ecs_task_definition.parth_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = local.distinct_subnets
    security_groups  = [aws_security_group.ecs_service_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.parth_tg.arn
    container_name   = "parth-strapi"
    container_port   = 1337
  }

  depends_on = [aws_lb_listener.parth_listener]
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "high-cpu-strapi"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Alarm when ECS CPU > 80%"
  dimensions = {
    ClusterName = aws_ecs_cluster.parth_cluster.name
    ServiceName = aws_ecs_service.parth_service.name
  }
}

resource "aws_cloudwatch_metric_alarm" "high_memory" {
  alarm_name          = "high-memory-strapi"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = 60
  statistic           = "Average"
  threshold           = 80
  alarm_description   = "Alarm when ECS Memory > 80%"
  dimensions = {
    ClusterName = aws_ecs_cluster.parth_cluster.name
    ServiceName = aws_ecs_service.parth_service.name
  }
}

# Optional CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "strapi_dashboard" {
  dashboard_name = "strapi-dashboard"
  dashboard_body = jsonencode({
    widgets = [
      {
        type = "metric",
        x = 0,
        y = 0,
        width = 12,
        height = 6,
        properties = {
          metrics = [
            [ "AWS/ECS", "CPUUtilization", "ClusterName", aws_ecs_cluster.parth_cluster.name, "ServiceName", aws_ecs_service.parth_service.name ],
            [ ".", "MemoryUtilization", ".", ".", ".", "." ]
          ],
          view   = "timeSeries",
          stacked = false,
          region = "us-east-2",
          title  = "Strapi ECS Metrics"
        }
      }
    ]
  })
}