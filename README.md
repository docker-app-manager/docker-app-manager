### This is project is in a pre-alpha state so it might work or it might not, we are still far away from a stable release and any help is very welcome :smiley:

# Docker App Manager


[![GitHub package version](https://img.shields.io/github/package-json/v/docker-app-manager/docker-app-manager.svg?style=flat-square)](https://github.com/docker-app-manager/docker-app-manager)
[![License](https://img.shields.io/github/license/docker-app-manager/docker-app-manager.svg?style=flat-square)](https://github.com/docker-app-manager/docker-app-manager/blob/master/LICENSE)



Install, run and manage DockerApps with a command

![demo-gif](https://i.imgur.com/zUEj9ms.gif)

## First of all, what is a DockerApp? Did you just make that up?

Yes.

We needed a term for indicating a self-contained archive that contains all the information needed to run a certain application inside docker.
You can see a DockerApp as an adaptable Dockerfile that works perfectly in every host system.

Basically we turned this

```
docker run --volume=/home/federico/DockerApps/google-chrome/Volumes/Downloads:/home/dockerapp/Downloads --volume=/tmp/.X11-unix:/tmp/.X11-unix:rw --volume=/tmp/.dockerapp.google-chrome.xauth:/tmp/.dockerapp.google-chrome.xauth:rw --volume=/run/user/1000/pulse:/run/user/1000/pulse --env='XAUTHORITY=/tmp/.dockerapp.google-chrome.xauth' --env='DISPLAY=:0' dockerapp_google-chrome
```

into this

```
./dam run google-chrome
```


## Why?

Short answer: we got tired of having dozens of bash scripts for running our applications inside Docker

## How?

Just clone the repository

```
git clone https://github.com/docker-app-manager/docker-app-manager.git && \
cd docker-app-manager && \
npm install && \
chmod +x dam
```

Update the DockerApps list

```
./dam update
```

Install a DockerApp and go grab a beer because it will take some time

```
./dam install google-chrome
```

Run it

```
./dam run google-chrome
````

You can even pass arguments to it!

```
./dam run google-chrome www.reddit.com
```

You should also find a link to the DockerApp in your DE's applications list.

If everything works fine, celebrate with the beer that you have taken earlier

## Where i can find a list of DockerApps?

[This](https://github.com/docker-app-manager/docker-apps) is the official DockerApps repository but do not expect to find a lot of DockerApps at this stage of development

## Cool but can you please make some sort of documentation?

We will, I promise :sweat_smile:
