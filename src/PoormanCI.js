'use strict';

var exec = require('child_process').exec;
var GitHubApi = require("github");

var PoormanCI = function (token, owner, repo) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
};

PoormanCI.prototype = {
    token: null,
    owner: null,
    repo: null,
    github: null,
    getPullRequests: function (cb) {
        var githubInstance = this.getGithubInstance(this.token);
        githubInstance.getAllPullRequestShas(
            function (sha) {
                cb({
                    sha: sha,
                    setPending: function (description) {
                        this.setStatus("pending", description);
                    },
                    setSuccess: function (description) {
                        this.setStatus("success", description);
                    },
                    setError: function (description) {
                        this.setStatus("error", description);
                    },
                    setStatus: function (state, description) {
                        githubInstance.setStatus(this.sha, state, description);
                    }
                });
            }
        );
    },
    getGithubInstance: function (token) {
        if (null === this.github) {
            this.github = new GitHubApi({
                headers: {"user-agent": "poorman-ci"},
                timeout: 5000
            });
            this.github.authenticate({type: "oauth", token: token});
        }
        var instance = this;
        return {
            getAllPullRequestShas: function (cb) {
                instance.github.pullRequests.getAll(
                    {owner: instance.owner, repo: instance.repo},
                    function (err, res) {
                        cb(res[0].head.sha);
                    }
                );
            },
            setStatus: function (sha, state, description) {
                instance.github.repos.createStatus({
                    owner: instance.owner,
                    repo: instance.repo,
                    sha: sha,
                    state: state,
                    description: description,
                    context: "Poorman-CI"
                });
            }
        };
    },
    run: function (DEBUG) {
        this.getPullRequests(function (pullRequest) {
            require('./../tasks.json').tasks.map(function (task) {
                pullRequest.setPending(task.desc);
                exec(task.cmd, function (err, stdout, stderr) {
                    if (!err) {
                        pullRequest.setSuccess(task.desc);
                        if (DEBUG) console.log(stdout, stderr);
                    } else {
                        pullRequest.setError(task.desc);
                        if (DEBUG) console.error(stdout, stderr);
                    }
                });
            });
        });
    }
};

module.exports = PoormanCI;
