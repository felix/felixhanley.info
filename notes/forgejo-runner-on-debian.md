---
title: Forgejo runner on debian with rootless podman
keywords: [cicd,debian,systemd]
date: 2025-08-28
---

Create the user and ensure linger is enabled for it, remember the UID:

```sh
$ sudo useradd --create-home forgejo-runner
$ sudo loginctl enable-linger forgejo-runner
```

Install dependencies and the runner

```sh
$ sudo apt install systemd-container podman-docker curl jq
$ export RUNNER_VERSION=$(curl -X 'GET' https://data.forgejo.org/api/v1/repos/forgejo/runner/releases/latest | jq .name -r | cut -c 2-)
$ wget -O forgejo-runner https://code.forgejo.org/forgejo/runner/releases/download/v${RUNNER_VERSION}/forgejo-runner-${RUNNER_VERSION}-linux-amd64
$ sudo cp forgejo-runner /usr/local/bin/
$ chmod +x /usr/local/bin/forgejo-runner
```

Configure the runner and service as the user:

```sh
$ sudo machinectl shell toennjes-runner@
$ bash
$ forgejo-runner register
$ mkdir .config/systemd/user
$ cat > .config/systemd/user/forgejo-runner.service <<EOF
[Unit]
Description=Forgejo Runner
After=podman.socket
[Service]
ExecStart=/usr/local/bin/forgejo-runner daemon
ExecReload=/bin/kill -s HUP $MAINPID
# Use UID of runner user
Environment="DOCKER_HOST=unix:///run/user/1001/podman/podman.sock"
WorkingDirectory=/home/forgejo-runner
Restart=on-failure
TimeoutSec=0
RestartSec=10
[Install]
WantedBy=default.target
EOF

$ systemctl --user daemon-reload
$ systemctl --user enable forgejo-runner.service
$ systemctl --user start forgejo-runner.service
```

Reboot?
