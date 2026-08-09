#!/usr/bin/env python3
"""PreToolUse (Edit): meteor-dash.html의 localStorage 키 이름
('meteor-dash-best', 'meteor-dash-scores')이 바뀌는 편집이면 확인을 받는다.
키 이름이 바뀌면 기존 플레이어의 최고점수/TOP5 랭킹 기록이 전부 사라진다.
"""
import json
import sys

KEYS = ["meteor-dash-best", "meteor-dash-scores"]

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

old = data.get("tool_input", {}).get("old_string", "")
new = data.get("tool_input", {}).get("new_string", "")

changed = [k for k in KEYS if k in old and k not in new]

if changed:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "ask",
            "permissionDecisionReason": (
                "localStorage 키(" + ", ".join(changed) + ")를 바꾸는 편집입니다. "
                "키 이름이 바뀌면 기존 플레이어의 저장된 최고점수/TOP5 랭킹 기록을 "
                "더 이상 읽지 못하게 됩니다 (사실상 초기화). 의도한 변경이 맞는지 확인해주세요."
            ),
        }
    }))
sys.exit(0)
