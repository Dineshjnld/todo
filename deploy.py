#!/usr/bin/env python3
"""
AWS S3 Deployment Script for Todo App
Uses boto3 (AWS SDK for Python) - NO AWS CLI required!
"""

import boto3
import json
import sys
import os
import argparse
from pathlib import Path

class S3Deployer:
    def __init__(self, region='us-east-1'):
        self.region = region
        try:
            self.s3_client = boto3.client('s3', region_name=region)
            # Verify credentials work
            sts = boto3.client('sts')
            identity = sts.get_caller_identity()
            self.account_id = identity['Account']
            print(f"✅ AWS credentials found (Account: {self.account_id})")
        except Exception as e:
            print(f"❌ AWS Credentials Error: {str(e)}")
            print("\n📝 To set up credentials, create a file at:")
            print("   ~/.aws/credentials")
            print("\nWith content:")
            print("   [default]")
            print("   aws_access_key_id = YOUR_KEY_ID")
            print("   aws_secret_access_key = YOUR_SECRET_KEY")
            print("\nOr set environment variables:")
            print("   set AWS_ACCESS_KEY_ID=YOUR_KEY_ID")
            print("   set AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY")
            sys.exit(1)

    def create_bucket(self, bucket_name):
        """Create S3 bucket with proper configuration"""
        try:
            print(f"\n📦 Creating S3 bucket: {bucket_name}...")
            
            if self.region == 'us-east-1':
                self.s3_client.create_bucket(Bucket=bucket_name)
            else:
                self.s3_client.create_bucket(
                    Bucket=bucket_name,
                    CreateBucketConfiguration={'LocationConstraint': self.region}
                )
            
            print(f"✅ Bucket created: {bucket_name}")
            return True
            
        except self.s3_client.exceptions.BucketAlreadyOwnedByYou:
            print(f"✅ Bucket exists and is owned by you: {bucket_name}")
            return True
        except self.s3_client.exceptions.BucketAlreadyExists:
            print(f"❌ Bucket '{bucket_name}' already exists (owned by another AWS account)")
            print("   Use a different bucket name")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error creating bucket: {str(e)}")
            sys.exit(1)

    def enable_static_hosting(self, bucket_name):
        """Enable static website hosting"""
        try:
            print(f"\n🌐 Enabling static website hosting...")
            
            self.s3_client.put_bucket_website(
                Bucket=bucket_name,
                WebsiteConfiguration={
                    'IndexDocument': {'Suffix': 'index.html'},
                    'ErrorDocument': {'Key': 'index.html'}
                }
            )
            print("✅ Static website hosting enabled")
        except Exception as e:
            print(f"⚠️  Warning: {str(e)}")

    def make_public(self, bucket_name):
        """Make bucket public for web access"""
        try:
            print(f"\n🔓 Making bucket public...")
            
            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Sid": "PublicRead",
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": f"arn:aws:s3:::{bucket_name}/*"
                    }
                ]
            }
            
            self.s3_client.put_bucket_policy(
                Bucket=bucket_name,
                Policy=json.dumps(policy)
            )
            print("✅ Bucket policy set to public")
        except Exception as e:
            print(f"⚠️  Warning setting public policy: {str(e)}")

    def upload_files(self, bucket_name):
        """Upload app files to S3"""
        files = {
            'index.html': 'text/html',
            'styles.css': 'text/css',
            'script.js': 'application/javascript'
        }
        
        print(f"\n📤 Uploading files...")
        uploaded = 0
        
        for file, content_type in files.items():
            if not os.path.exists(file):
                print(f"❌ File not found: {file}")
                continue
            
            try:
                self.s3_client.upload_file(
                    file,
                    bucket_name,
                    file,
                    ExtraArgs={'ContentType': content_type}
                )
                print(f"✅ Uploaded: {file}")
                uploaded += 1
            except Exception as e:
                print(f"❌ Error uploading {file}: {str(e)}")
        
        return uploaded == len(files)

    def deploy(self, bucket_name, create=False):
        """Complete deployment process"""
        print("\n" + "="*60)
        print("🚀 AWS S3 TODO APP DEPLOYMENT")
        print("="*60)
        
        if create:
            self.create_bucket(bucket_name)
        
        self.enable_static_hosting(bucket_name)
        self.make_public(bucket_name)
        success = self.upload_files(bucket_name)
        
        if success:
            print("\n" + "="*60)
            print("✅ DEPLOYMENT SUCCESSFUL!")
            print("="*60)
            urls = {
                'us-east-1': f"http://{bucket_name}.s3-website-us-east-1.amazonaws.com",
                'other': f"http://{bucket_name}.s3-website-{self.region}.amazonaws.com"
            }
            url = urls.get('us-east-1' if self.region == 'us-east-1' else 'other')
            print(f"\n🌐 Your app is live at:")
            print(f"   {url}")
            print(f"\n💾 S3 Console: https://console.aws.amazon.com/s3/buckets/{bucket_name}")
        else:
            print("\n❌ Deployment incomplete")
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(
        description='Deploy Todo App to AWS S3 (No AWS CLI required!)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python deploy.py --bucket my-todo-app-2026 --create
  python deploy.py --bucket my-todo-app-2026 --region us-west-2 --create
        """
    )
    parser.add_argument('--bucket', required=True, help='S3 bucket name (must be unique)')
    parser.add_argument('--create', action='store_true', help='Create bucket if it doesn\'t exist')
    parser.add_argument('--region', default='us-east-1', help='AWS region (default: us-east-1)')
    
    args = parser.parse_args()
    
    deployer = S3Deployer(region=args.region)
    deployer.deploy(args.bucket, create=args.create)

if __name__ == '__main__':
    main()
