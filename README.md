Strapi Deployment 

Task 1 – Exploring Strapi Locally
What I Did:
•	Cloned the official Strapi repo from GitHub.
•	Ran the project using yarn develop / npm run develop.
•	Explored the folder structure: api, components, config, extensions, public, etc.
•	Created a sample content type using the Strapi admin panel.
What I Learned:
•	How Strapi uses file-based architecture for content types.
•	Roles and permissions configuration.
Challenges:
•	Understanding folder conventions initially took time.
•	Needed to configure SQLite/PostgreSQL correctly for development.

Task 2: Create a Dockerfile to containerize the Strapi application and run it locally
What I Did:
•	Created a custom Dockerfile to containerize the Strapi app.
•	Used a multistage build to reduce image size.
•	Tested using docker build and docker run.
What I Learned:
•	How to containerize a Node.js-based CMS like Strapi.
•	Exposing port 1337 and managing persistent volumes.
Challenges:
•	Getting permissions for .cache and node_modules inside the container.
•	Required proper WORKDIR, COPY, and CMD.


Task 3 – Docker Compose: Strapi + PostgreSQL + Nginx
What I Did:
•	Created docker-compose.yml with:
o	strapi service
o	postgres service
o	nginx reverse proxy
•	Used Docker network to connect services.
•	Exposed Strapi dashboard at http://localhost.
What I Learned:
•	How to use Docker Compose for multi-container apps.
•	Networking between containers using a shared bridge.
•	Nginx reverse proxy and routing.
Challenges:
•	Managing environment variables for database credentials.
•	Nginx config required precise upstream target for Strapi.

Task 4 – Deploy Strapi on EC2 using Terraform + Docker
What I Did:
•	Created a Terraform script to:
o	Launch EC2 (Amazon Linux 2).
o	Use user_data to install Docker and run container.
•	Built Docker image locally and pushed to Docker Hub.
•	SSH’d into EC2 to validate deployment.
What I Learned:
•	Terraform EC2 provisioning with user_data automation.
•	How Docker containers run persistently on EC2.
•	Hardening EC2 with security groups.
Challenges:
•	Ensuring Docker image had correct DB credentials.
•	Debugging permission issues during docker run in user_data.

Task 5 – CI/CD using GitHub Actions + Terraform for EC2
What I Did:
•	Created .github/workflows/ci.yml to:
o	Build and tag Docker image on push.
o	Push to Docker Hub.
•	Created terraform.yml workflow to:
o	Manually trigger Terraform apply.
o	Use secrets for AWS access.
o	Pull latest image and redeploy on EC2.
What I Learned:
•	GitHub Actions matrix for CI/CD pipelines.
•	How to pass outputs between jobs and workflows.
•	CI/CD best practices using workflow_dispatch.
Challenges:
•	Syncing image tag between CI and Terraform.
•	Ensuring terraform apply was idempotent and used latest image.

Task 6 – Deploy Strapi to ECS Fargate via Terraform
What I Did:
•	Wrote Terraform to:
o	Use default VPC, create ECS cluster, task definition, service.
o	Push Docker image to ECR.
o	Create public ALB for accessing Strapi.
 What I Learned:
•	Fargate launch type vs EC2-backed ECS.
•	How to define tasks and services declaratively.
•	ALB target groups and listener rules.
Challenges:
•	Configuring proper IAM roles for ECS and task execution.
•	Making ALB accessible via browser using correct security groups and ports.

Task 7 – GitHub Actions to Build Image & Update ECS Task Definition
What I Did:
•	Added workflow to:
o	Build image, tag with commit SHA.
o	Push to ECR.
o	Update ECS Task Definition with new image.
o	Trigger ECS service deployment.
What I Learned:
•	Automating ECS task revision updates dynamically.
•	How GitHub Actions can interact with AWS using CLI.
•	Importance of jq for modifying JSON task definitions.
Challenges:
•	Needed dynamic image replacement logic using GitHub Actions.
•	Handled race conditions where deploy ran before image was available.

Task 8 – Add CloudWatch Logs and Metrics
 What I Did:
•	Created a Log Group /ecs/strapi via Terraform.
•	Updated Task Definition to use awslogs log driver.
•	Enabled ECS-level CPU/Memory metrics and alarms.
What I Learned:
•	CloudWatch integration with ECS Fargate.
•	Importance of observability for containerized apps.
•	How to configure dashboards for real-time monitoring.
Challenges:
•	Logs weren’t showing due to incorrect log group name.

Task 9 – Use AWS FARGATE-SPOT Instead of FARGATE
What I Did:
•	Modified Terraform to use capacity_provider_strategies with FARGATE_SPOT.
What I Learned:
•	How FARGATE_SPOT reduces cost.
•	Trade-offs between availability and pricing.
 Challenges:
•	ECS service was failing initially due to availability issues in spot instances.

Task 10 – Publish Strapi Project Content
 What I Did:
•	Logged into Strapi admin dashboard via ALB.
•	Created collections and singles (e.g., blog posts, authors).
•	Configured Roles & Permissions to expose public API.
 What I Learned:
•	Strapi’s built-in API and access control system.
•	How to expose secure and public endpoints.
Challenges:
•	Forgetting to allow public roles blocked APIs.

Task 11 – Blue/Green Deployment with CodeDeploy for ECS
What I Did:
•	Created:
o	ECS service with two Target Groups (Blue, Green).
o	ALB with listener rules.
o	CodeDeploy App & Deployment Group using Canary10Percent5Minutes.
•	Set up rollback and health checks.
What I Learned:
•	Canary vs AllAtOnce deployment strategies.
•	Traffic shifting with ALB listener rules.
•	Rollback mechanisms on failure.
Challenges:
•	YAML errors caused CodeDeploy to fail.

Task 12 – GitHub Actions for CodeDeploy + ECS Update (with S3)
What I Did:
•	Created a GitHub Actions workflow deploy.yml that:
o	Builds the Docker image, tags it with the GitHub commit SHA.
o	Pushes the image to Amazon ECR.
o	Uploads the appspec.yaml and files to an S3 bucket.
o	Registers a new ECS Task Definition using the updated image.
o	Triggers an AWS CodeDeploy deployment.
o	Uses CodeDeployDefault.ECSCanary10Percent5Minutes strategy.
What I Learned:
•	How to prepare and upload deployment artifacts (appspec.yaml) to S3.
•	Structure of appspec.yaml for ECS deployments using CodeDeploy.
•	Importance of content integrity in S3-hosted revisions.
•	Full CI/CD lifecycle using GitHub Actions + CodeDeploy.
Challenges:
•	YAML formatting errors in appspec.yaml initially caused CodeDeploy to fail with a not well-formed YAML error.
•	The root cause: although the appspec.yaml was dynamically updated with the latest Task Definition ARN, the older, unmodified version was being uploaded to S3, leading to a mismatch and invalid format.

