variable "aws_region" {
  description = "AWS region to deploy the VM"
  type        = string
  default     = "us-east-1"
}

variable "instance_name" {
  description = "Name tag for the EC2 instance"
  type        = string
  default     = "ubuntu-vm"
}

variable "instance_type" {
  description = "EC2 instance type (t3.medium has 4GB RAM)"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "Name of the SSH key pair to use for the instance"
  type        = string
  default     = ""
}

variable "disk_size_gb" {
  description = "Size of the root disk in GB"
  type        = number
  default     = 20
}

variable "allowed_ssh_cidr" {
  description = "CIDR blocks allowed to SSH into the instance"
  type        = list(string)
  default     = ["0.0.0.0/0"] # WARNING: Open to all IPs, restrict in production
}
