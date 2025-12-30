# Terraform Configuration

## Setup Steps

1. **Copy the example variables file**
    ```bash
    cp terraform.tfvars.example terraform.tfvars
    ```

2. **Configure your variables**
    Edit `terraform.tfvars` and update the values as needed for your environment.

3. **Apply the Terraform configuration**
    ```bash
    terraform plan
    ```

    ```bash
    terraform apply
    ```

## Prerequisites

- Terraform installed and configured
- Required credentials and permissions for your cloud provider
- Valid `terraform.tfvars` file with appropriate variable values
