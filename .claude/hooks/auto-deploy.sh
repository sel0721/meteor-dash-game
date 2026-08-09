#!/bin/bash
# Stop: 세션이 끝날 때 변경사항이 있으면 커밋 + 푸시해서 GitHub Pages에 반영.
# meteor-dash.html의 JS 문법이 깨져 있으면(=배포하면 게임이 바로 죽는 상태) 푸시하지 않고 알림만 띄운다.
set -euo pipefail
cd "/Users/choeseli/Desktop/@@@개인파일/AI/클로드/02_게임"

if [ -f meteor-dash.html ]; then
  if ! node -e "
    const fs = require('fs');
    const h = fs.readFileSync('meteor-dash.html', 'utf8');
    const m = h.match(/<script>([\s\S]*?)<\/script>/);
    if (m) new Function(m[1]);
  " 2>/tmp/meteor-dash-deploy-synerr.txt; then
    ERR=$(cat /tmp/meteor-dash-deploy-synerr.txt | tr '\n' ' ')
    echo "{\"systemMessage\": \"자동 배포 건너뜀: meteor-dash.html에 JS 문법 오류가 있어요 ($ERR)\"}"
    exit 0
  fi
fi

git add -A

if git diff --cached --quiet; then
  exit 0
fi

MSG="Auto-deploy: session changes $(date '+%Y-%m-%d %H:%M')"
if git commit -q -m "$MSG" && git push -q; then
  echo '{"systemMessage": "변경사항을 자동 커밋+푸시했어요 (GitHub Pages에 곧 반영됩니다)"}'
else
  echo '{"systemMessage": "자동 배포 실패: git commit/push 중 오류가 발생했어요. 직접 확인해주세요."}'
fi
