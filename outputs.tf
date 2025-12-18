output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.vm.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.vm.public_ip
}

output "instance_private_ip" {
  description = "Private IP address of the EC2 instance"
  value       = aws_instance.vm.private_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.vm.public_dns
}

output "ubuntu_ami_id" {
  description = "ID of the Ubuntu AMI used"
  value       = data.aws_ami.ubuntu.id
}

output "ubuntu_ami_name" {
  description = "Name of the Ubuntu AMI used"
  value       = data.aws_ami.ubuntu.name
}

output "ssh_connection_command" {
  description = "Command to SSH into the instance"
  value       = var.key_name != "" ? "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.vm.public_ip}" : "SSH key not configured"
}
