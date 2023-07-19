# Contributing to the Wiki
If you're reading this, then you're interested in helping us document the system via the wiki, thank you!
We want to make sure that contributing to the wiki is as easy as possible so that anyone that would like to help us with this task can do so. In that light, there are several different way to contribute to the wiki outlined below.

## How the Wiki is updated
Typically, a repository's Wiki can only be updated by the owners of that repo, this made community provided documentation cumbersome to include. This repository is utilizing a [GitHub Action](https://github.com/Andrew-Chen-Wang/github-wiki-action) that will generate the wiki from any Markdown files submitted to the `publish-wiki` branch's `wiki/` folder. When new files are merged to the `publish-wiki` branch the Action will run, and update the wiki repo. This allows us to easily accept community provided documentation. 

## Style Guide
When submitting a Markdown file for consideration for the Wiki, we ask you to follow the style guide outlined here, this will ensure consistency between all of our wiki pages.

### Markdown Formatting
Use [GitHub's Basic Formatting Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#headings) as a guide on how to format text with Markdown.

### Assets
When taking a screenshot or screen recording, all modules should be disabled. The wiki is intended for core System functionality only.
When adding an image or video, first upload the asset to the original Issue created for the update. This will provide us with a reliable link to that asset for use between your Fork and the dnd5e system.  
- Images
    - I dunno, any guidelines here?
    - Recommended software for taking and annotating screenshots?
- Videos
    - Webm preferred? Does is matter?
    - Free software to capture webm video?

### File Names and Links
The name of your Markdown file is what will be used for the name of the Wiki Page, with hyphens turning into spaces, so `My-first-Wiki-page.md` will become `My first Wiki page`. 
When you want to link to another page in the wiki, in your file make sure to link to the Markdown file of the wiki page, the GitHub Action will automatically strip the `.md` extension and generate the appropriate link to the wiki page, e.g. linking to `[Hyperlink Text](Advancement-Type-Hit-Points.md)` will always generate a link to `[Hyperlink Text](https://github.com/foundryvtt/dnd5e/wiki/Advancement-Type-Hit-Points)`.  
Always make sure to update the `Home.md` file with a link to your new Markdown file.

### That little version tag?
Do we want to have the version tag at the top of all of our docs to reflect the version the page was last updated?  
![](https://img.shields.io/static/v1?label=dnd5e&message=2.0.0&color=informational)    
`![](https://img.shields.io/static/v1?label=dnd5e&message=2.0.0&color=informational)`  

# Submitting to the Wiki

## Creating a Wiki Issue
Just like any other issue on the repo, the title should reflect a brief description of the task at hand, and the Description should provide us with information about what will be added to the wiki. Make sure to include all of your assets in this issue, as mentioned in the style guide above.  
Example: Review the Issue created for submitting this document you're currently reading here: `#1999`

## Submit a PR
In order to contribute directly to the Wiki, you will need to fork the dnd5e repo, make a branch from the `publish-wiki` branch of the repo, add your Markdown files, and submit a Pull Request.  

### Fork the `dnd5e` Repo
To contribute to the wiki [fork this project](https://docs.github.com/en/get-started/quickstart/fork-a-repo) Once you have forked the dnd5e repo, you will want to create a branch from the `publish-wiki` branch of the dnd5e repo. To do this, click on the branches button, then click on New Branch. Give your new Branch a descriptive name, then make sure to update the Source to the upstream repository `foundryvtt/dnd5e`and select the `publish-wiki` branch. 

### Submit a PR
and submit a [pull request (PR)](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#making-a-pull-request) against the `publish-wiki` branch.
Either edit the existing files, or add your own Markdown files within the `wiki` folder. Once you've created your files, you will be asked to either `Save and Merge` or `Create a New Branch`, choose `Create a New Branch` and provide the new branch with a name. You will now be able to submit those changes back to the DnD5e system via a PR. From the main page of your repo, click the `Contribute` button and create your PR for the system. When submitting a PR for the wiki, make sure that you are targetting the `publish-wiki` branch of the repo. Your PR is now submitted and will be reviewed by the Dnd5e team!
Example: Review the PR created for submitting this document you're currently reading here: `#1999`

## Updating your PR
You may want to make changes to your files, or may be asked to make changes by the DnD5e team. To do this, you will make those changes to the branch that your PR originated from. Making these updates can either be merged directly to the branch, but if you have a lot of edits to make, that can blow up the PR's tracking history quite a lot. I would recommend creating yet another branch in your repo, then once all changes are made, submit a PR from `wiki-submission-updates` to your `wiki-submission` branch, those changes will then propigate down to the DnD5e PR with one update line. 

## Merging the PR
The DnD5e team will merge your PR once all appropriate changes are made, the GitHub Action will automatically run, and your submission will be added to the Wiki page!
