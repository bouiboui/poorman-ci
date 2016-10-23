# poorman-ci

The poor man's Continuous Integration solution. Runs the tasks you define and updates your Github Pull Request status.
Relies on Gulp but can run any language/application as long as it's compatible with your bash.

**Warning**
This is more a POC than anything else, don't run it in a production environment unless you really know what you're doing.

## Install

Download the source code and install npm dependencies

```bash
npm install
```

## Usage

Edit `tasks.json` with your tasks
```json
{
  "tasks": [
    {
      "desc": "Update website with latest commits",
      "cmd": "cd /home/bouiboui/website && git pull"
    },
    {
      "desc": "Run PHPUnit tests",
      "cmd": "phpunit /home/bouiboui/website/tests"
    },
    {
      "desc": "Restart apache",
      "cmd": "service apache2 restart"
    }
  ]
}
```

Run `gulp task` either globally or locally, with the appropriate environment variables:
```bash
# Run with local gulp
TOKEN=123 OWNER=repo_author REPO=repo_name ./node_modules/.bin/gulp task

# Run with global gulp
TOKEN=123 OWNER=repo_author REPO=repo_name gulp task

# You can also set the DEBUG environment variable to TRUE to display more information
```

Link the script to a Github Webhook if you want to run it at every commit, pull request or else.

## Credits

- [bouiboui][link-author]
- [All Contributors][link-contributors]

## License

http://unlicense.org

[link-author]: https://github.com/bouiboui
[link-contributors]: ../../contributors
