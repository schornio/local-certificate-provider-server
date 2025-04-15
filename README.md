# Local certificate provider server

Security consideration: only run this server during the provision of a new certificate

Attention: Needs to run on port 80

Creates a new certificate for schorn.ai in a box



```
docker run \
    -p 80:3000 \
    -e CERTIFICATE_DOMAIN="your.domain.here" \
    -e EMAIL="your@email.here" \
    -e WEB_ACCESS_PASSWORD="your_password_here" \
    -e CERTIFICATE_ENCRYPTION_KEY="your_encryption_key_here" \
    schornio/lcps
```