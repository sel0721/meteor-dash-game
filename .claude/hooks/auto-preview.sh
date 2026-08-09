#!/bin/bash
# PostToolUse (Edit|Write): meteor-dash.html이 수정되면 기본 브라우저로 자동 실행/포커스.
f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
[ -z "$f" ] && exit 0
if [ "$(basename "$f")" = "meteor-dash.html" ]; then
  open "$f" 2>/dev/null || true
fi
exit 0
