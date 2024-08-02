FROM httpd:latest

# Copy the built React app to the htdocs directory
COPY frontend/dist/ /usr/local/apache2/htdocs/

# Copy the Apache configuration file
COPY apache/vacchun.hu.conf /usr/local/apache2/conf/extra/httpd-ssl.conf

# Copy the SSL certificates
COPY apache/cloudflare/cc.vacchun.hu.pem /etc/cloudflare/cc.vacchun.hu.pem
COPY apache/cloudflare/cc.vacchun.hu.key /etc/cloudflare/cc.vacchun.hu.key

# Ensure the .htaccess file is copied
COPY frontend/.htaccess /usr/local/apache2/htdocs/.htaccess

# Include the SSL configuration in the main httpd.conf file
RUN echo "Include /usr/local/apache2/conf/extra/httpd-ssl.conf" >> /usr/local/apache2/conf/httpd.conf

# Load necessary modules
RUN echo "LoadModule ssl_module modules/mod_ssl.so" >> /usr/local/apache2/conf/httpd.conf
RUN echo "LoadModule headers_module modules/mod_headers.so" >> /usr/local/apache2/conf/httpd.conf
RUN echo "LoadModule rewrite_module modules/mod_rewrite.so" >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
EXPOSE 443
