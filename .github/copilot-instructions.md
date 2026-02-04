<!-- Purpose: Guidance for AI coding agents working in this repository -->
# Copilot instructions for this repository

Summary
- This repository currently contains only a minimal README ([README.md](README.md#L1-L3)). There is no discovered source, build, or test configuration. Treat this as a small/static project until instructed otherwise.

Big picture
- Key file: [README.md](README.md#L1-L3) — the only discoverable artifact.
- No source tree, package manifests, or CI configs found. Before making assumptions, ask which frameworks, language runtimes, or package managers are used.

Primary agent workflow (follow these steps before code changes)
1. Inventory the repo: run `ls -la`, `git status`, and search for common manifests (`package.json`, `pyproject.toml`, `pom.xml`, `go.mod`, `Makefile`). Ask the user if you cannot find them.
2. If you need to run the project, ask which command builds or runs it (common examples: `npm start`, `npm run build`, `python -m`, `make`). Do not guess the build command.
3. When editing, prefer minimal, focused changes. Ask for a short description of the intended feature or bug before implementing.

Project-specific patterns & conventions
- There are no discovered project-specific patterns to follow; assume the following conservative defaults until told otherwise:
  - Keep commits small and descriptive.
  - Ask before adding new top-level folders or changing repository layout.

Integration points & external dependencies
- None were discovered. If a change requires external services (APIs, databases, auth), explicitly request credentials, endpoints, and environment setup from the repo owner before implementing.

Examples of useful prompts to ask the maintainer
- "Which language/runtime and package manager does this project use?"
- "What command should I run to build or test the project?"
- "Are there existing coding style or commit message conventions I should follow?"

How to proceed when code is missing or ambiguous
- If no code is present (like now), propose a small scaffold with explicit choices (language, framework, build tool) and show the minimal files required. Always include the proposed commands to run and test the scaffold.

Where to document changes
- Add implementation notes and rationale to the edited files and update [README.md](README.md#L1-L3) with any new build/run commands.

If you modify or add CI/workflow files
- Include a short description at the top of the workflow explaining what it runs and why (e.g., "Runs lint and unit tests for Node.js via `npm test`").

If you need further context
- Ask for credentials, sample data, or a preferred test command. When in doubt, request a short prioritized checklist from the repo owner.

Feedback
- After applying changes, ask the maintainer: "Is anything missing or assumed incorrectly?"
