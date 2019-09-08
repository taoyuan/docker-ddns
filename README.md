# docker-ddns

[![Greenkeeper badge](https://badges.greenkeeper.io/taoyuan/docker-ddns.svg)](https://greenkeeper.io/)

> A docker image for ddns.

## Getting Started

### Building

```bash
$ docker build --rm -t taoyuan/ddns .
```

### Run

```bash
$ docker run -d taoyuan/ddns
```

### Mapping config file

```bash
$ docker run -d \
    -v $HOME/dnm:/data/dnm \
    taoyuan/ddns
```