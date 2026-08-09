#!/bin/bash
# PostToolUse (Edit|Write): meteor-dash.html이 수정되면 인라인 <script> 블록의
# JS 문법을 new Function()으로 파싱 검사(실행은 안 함). 오류가 있으면 Claude에게
# decision:block + reason으로 알려서 같은 턴에서 바로 고칠 수 있게 한다.
f=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
[ -z "$f" ] && exit 0

if [ "$(basename "$f")" = "meteor-dash.html" ]; then
  node -e "
    const fs = require('fs');
    const h = fs.readFileSync(process.argv[1], 'utf8');
    const m = h.match(/<script>([\s\S]*?)<\/script>/);
    if (!m) process.exit(0);
    try {
      new Function(m[1]);
    } catch (e) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: 'meteor-dash.html의 <script> 블록에 JS 문법 오류가 있습니다: ' + e.message
      }));
    }
  " "$f"
fi
exit 0
