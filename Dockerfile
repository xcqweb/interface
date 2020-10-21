FROM nginx

LABEL maintainer="ju.yin@getech.cn"

VOLUME /tmp

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

EXPOSE 80/tcp

COPY nginx.conf /etc/nginx/nginx.conf
COPY ./interface  /usr/share/nginx/html/iot/interface