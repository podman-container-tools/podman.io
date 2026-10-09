---
title: Podman Installation
---

# Podman Installation Instructions

Looking for a GUI? You can find Podman Desktop [here](https://podman-desktop.io/downloads).

## Installing on Mac & Windows

While "containers are Linux," Podman also runs on Mac and Windows, where it
provides a native podman CLI and embeds a guest Linux system to launch your
containers. This guest is referred to as a Podman machine and is managed with
the `podman machine` command. Podman on Mac and Windows also listens for
Docker API clients, supporting direct usage of Docker-based tools and
programmatic access from your language of choice.

### macOS

On Mac, each Podman machine is backed by a virtual machine.
Once installed, the podman command can run directly from
the Unix shell in `Terminal`, where it remotely communicates with the `podman`
service running in the Machine VM.

1. Download Podman:

   - Recommended

     <details open>
     <summary>Use the Installer (Recommended)</summary>

     Podman can be downloaded from the [Podman.io](https://podman.io) website.
     You can get binaries and a pkg installer from our [GitHub release page](https://github.com/podman-container-tools/podman/releases).

     </details>

   - Not recommended

     <details>
     <summary>Use Homebrew</summary>

     It's not recommended to install via [Homebrew](https://brew.sh/) because it is a community-maintained package manager, and we cannot guarantee the stability
     of the Podman installation. However, if you do wish to use Brew, run:

     ```bash
     brew install podman
     ```

     </details>

2. Create and start your first Podman machine:

   ```bash
   podman machine init
   podman machine start
   ```

3. Verify the installation information:

   ```bash
   podman info
   ```

### Windows

On Windows, each Podman machine is backed by a virtualized Windows Subsystem for
Linux (WSLv2) distribution. Once installed, the podman command can be run
directly from your Windows PowerShell (or CMD) prompt, where it remotely
communicates with the podman service running in the WSL environment.
Alternatively, you can access Podman directly from the WSL instance if you
prefer a Linux prompt and Linux tooling.

See the [Podman for Windows guide](https://github.com/podman-container-tools/podman/blob/main/docs/tutorials/podman-for-windows.md) for setup and usage instructions.

## Installing on Linux {#installing-on-linux}

### Linux Distributions

#### [Arch Linux](https://www.archlinux.org) & [Manjaro Linux](https://manjaro.org)

```bash
sudo pacman -S podman
```

If you have problems when running Podman in [rootless](https://github.com/podman-container-tools/podman/blob/main/README.md#rootless) mode follow the instructions [here](<https://wiki.archlinux.org/index.php/Linux_Containers#Enable_support_to_run_unprivileged_containers_(optional)>)

For more information on Podman on ArchLinux [click here](https://wiki.archlinux.org/title/Podman)

#### [Alpine Linux](https://alpinelinux.org)

```bash
sudo apk add podman
```

For further details, please refer to the instructions on the [Alpine Linux wiki](https://wiki.alpinelinux.org/wiki/Podman).

#### [CentOS Stream](https://www.centos.org)

Podman is available by default in the AppStream repo for CentOS Stream 9+.

```bash
sudo dnf -y install podman
```

#### [Debian](https://debian.org)

The podman package is available in the Debian 11 (Bullseye) repositories and later.

```bash
sudo apt-get -y install podman
```

#### [Fedora](https://getfedora.org)

```bash
sudo dnf -y install podman
```

To run `podman machine ...` commands

```bash
sudo dnf -y install podman-machine
```

slirp4netns is no longer the default for rootless networking on new podman installations, obsoleted in favor
of [passt](https://passt.top/passt/about/). If you have containers using slirp4netns, make sure slirp4netns is
installed:

```bash
sudo dnf -y install slirp4netns
```

#### [Fedora CoreOS](https://coreos.fedoraproject.org), [Fedora Silverblue](https://silverblue.fedoraproject.org)

Built-in, no need to install

#### [Gentoo](https://www.gentoo.org)

```bash
sudo emerge app-containers/podman
```

#### [OpenEmbedded](https://www.openembedded.org)

Bitbake recipes for Podman and its dependencies are available in the
[meta-virtualization layer](https://git.yoctoproject.org/cgit/cgit.cgi/meta-virtualization/).
Add the layer to your OpenEmbedded build environment and build Podman using:

```bash
bitbake podman
```

#### [openSUSE](https://www.opensuse.org)

```bash
sudo zypper install podman
```

#### [openSUSE Kubic](https://kubic.opensuse.org)

Built-in, no need to install

#### [Raspberry Pi OS arm64 (beta)](https://downloads.raspberrypi.org/raspios_arm64/images/)

Raspberry Pi OS use the standard Debian repositories,
so it is fully compatible with Debian's arm64 repository.
You can simply follow the [steps for Debian](#debian) to install Podman.

#### [RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)

Follow the [official docs](https://access.redhat.com/solutions/3650231).

#### [Ubuntu](https://www.ubuntu.com)

The podman package is available in the official repositories for Ubuntu 20.10
and newer.

```bash
# Ubuntu 20.10 and newer
sudo apt-get update
sudo apt-get -y install podman
```

#### [Linux Mint](https://linuxmint.com)

Follow the steps for Ubuntu (or Debian if you use LMDE).

### Installing development versions of Podman

#### [Fedora](https://getfedora.org)

You can test the very latest Podman in Fedora's `updates-testing`
repository before it goes out to all Fedora users.

```bash
sudo dnf update --refresh --enablerepo=updates-testing podman
```

If you use a newer Podman package from Fedora's `updates-testing`, we would
appreciate your `+1` feedback in [Bodhi, Fedora's update management
system](https://bodhi.fedoraproject.org/updates/?packages=podman).

### Installing bleeding-edge versions of Podman

If you like danger and are interested in testing the latest
unreleased bits of Podman on Fedora, CentOS Stream 9+ and RHEL9+, we have a [Copr repository](https://copr.fedorainfracloud.org/coprs/rhcontainerbot/podman-next/).

CAUTION: This repository contains rpm builds generated using the `main` branch
of upstream container tools repositories, and simply CANNOT be recommended for
any production use.

Enable the Copr and install podman.

```bash
sudo dnf copr enable rhcontainerbot/podman-next -y
sudo dnf install podman
```

## Installing on [FreeBSD](https://freebsd.org)

:::caution

The FreeBSD port of the Podman container engine is experimental and should be used for evaluation and testing purposes only.
It is supported on **FreeBSD 14.3 and newer**.

:::

You can install Podman on FreeBSD using `pkg`:

```bash
pkg install podman
```

There's also a `podman-suite` meta package that will pull additional packages for you (buildah, skopeo).

#### Initial configuration

To properly support Podman's container restart policy, conmon needs `fdescfs(5)` to be mounted on `/dev/fd`.

If `/dev/fd` is not already mounted:

```bash
mount -t fdescfs fdesc /dev/fd
```

To make it permanent, add the following line to `/etc/fstab`:

```
fdesc   /dev/fd         fdescfs         rw      0       0
```

To start Podman after reboot:

```bash
service podman enable
```

##### Networking

Container networking relies on NAT to allow container network packets out to the host's network. This requires a PF firewall to perform the translation. A simple example is included - to use it:

```bash
cp /usr/local/etc/containers/pf.conf.sample /etc/pf.conf
```

Edit `/etc/pf.conf` and set `v4egress_if`, `v6egress_if` variables to your network interface(s)s

Enable and start `pf`:

```
service pf enable
service pf start
```

The sample PF configuration includes support for port redirections. These are implemented as redirect rules in anchors nested under cni-rdr.

Support for redirecting connections from the container host to services running inside a container is included for FreeBSD 13.3 and later. To enable this, first load the pf kernel module and enable PF support for these redirections using sysctl:

```bash
echo 'pf_load="YES"' >> /boot/loader.conf
kldload pf
sysctl net.pf.filter_local=1
echo 'net.pf.filter_local=1' >> /etc/sysctl.conf.local
service pf restart
```

Redirect rules will work if the destination address is localhost (e.g. 127.0.0.1 or ::1) - to enable this, the following line must be included in your `/etc/pf.conf`:

```
nat-anchor "cni-rdr/*"
```

if upgrading from an older version, this needs to be added to `/etc/pf.conf`.

For example if host port 1234 is redirected to an http service running in a
container, you could connect to it using:

```bash
fetch -o- http://$(hostname):1234
```

or

```bash
fetch -o- http://localhost:1234
```

##### Storage

Container images and related state is stored in `/var/db/containers`. It is recommended to use ZFS for this:

```bash
zfs create -o mountpoint=/var/db/containers zroot/containers
```

If your system cannot use ZFS, change `storage.conf` to use the `vfs` storage driver:

```bash
sed -I .bak -e 's/driver = "zfs"/driver = "vfs"/' /usr/local/etc/containers/storage.conf
```

##### Verification

After following these steps you should be able to run native images:

```bash
podman run --rm docker.io/dougrabson/hello
```

##### Linux Emulation

It is possible to run many Linux container images using FreeBSD's Linux emulation:

```bash
sudo sysrc linux_enable=YES
sudo service linux start
sudo podman run --rm --os=linux docker.io/library/alpine cat /etc/os-release | head -1
NAME="Alpine Linux"
```

## Building from Source

### Build and Run Dependencies

**Required**

On Fedora:

```bash
# Install build dependencies
sudo dnf -y builddep rpm/podman.spec

# Install runtime dependencies
sudo dnf -y install catatonit conmon containers-common-extra
```

On all RHEL and CentOS Stream, first install `dnf-builddep`:

```bash
sudo dnf -y install 'dnf-command(builddep)'
```

Install build dependencies:

```bash
# CentOS Stream 9+
sudo dnf -y builddep rpm/podman.spec --enablerepo=crb

# RHEL 9+
sudo dnf -y builddep rpm/podman.spec --enablerepo=codeready-builder-for-rhel-$(rpm --eval %{?rhel})-$(uname -m)-rpms
```

Install runtime dependencies:

```bash
sudo dnf -y install \
  conmon \
  containers-common \
  crun \
  iptables \
  netavark \
  nftables \
  slirp4netns
```

Debian, Ubuntu, and related distributions:

```bash
sudo apt-get install \
  btrfs-progs \
  gcc \
  git \
  golang-go \
  go-md2man \
  iptables \
  libassuan-dev \
  libbtrfs-dev \
  libc6-dev \
  libdevmapper-dev \
  libglib2.0-dev \
  libgpgme-dev \
  libgpg-error-dev \
  libprotobuf-dev \
  libprotobuf-c-dev \
  libseccomp-dev \
  libselinux1-dev \
  libsystemd-dev \
  make \
  netavark \
  passt \
  pkg-config \
  runc \
  uidmap
```

The `netavark` package may not be available on older Debian / Ubuntu
versions. Install the `containernetworking-plugins` package instead.

On openSUSE Leap 15.x and Tumbleweed:

```bash
sudo zypper -n in libseccomp-devel libgpgme-devel libbtrfs-devel make man
```

On Manjaro (and maybe other Linux distributions):

Make sure that the Linux kernel supports user namespaces:

```
> zgrep CONFIG_USER_NS /proc/config.gz
CONFIG_USER_NS=y

```

If not, please update the kernel.
For Manjaro Linux the instructions can be found here:
https://wiki.manjaro.org/index.php/Manjaro_Kernels

After that enable user namespaces:

```
sudo sysctl kernel.unprivileged_userns_clone=1
```

To enable the user namespaces permanently:

```
echo 'kernel.unprivileged_userns_clone=1' | sudo tee /etc/sysctl.d/userns.conf > /dev/null
```

### Building missing dependencies

If any dependencies cannot be installed or are not sufficiently current, they have to be built from source.
This will mainly affect Debian, Ubuntu, and related distributions, or RHEL where no subscription is active (e.g. Cloud VMs).

#### golang

Be careful to double-check that the version of golang is new enough (i.e. `go version`), as of August 2025 version is 1.23.x or higher is required.
The current minimum required version can always be found in the [go.mod](https://github.com/podman-container-tools/podman/blob/main/go.mod) file.
If needed, golang kits are available at https://golang.org/dl/. Alternatively, go can be built from source as follows
(it's helpful to leave the system-go installed, to avoid having to [bootstrap go](https://golang.org/doc/install/source):

```bash
export GOPATH=~/go
git clone https://go.googlesource.com/go $GOPATH
cd $GOPATH
cd src
./all.bash
export PATH=$GOPATH/bin:$PATH
```

#### conmon

The latest version of `conmon` is expected to be installed on the system. Conmon is used to monitor OCI Runtimes.
To build from source, use the following:

```bash
git clone https://github.com/containers/conmon
cd conmon
export GOCACHE="$(mktemp -d)"
make
sudo make podman
```

#### crun / runc

The latest version of at least one container runtime is expected to be installed on the system. `crun` or `runc` are some of the possibilities, and one is picked up as the default runtime by Podman (crun has priority over runc).
Supported versions of `crun` and `runc` are available on modern Linux distributions like Ubuntu 22.04 or newer. The minimum required version for `runc` is v1.1.11 and v1.14.3 for `crun`. This requirement is necessary as Podman now depends on features and behavior introduced in this version.

To double-check, the first line of the `runc --version` output should show `version 1.1.11` or newer. If not, you can build it from source:

```bash
git clone https://github.com/opencontainers/runc.git $GOPATH/src/github.com/opencontainers/runc
cd $GOPATH/src/github.com/opencontainers/runc
make BUILDTAGS="selinux seccomp"
sudo cp runc /usr/bin/runc
```

#### Add configuration

```bash
sudo mkdir -p /etc/containers
sudo curl -L -o /etc/containers/registries.conf https://raw.githubusercontent.com/containers/image/main/registries.conf
sudo curl -L -o /etc/containers/policy.json https://raw.githubusercontent.com/containers/image/main/default-policy.json
```

#### Optional packages

Installing `fuse-overlayfs` may resolve a number of issues, e.g. the one from Ecryptfs:
`configure storage: 'overlay' is not supported over ecryptfs, a mount_program is required: backing file system is unsupported for this graph driver`

Fedora, CentOS, RHEL, and related distributions:

```bash
sudo dnf install -y \
  fuse-overlayfs
```

Debian, Ubuntu, and related distributions:

```bash
sudo apt-get install -y \
  libapparmor-dev \
  fuse-overlayfs
```

`fuse-overlayfs` can also be installed from [source](https://github.com/containers/fuse-overlayfs).

### Get Source Code

First, ensure that the `go version` that is found first on the $PATH is new enough. The instruction [above](#golang) will help you compile a newer version of Go if needed. Then we can build Podman:

```bash
git clone https://github.com/podman-container-tools/podman/
cd podman
make PREFIX=/usr
sudo env PATH=$PATH make install PREFIX=/usr
```

#### Build Tags

Podman supports optional build tags for compiling support of various features.
By default, the Makefile picks the right build tags based on the installed dependencies.
Otherwise, if you want to build Podman with specific features turned on or off, you can pass `BUILDTAGS="<TAG1> <TAG2>"` when running make, or no build tags at all like this:

```bash
make BUILDTAGS=""
sudo make install
```

To pass the build tags `seccomp` and `apparmor` use:

```bash
make BUILDTAGS='seccomp apparmor'
```

If you are building on RHEL8 you'll need to build without btrfs support due to [it being removed](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/considerations_in_adopting_rhel_8/file-systems-and-storage_considerations-in-adopting-rhel-8#btrfs-has-been-removed_file-systems-and-storage):

```
make BUILDTAGS="exclude_graphdriver_btrfs"
```

| Build Tag                        | Feature                            | Dependency  |
| -------------------------------- | ---------------------------------- | ----------- |
| apparmor                         | apparmor support                   | libapparmor |
| exclude_graphdriver_btrfs        | exclude btrfs                      | libbtrfs    |
| libsqlite3                       | dynamically link sqlite            | libsqlite3  |
| libsubid                         | enable network subuid/gid support  | libsubid    |
| seccomp                          | syscall filtering                  | libseccomp  |
| selinux                          | selinux process and mount labeling |             |
| systemd                          | journald logging                   | libsystemd  |

Note: Running without the `seccomp` build tag set is not supported and is insecure, as all containers must then be run with `--security-opt seccomp=unconfined` set.
When running on a systemd system using the `systemd` tag is recommended for proper integration such as journald logging.
On a SELinux system, the `selinux` tag is recommended, and the same applies to an AppArmor system with the `apparmor` tag.

### Vendoring - Dependency Management

This project is using [go modules](https://github.com/golang/go/wiki/Modules) for dependency management. If the CI is complaining about a pull request leaving behind an unclean state, it is very likely right about it. After changing dependencies, make sure to run `make vendor` to synchronize the code with the go module and repopulate the `./vendor` directory.

## Ansible

An [Ansible Role](https://github.com/alvistack/ansible-role-podman) is
also available to automate the installation of the above statically
linked binary on its supported OS:

```bash
sudo su -
mkdir -p ~/.ansible/roles
cd ~/.ansible/roles
git clone https://github.com/alvistack/ansible-role-podman.git podman
cd ~/.ansible/roles/podman
pip3 install --upgrade --ignore-installed --requirement requirements.txt
molecule converge
molecule verify
```

## Configuration files

### [registries.conf](https://raw.githubusercontent.com/podman-container-tools/container-libs/main/image/registries.conf)

#### Man Page: [registries.conf.5](https://github.com/podman-container-tools/container-libs/blob/main/image/docs/containers-registries.conf.5.md)

`/etc/containers/registries.conf`

registries.conf is the configuration file which specifies which container registries should be consulted when completing image names which do not include a registry or domain portion.

NOTE: On macOS or Windows, please run the command `podman machine ssh` to enter the machine VM and edit the `/etc/containers/registries.conf` file with the same configuration content. If you encounter permission issues, run `podman machine set --rootful` and try again.

#### Example from the Fedora `containers-common` package

```
$ cat /etc/containers/registries.conf
# For more information on this configuration file, see containers-registries.conf(5).
#
# NOTE: RISK OF USING UNQUALIFIED IMAGE NAMES
# We recommend always using fully qualified image names including the registry
# server (full dns name), namespace, image name, and tag
# (e.g., registry.redhat.io/ubi8/ubi:latest). Pulling by digest (i.e.,
# quay.io/repository/name@digest) further eliminates the ambiguity of tags.
# When using short names, there is always an inherent risk that the image being
# pulled could be spoofed. For example, a user wants to pull an image named
# `foobar` from a registry and expects it to come from myregistry.com. If
# myregistry.com is not first in the search list, an attacker could place a
# different `foobar` image at a registry earlier in the search list. The user
# would accidentally pull and run the attacker's image and code rather than the
# intended content. We recommend only adding registries which are completely
# trusted (i.e., registries which don't allow unknown or anonymous users to
# create accounts with arbitrary names). This will prevent an image from being
# spoofed, squatted or otherwise made insecure.  If it is necessary to use one
# of these registries, it should be added at the end of the list.
#
# # An array of host[:port] registries to try when pulling an unqualified image, in order.
unqualified-search-registries = ["registry.fedoraproject.org", "registry.access.redhat.com", "docker.io"]
#
# [[registry]]
# # The "prefix" field is used to choose the relevant [[registry]] TOML table;
# # (only) the TOML table with the longest match for the input image name
# # (taking into account namespace/repo/tag/digest separators) is used.
# #
# # If the prefix field is missing, it defaults to be the same as the "location" field.
# prefix = "example.com/foo"
#
# # If true, unencrypted HTTP as well as TLS connections with untrusted
# # certificates are allowed.
# insecure = false
#
# # If true, pulling images with matching names is forbidden.
# blocked = false
#
# # The physical location of the "prefix"-rooted namespace.
# #
# # By default, this equal to "prefix" (in which case "prefix" can be omitted
# # and the [[registry]] TOML table can only specify "location").
# #
# # Example: Given
# #   prefix = "example.com/foo"
# #   location = "internal-registry-for-example.net/bar"
# # requests for the image example.com/foo/myimage:latest will actually work with the
# # internal-registry-for-example.net/bar/myimage:latest image.
# location = "internal-registry-for-example.com/bar"
#
# # (Possibly-partial) mirrors for the "prefix"-rooted namespace.
# #
# # The mirrors are attempted in the specified order; the first one that can be
# # contacted and contains the image will be used (and if none of the mirrors contains the image,
# # the primary location specified by the "registry.location" field, or using the unmodified
# # user-specified reference, is tried last).
# #
# # Each TOML table in the "mirror" array can contain the following fields, with the same semantics
# # as if specified in the [[registry]] TOML table directly:
# # - location
# # - insecure
# [[registry.mirror]]
# location = "example-mirror-0.local/mirror-for-foo"
# [[registry.mirror]]
# location = "example-mirror-1.local/mirrors/foo"
# insecure = true
# # Given the above, a pull of example.com/foo/image:latest will try:
# # 1. example-mirror-0.local/mirror-for-foo/image:latest
# # 2. example-mirror-1.local/mirrors/foo/image:latest
# # 3. internal-registry-for-example.net/bar/image:latest
# # in order, and use the first one that exists.
#
# short-name-mode="enforcing"

[[registry]]
location="localhost:5000"
insecure=true
```

### [mounts.conf](https://github.com/podman-container-tools/container-libs/blob/main/common/docs/containers-mounts.conf.5.md)

`/usr/share/containers/mounts.conf` and optionally `/etc/containers/mounts.conf`

The mounts.conf files specify volume mount directories that are automatically mounted inside containers when executing the `podman run` or `podman build` commands. Container process can then use this content. The volume mount content does not get committed to the final image.

Usually these directories are used for passing secrets or credentials required by the package software to access remote package repositories.

For example, a mounts.conf with the line "`/usr/share/rhel/secrets:/run/secrets`", the content of `/usr/share/rhel/secrets` directory is mounted on `/run/secrets` inside the container. This mountpoint allows Red Hat Enterprise Linux subscriptions from the host to be used within the container.

Note this is not a volume mount. The content of the volumes is copied into container storage, not bind mounted directly from the host.

#### Example from the Fedora `containers-common` package:

```
cat /usr/share/containers/mounts.conf
/usr/share/rhel/secrets:/run/secrets
```

### [seccomp.json](https://raw.githubusercontent.com/podman-container-tools/container-libs/main/common/pkg/seccomp/seccomp.json)

`/usr/share/containers/seccomp.json`

seccomp.json contains the whitelist of seccomp rules to be allowed inside of
containers. This file is usually provided by the containers-common package.

The link above takes you to the seccomp.json

### [policy.json](https://raw.githubusercontent.com/podman-container-tools/container-libs/main/image/default-policy.json)

`/etc/containers/policy.json`

#### Man Page: [policy.json.5](https://github.com/podman-container-tools/container-libs/blob/main/image/docs/containers-policy.json.5.md)

#### Example from the Fedora `containers-common` package:

```
cat /etc/containers/policy.json
{
    "default": [
        {
            "type": "insecureAcceptAnything"
        }
    ],
    "transports":
        {
            "docker-daemon":
                {
                    "": [{"type":"insecureAcceptAnything"}]
                }
        }
}
```
