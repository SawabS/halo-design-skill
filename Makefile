# Halo: reproducible tasks. `make help` lists them.
PY ?= python3
PORT ?= 8766
URL = http://localhost:$(PORT)

.PHONY: help setup serve check tokens qa qa-templates qa-example assets pdf-verify all

help:
	@echo "make setup        install pinned Python deps + Chromium"
	@echo "make check        self-check: links, tokens in sync, no colour literals, no logos, JS syntax, dictionaries"
	@echo "make tokens       rebuild DTCG JSON from tokens/tokens.css"
	@echo "make qa           layout + touch suites on both templates and the example (starts a local server)"
	@echo "make assets       re-render README images into docs/assets/"
	@echo "make pdf-verify   verify the example PDFs are fully vector"
	@echo "make all          check + qa + pdf-verify"

setup:
	$(PY) -m pip install -r requirements.txt
	$(PY) -m playwright install chromium

serve:
	$(PY) -m http.server $(PORT)

check:
	$(PY) scripts/check_skill.py

tokens:
	$(PY) scripts/build_tokens.py

# Each QA target starts a throwaway server and stops it afterwards.
define WITH_SERVER
	@$(PY) -m http.server $(PORT) >/dev/null 2>&1 & echo $$! > .server.pid; sleep 1; \
	trap 'kill `cat .server.pid`; rm -f .server.pid' EXIT; $(1)
endef

qa-templates:
	$(call WITH_SERVER, \
	$(PY) qa/qa_layout.py $(URL)/templates/starter.html && \
	$(PY) qa/qa_layout.py $(URL)/templates/dashboard.html && \
	$(PY) qa/qa_touch.py  $(URL)/templates/starter.html && \
	$(PY) qa/qa_touch.py  $(URL)/templates/dashboard.html)

qa-example:
	$(call WITH_SERVER, \
	$(PY) qa/qa_layout.py $(URL)/examples/workout-plan/index.html --ns swp: && \
	$(PY) qa/qa_touch.py  $(URL)/examples/workout-plan/index.html --ns swp:)

qa: qa-templates qa-example

assets:
	$(call WITH_SERVER, $(PY) scripts/render_assets.py)

pdf-verify:
	bash scripts/verify_pdf.sh examples/workout-plan/pdf/*.pdf

all: check qa pdf-verify
