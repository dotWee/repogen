# repogen

Repogen is meant as an utility for [Repo](https://code.google.com/archive/p/git-repo/) project. It generates repo-manifests from several Git hosts, like GitHub, GitLab and Gitea.

About repo:

> Repo is a tool built on top of Git. Repo helps manage many Git repositories, does the uploads to revision control systems, and automates parts of the development workflow. Repo is not meant to replace Git, only to make it easier to work with Git.

Repogen generates manifests that _wrap_ multiple Git repositories and allow them for example to get edited/pulled/pushed all at once.
See Google's [Repo command reference](https://source.android.com/setup/develop/repo) and [Android Development Environment](https://source.android.com/setup/develop/) for help and a more detailed example.

## Table of contents

- [Installation](##Installation)
- [Execution](##Execution)
    - [Example](###Example)
    - [GitHub](###GitHub)
    - [GitLab](###GitLab)
    - [Gitea](###Gitea)
- [Configuration](##Configuration)
- [Todo](##Todo)
- [License](##License)


## Installation

`$ npm install repogen -g`

## Execution

Currently there are three different git-hosts supported:

- [GitHub](###GitHub)
- [GitLab](###GitLab)
- [Gitea](###Gitea)

```shell
$ repogen -h

    Usage: repogen [options] [command]

    Options:

        -V, --version               output the version number
        -h, --help                  output usage information

    Commands:

        gitea [options]             Generate manifest from the authenticated gitea user
        github [options] <profile>  Generate manifest from github a given profile
        gitlab [options] <profile>  Generate manifest from a given gitlab profile
```

### Example

The following example shows the process of generating a manifest from my public github profile.

```shell
$ repogen github dotwee -o manifest-dotwee.xml
$ cat manifest-dotwee.xml

<manifest>
    <remote 
        name="origin" 
        fetch="https://github.com/dotWee"/>

    <default 
        remote="origin" 
        revision="refs/heads/master" 
        sync-j="4"/>

    <project name="repogen" path="repogen" remote="origin"/>
    
    ...

</manifest>
```

### GitHub

```shell
$ repogen github -h

    Usage: github [options] <profile>

    Generate manifest from github a given profile

    Options:

        -o, --output-file [output_file]  name of the output file
        -t, --token [token]              optional auth-token to include private repositories
        -h, --help                       output usage information
```

### GitLab

```shell
$ repogen gitlab -h

    Usage: gitlab [options] <profile>

    Generate manifest from a given gitlab profile

    Options:

        -t, --token [token]              optional auth-token to include private repositories
        -o, --output-file [output_file]  name of the output file
        -u, --url [url]                  optional url or ip address of running gitlab instance
        -h, --help                       output usage information
```

### Gitea

```shell
$ repogen gitea -h

    Usage: gitea [options]

    Generate manifest from the authenticated gitea user

    Options:

        -a, --access_token <access_token>  required access-token to allow api calls
        -o, --output-file [output_file]    name of the output file
        -u, --url <url>                    required url or ip address of the host
        -h, --help                         output usage information
```

## Configuration

Standard manifest elements like _remote_ and _default_ can be set using the `default.json` file inside `./config`.

For details and information about their use and possible values, see the official [manifest-format](https://gerrit.googlesource.com/git-repo/+/HEAD/docs/manifest-format.txt) document.

The following attributes for the standard remote and default element are supported:

```json
{
  "_remote": {
    "name": "",
    "alias": "",
    "fetch": "",
    "pushurl": "",
    "review": "",
    "revision": ""
  },

  "_default": {
    "remote": "",
    "revision": "",
    "dest-branch": "",
    "upstream": "",
    "sync-j": "",
    "sync-c": "",
    "sync-s": "",
    "sync-tags": ""
  }
}
```

Also, a default output file can be declared using the key `outputFile`.

## Todo

- [ ] (Unit-) Testing
- [ ] Generate manifest from url
- [ ] Implement ssh configuration for remotes

## License

Copyright (c) 2018 Lukas 'dotwee' Wolfsteiner

Licensed under the [_Do What The Fuck You Want To_](/LICENSE) public license