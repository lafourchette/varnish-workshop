# based on https://github.com/newsdev/docker-varnish
FROM debian:jessie

RUN \
  useradd -r -s /bin/false varnishd

# Install Varnish source build dependencies
RUN \
  apt-get update && apt-get install -y --no-install-recommends \
    automake \
    build-essential \
    ca-certificates \
    curl \
    libedit-dev \
    libjemalloc-dev \
    libncurses-dev \
    libpcre3-dev \
    libtool \
    pkg-config \
    python-docutils \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Install Varnish from source, so that Varnish modules
# can be compiled and installed
ENV VARNISH_VERSION=4.1.11
ENV VARNISH_SHA256SUM=f937a45116f3a7fbb38b2b5d7137658a4846409630bb9eccdbbb240e1a1379bc
RUN apt-get update && \
  cd /usr/local/src && \
  curl -sfLO http://varnish-cache.org/_downloads/varnish-${VARNISH_VERSION}.tgz && \
  echo "${VARNISH_SHA256SUM} varnish-$VARNISH_VERSION.tgz" | sha256sum -c - && \
  tar -xzf varnish-$VARNISH_VERSION.tgz && \
  cd varnish-$VARNISH_VERSION && \
  ./autogen.sh && \
  ./configure && \
  make install && \
  rm ../varnish-$VARNISH_VERSION.tgz

# varnishd(1) options
ENV VARNISH_VCL_PATH /etc/varnish/default.vcl
ENV VARNISH_PORT 80
ENV VARNISH_MEMORY 64m

# VMOD options
ENV QUERYSTRING_VERSION 0.3

# varnishlog(1) options
ENV VARNISHLOG_PATH /etc/varnish/log.log

# varnishncsa(1) options
ENV VARNISHNCSA_FORMAT_PATH /etc/varnishncsa/varnishncsa-format.txt
ENV VARNISHNCSA_LOG_PATH /var/log/varnish/access.log

COPY varnish/start-varnish.sh /usr/local/bin/start-varnish
COPY varnish/install-querystring.sh /usr/local/bin/install-querystring
COPY varnish/varnishncsa-format.txt /etc/varnishncsa/varnishncsa-format.txt

# install VMODs
RUN \
  install-querystring

# forward logs to docker log collector
RUN \
  mkdir -p $(dirname ${VARNISHNCSA_LOG_PATH}) && \
  mkdir -p $(dirname ${VARNISHLOG_PATH}) && \
  touch ${VARNISHLOG_PATH} ${VARNISHNCSA_LOG_PATH} && \
  ln -sf /dev/stdout ${VARNISHLOG_PATH} && \
  ln -sf /dev/stdout ${VARNISHNCSA_LOG_PATH}

EXPOSE 80
CMD [ "start-varnish" ]

ONBUILD COPY varnish/default.vcl /etc/varnish/default.vcl
