---
name: url-to-markdown
description: URL을 입력받아 https://r.jina.ai 를 통해 마크다운으로 변환 후 raw/ 폴더에 저장합니다. 사용자가 URL을 제공하며 위키에 추가해달라고 요청할 때 사용합니다.
---

# url-to-markdown

URL을 마크다운으로 변환하여 `raw/` 폴더에 저장합니다.

## 사용법

```
/url-to-markdown [URL]
```

예) `/url-to-markdown https://example.com/article`

## 실행 절차

1. **URL 확인**
   - 인자로 받은 URL(또는 대화에서 언급된 URL)을 확인합니다.
   - URL이 없으면 사용자에게 요청합니다.

2. **마크다운 다운로드**
   - `https://r.jina.ai/[URL]` 로 fetch하여 마크다운 콘텐츠를 가져옵니다.
   - 예) URL이 `https://example.com/article` 이면 `https://r.jina.ai/https://example.com/article` 로 요청합니다.

3. **파일명 결정**
   - URL의 경로 또는 페이지 제목을 기반으로 파일명을 생성합니다.
   - 소문자, 하이픈 구분, `.md` 확장자: 예) `example-article.md`
   - 동일한 파일명이 이미 존재하면 사용자에게 확인합니다.

4. **raw/ 에 저장**
   - `raw/[파일명].md` 로 저장합니다.
   - 파일 상단에 출처 URL을 주석으로 추가합니다:
     ```
     <!-- source: https://example.com/article -->
     <!-- fetched: YYYY-MM-DD -->
     ```

5. **완료 보고**
   - 저장된 파일 경로를 보고합니다.
   - `/wiki-ingest` 스킬로 위키에 통합할 것을 제안합니다.
