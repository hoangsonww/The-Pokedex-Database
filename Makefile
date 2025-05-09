# Makefile for The-Pokedex-Database

# Repo settings
REPO_SSH     := git@github.com:hoangsonww/The-Pokedex-Database.git
REPO_HTTPS   := https://github.com/hoangsonww/The-Pokedex-Database.git
WEB_DIR      := The-Pokedex-Database/web

# Detect package manager: prefer yarn if available
ifeq (, $(shell which yarn 2>/dev/null))
  PKG_MGR := npm
else
  PKG_MGR := yarn
endif

.PHONY: help clone install dev build clean

help:         ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' Makefile \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

clone:        ## Clone or pull the latest from GitHub
	@if [ -d "$(WEB_DIR)" ]; then \
	  echo "↻ Pulling latest…"; \
	  git -C "$(dir $(WEB_DIR))" pull; \
	else \
	  echo "↓ Cloning repo…"; \
	  git clone $(REPO_SSH) || git clone $(REPO_HTTPS); \
	fi

install:      ## Install dependencies (in web/)
	@echo "📦 Installing with $(PKG_MGR)…"
	@cd $(WEB_DIR) && $(PKG_MGR) install

dev:          ## Start dev server (localhost:3000)
	@echo "🚀 Running dev server…"
	@cd $(WEB_DIR) && $(PKG_MGR) dev

build:        ## Build production bundle
	@echo "🏗  Building production…"
	@cd $(WEB_DIR) && $(PKG_MGR) build

clean:        ## Remove node_modules and .next
	@echo "🧹 Cleaning…"
	@rm -rf $(WEB_DIR)/node_modules $(WEB_DIR)/.next
