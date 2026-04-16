# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A personal portfolio site. Currently a single static `index.html` with inline CSS — no build step, framework, or dependencies.

## Preview

Open `index.html` directly in a browser, or serve the directory with any static server (e.g. `python3 -m http.server`).

## Structure notes

- Styles are kept inline in a `<style>` block inside `index.html`. If the site grows, extract to a separate stylesheet before adding a second page.
- Content sections (About, Projects, Contact) are placeholder scaffolding — expect edits to copy and links rather than structural HTML changes.
