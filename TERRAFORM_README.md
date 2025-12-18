# Terraform AWS Ubuntu VM Configuration

This Terraform configuration creates an AWS EC2 instance with 4GB of memory running the latest Ubuntu 22.04 LTS image.

## Features

- **Memory**: 4GB RAM (t3.medium instance type)
- **OS**: Latest Ubuntu 22.04 LTS (Jammy Jellyfish)
- **Storage**: 20GB GP3 volume (configurable)
- **Security**: Security group with SSH access
- **Auto-updates**: User data script to update packages on first boot

## Prerequisites

1. **AWS Account**: You need an AWS account with appropriate permissions
2. **AWS CLI**: Install and configure AWS CLI with your credentials
   ```bash
   aws configure
   ```
3. **Terraform**: Install Terraform (version >= 1.0)
   - Download from: https://www.terraform.io/downloads
4. **SSH Key Pair**: Create an SSH key pair in AWS EC2 console or via CLI

## Quick Start

### 1. Initialize Terraform

```bash
terraform init
```

### 2. Review the Plan

```bash
terraform plan
```

### 3. Deploy the VM

```bash
terraform apply
```

You'll be prompted to confirm. Type `yes` to proceed.

### 4. Get Connection Information

After deployment, Terraform will output the instance details:

```bash
terraform output
```

## Configuration

### Basic Configuration

Create a `terraform.tfvars` file to customize your deployment:

```hcl
aws_region    = "us-east-1"
instance_name = "my-ubuntu-vm"
key_name      = "my-ssh-key"  # Your AWS SSH key pair name
disk_size_gb  = 30
```

### Available Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region to deploy | `us-east-1` |
| `instance_name` | Name tag for the instance | `ubuntu-vm` |
| `instance_type` | EC2 instance type | `t3.medium` (4GB RAM) |
| `key_name` | SSH key pair name | `""` (empty) |
| `disk_size_gb` | Root disk size in GB | `20` |
| `allowed_ssh_cidr` | CIDR blocks for SSH access | `["0.0.0.0/0"]` |

### Instance Types with 4GB RAM

- `t3.medium` (default) - 2 vCPUs, 4GB RAM
- `t2.medium` - 2 vCPUs, 4GB RAM (older generation)

## SSH Access

### Connect to Your VM

After deployment, use the SSH command from the output:

```bash
ssh -i ~/.ssh/your-key.pem ubuntu@<PUBLIC_IP>
```

Or get the command directly:

```bash
terraform output ssh_connection_command
```

### Security Warning

By default, SSH access is open to all IP addresses (`0.0.0.0/0`). For production use, restrict this to your IP:

```hcl
allowed_ssh_cidr = ["YOUR_IP/32"]
```

## Outputs

After deployment, the following information is available:

- `instance_id` - EC2 instance ID
- `instance_public_ip` - Public IP address
- `instance_private_ip` - Private IP address
- `instance_public_dns` - Public DNS name
- `ubuntu_ami_id` - AMI ID used
- `ubuntu_ami_name` - Full AMI name
- `ssh_connection_command` - Ready-to-use SSH command

## Managing Your VM

### View Current State

```bash
terraform show
```

### Destroy the VM

When you're done, clean up resources:

```bash
terraform destroy
```

## Cost Estimation

Approximate AWS costs (us-east-1):
- **t3.medium instance**: ~$0.0416/hour (~$30/month)
- **20GB GP3 storage**: ~$1.60/month
- **Data transfer**: Variable based on usage

**Total**: ~$32/month for basic usage

## Troubleshooting

### SSH Key Issues

If you don't have an SSH key pair:

```bash
# Create a key pair in AWS
aws ec2 create-key-pair --key-name my-key --query 'KeyMaterial' --output text > ~/.ssh/my-key.pem
chmod 400 ~/.ssh/my-key.pem
```

Then set `key_name = "my-key"` in your configuration.

### Connection Timeout

- Check security group rules
- Verify your IP is in `allowed_ssh_cidr`
- Ensure the instance is in "running" state

### Latest Ubuntu Version

The configuration automatically fetches the latest Ubuntu 22.04 LTS AMI. To use a different version, modify the filter in `main.tf`:

```hcl
# For Ubuntu 20.04 LTS
values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]

# For Ubuntu 24.04 LTS (when available)
values = ["ubuntu/images/hvm-ssd/ubuntu-noble-24.04-amd64-server-*"]
```

## File Structure

```
.
├── main.tf           # Main configuration and resources
├── variables.tf      # Input variables
├── outputs.tf        # Output values
└── TERRAFORM_README.md    # This file
```

## Next Steps

After your VM is running, you might want to:

1. Install additional software via SSH
2. Configure firewalls/security groups for your applications
3. Set up monitoring and backups
4. Attach additional EBS volumes if needed
5. Configure Elastic IP for a static public IP

## Support

For issues or questions:
- Terraform docs: https://www.terraform.io/docs
- AWS EC2 docs: https://docs.aws.amazon.com/ec2/
- Ubuntu Cloud Images: https://cloud-images.ubuntu.com/
