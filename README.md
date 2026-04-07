# init-llm-wiki

Andrej Karpathy의 [LLM Wiki 패턴](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)을 기반으로 한, npx로 설치 가능한 개인 지식 베이스 스캐폴더입니다.

## 설치

```bash
npx init-llm-wiki my-notes
cd my-notes
```

## 생성되는 구조

```
my-notes/
├── CLAUDE.md          # LLM 행동 지침 (스키마)
├── README.md          # 프로젝트 소개
├── .gitignore
├── AGENTS.md -> CLAUDE.md
├── .agents/skills -> ../.claude/skills
├── .claude/skills/    # Claude Code 슬래시 커맨드
├── raw/               # 원본 소스 (불변)
│   └── assets/        # 이미지 및 첨부파일
└── wiki/              # LLM이 유지하는 지식 베이스
    ├── index.md       # 전체 카탈로그
    ├── log.md         # 작업 이력
    ├── sources/       # 소스별 요약
    ├── entities/      # 인물, 조직, 제품
    ├── concepts/      # 개념, 이론, 기술
    └── analyses/      # 비교, 분석, 합성
```

## 사용법

### 1. 소스 추가

`raw/` 폴더에 마크다운 파일을 넣습니다.

```bash
# URL에서 직접 추가
/url-to-markdown https://example.com/article

# 또는 직접 파일 복사
cp my-article.md raw/
```

### 2. 위키에 통합

```bash
/wiki-ingest raw/my-article.md
```

소스를 읽고 핵심 정보를 추출하여 관련 위키 페이지를 자동 생성/업데이트합니다.

### 3. 질문하기

```bash
/wiki-query 머신러닝과 딥러닝의 차이점은?
```

위키를 탐색하여 출처 기반 답변을 제공합니다.

### 4. 위키 점검

```bash
/wiki-lint
```

모순, 고립 페이지, 깨진 링크를 찾아 수정합니다.

## 철학

RAG처럼 매번 원본에서 답을 재도출하는 대신, LLM이 **지속적으로 위키를 구축하고 유지**합니다. 지식이 쌓일수록 위키는 점점 풍부해집니다.

> "LLM은 지루해하지 않고, 교차 참조 업데이트를 잊지 않으며, 한 번에 15개의 파일을 수정할 수 있다."
> — Andrej Karpathy

## 요구사항

- [Claude Code](https://claude.ai/code) (슬래시 커맨드 사용을 위함)
- Node.js 16+ (설치 시에만 필요)

## 라이선스

MIT
