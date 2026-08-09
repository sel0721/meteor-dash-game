#!/usr/bin/env python3
"""PreToolUse (Edit): meteor-dash.html의 논리 캔버스 해상도(LW=96, LH=150)가
실수로 지워지는 편집이면 확인을 한 번 더 받는다. 픽셀아트 렌더링 전체가
이 값에 의존하므로(96x150 -> CSS로 확대), 의도치 않은 변경을 막기 위함.
"""
import json
import sys

TARGET = "const LW = 96, LH = 150;"

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

old = data.get("tool_input", {}).get("old_string", "")
new = data.get("tool_input", {}).get("new_string", "")

if TARGET in old and TARGET not in new:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": (
                "캔버스 논리 해상도(96x150) 선언 줄을 지우거나 바꾸는 편집입니다. "
                "이 값은 모든 스프라이트/충돌 좌표 계산과 픽셀아트 확대 렌더링의 기준이라, "
                "의도한 변경이 맞는지 확인해주세요."
            ),
        }
    }))
sys.exit(0)
