terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Get the latest Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical's AWS account ID

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Create a security group
resource "aws_security_group" "vm_sg" {
  name        = "${var.instance_name}-sg"
  description = "Security group for ${var.instance_name}"

  # SSH access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidr
  }

  # Outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.instance_name}-sg"
  }
}

# Create EC2 instance with 4GB memory
resource "aws_instance" "vm" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type # t3.medium has 4GB RAM

  vpc_security_group_ids = [aws_security_group.vm_sg.id]
  key_name               = var.key_name

  root_block_device {
    volume_size = var.disk_size_gb
    volume_type = "gp3"
  }

  tags = {
    Name = var.instance_name
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get upgrade -y
              EOF
}
