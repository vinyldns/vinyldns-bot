# Contributing

👍🎉 Thanks for your interest in contributing! 🎉👍

- [Contributing](#contributing)
  * [Issues](#issues)
    + [Working on an Issue](#working-on-an-issue)
    + [Discussion Process](#discussion-process)
  * [Pull Requests](#pull-requests)
    + [General Flow](#general-flow)
    + [Pull Request Requirements](#pull-request-requirements)
      - [Commit Messages](#commit-messages)
      - [Testing](#testing)
      - [Contributor License Agreement](#contributor-license-agreement)
    + [Modifying your Pull Requests](#modifying-your-pull-requests)
    + [Pull Request Approval](#pull-request-approval)

## Issues

Work on `VinylDNS Bot` is tracked by
[Github Issues](https://guides.github.com/features/issues/). To
contribute to `VinylDNS Bot`, you can join the discussion on an issue,
submit a Pull Request to resolve the issue, or make an issue of your
own. `VinylDNS Bot` issues are generally labeled as bug reports, feature
requests, or maintenance requests.

### Working on an Issue

If you would like to contribute to `VinylDNS Bot`, you can look through
`good first issue` and `help wanted` issues. We keep a list of these
issues around to encourage participation in building the platform. In
the issue list, you can chose "Labels" and choose a specific label to
narrow down the issues to review.

* **Beginner issues**: only require a few lines of code to complete,
  rather isolated to one or two files. A good way to get through
  changing and testing your code, and meet everyone!
* **Help wanted issues**: these are more involved than beginner issues,
  are items that tend to come near the top of our backlog but not
  necessarily in the current development stream.

Besides those issues, you can sort the issue list by number of comments
to find one that may be of interest. You do _not_ have to limit yourself
to _only_ `good first issue` or `help wanted` issues.

When resolving an issue, you generally will do so by making a
[Pull Request](#pull-requests), and adding a link to the issue.

Before choosing an issue, see if anyone is assigned or has indicated
they are working on it (either in comment or via Pull Request). If that
is the case, then instead of making a Pull Request of your own, you can
help out by reviewing their Pull Request.

### Discussion Process

Some issues may require discussion with the community before proceeding
to implementation. This can happen if the issue is a larger change, for
example a big refactoring or new feature. The `VinylDNS Bot` maintainers
may label an issue for **Discussion** in order to solicit more detail
before proceeding. If the issue is straightforward and/or well
documented, it can be implemented immediately by the submitter. If the
submitter is unable to make the changes required to address the issue,
the `VinylDNS Bot` maintainers will prioritize the work in our backlog.

## Pull Requests

Contributions to `VinylDNS Bot` are generally made via
[GitHub Pull Requests](https://help.github.com/articles/about-pull-requests/).
Most Pull Requests are related to an [issue](#issues), and will have a
link to the issue in the Pull Request.

### General Flow

We follow the standard *GitHub Flow* for taking code contributions. The
following is the process typically followed:

1. Create a fork of the repository that you want to contribute code to
2. Clone your forked repository to your local machine
3. In your local machine, add a remote to the "main" repository, we call
   this "upstream" by running `git remote add upstream
   https://github.com/vinyldns/vinyldns-bot.git`. Note: you can also use
   `ssh` instead of `https`
4. Create a local branch for your work `git checkout -b
   your-user-name/user-branch-name`. Add whatever your GitHub user name
   is before whatever you want your branch to be.
5. Begin working on your local branch
6. Be sure to add necessary unit, integration, and functional tests
7. When you are ready to contribute your code, run `git push origin
   your-user-name/user-branch-name` to push your changes to your _own
   fork_
8. Go to the
   [main repository](https://github.com/vinyldns/vinyldns-bot.git) and
   you will see your change waiting with a link to "Create a Pull
   Request". Click the link to create a Pull Request.
9. Be as detailed as possible in the description of your Pull Request.
   Describe what you changed, why you changed it, and give a detailed
   list of changes and impacted files. If your Pull Request is related
   to an existing issue, be sure to link the issue in the Pull Request
   itself, in addition to the Pull Request description.
10. You will receive comments on your Pull Request. Use the Pull Request
    as a dialog on your changes.

### Pull Request Requirements

#### Commit Messages

* Limit the first line to 72 characters or fewer.
* Use the present tense ("Add validation" not "Added validation").
* Use the imperative mood ("Move database call" not "Moves database
  call").
* Reference issues and other pull requests liberally after the first
  line. Use
  [GitHub Auto Linking](https://help.github.com/articles/autolinked-references-and-urls/)
  to link your Pull Request to other issues.
* Use markdown syntax as much as you want

#### Testing

When making changes to the codebase, be sure to add necessary unit,
integration, and functional tests.


#### Contributor License Agreement

Before Comcast merges your code into the project you must sign the
[Comcast Contributor License Agreement (CLA)](https://gist.github.com/ComcastOSS/a7b8933dd8e368535378cda25c92d19a).

If you haven't previously signed a Comcast CLA, you'll automatically be
asked to when you open a pull request. Alternatively, we can send you a
PDF that you can sign and scan back to us. Please create a new GitHub
issue to request a PDF version of the CLA.

### Modifying your Pull Requests

Often times, you will need to make revisions to your Pull Requests that
you submit. This is part of the standard process of code review. There
are different ways that you can make revisions, but the following
process is pretty standard.

1. Sync with upstream first. `git checkout main && git fetch upstream &&
   git rebase upstream main && git push origin main`
2. Checkout your branch on your local `git checkout
   your-user-name/user-branch-name`
3. Sync your branch with latest `git rebase main`. Note: If you have
   merge conflicts, you will have to resolve them
4. Revise your Pull Request, making changes recommended in the comments
   / code review
5. Stage and commit these changes on top of your existing commits
6. When all tests pass, `git push origin
   your-user-name/user-branch-name` to revise your commit. _Note: If you
   rebased or altered the commit history, you will have to force push
   with a `-f` flag._ GitHub automatically recognizes the update and
   will re-run verification on your Pull Request!

### Pull Request Approval

A pull request must satisfy our
[pull request requirements](#pull-request-requirements)

Afterwards, if a Pull Request is approved, a maintainer of the project
will merge it. If you are a maintainer, you can merge your Pull Request
once you have the approved the changes.

