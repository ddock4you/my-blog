Series YAML 데이터 가이드

각 시리즈는 개별 YAML 파일로 관리합니다. 파일명은 시리즈의 canonical key가 되며, 내부 `aliases`로 표기 차이를 흡수합니다.

파일 위치

- `data/series/<series-key>.yaml`

스키마

```yaml
# data/series/vim.yaml
title: 'Vim 가이드'
description: '기초부터 실전까지 Vim 생산성 올인원 시리즈'
order: # 포스트 slug 배열(폴더명, index.mdx 상위 폴더명)
  - vim-guide # 예: src/contents/development/vim-guide/index.mdx → slug: vim-guide
  - vim-advanced
aliases: # 선택: 다른 표기/대소문자/공백 버전
  - Vim
```

운영 규칙

- slug는 각 포스트의 상위 폴더명입니다. 중복이 없어야 합니다.
- `order`에 없는 포스트는 발행일 오름차순 → slug 오름차순으로 뒤에 배치됩니다.
- 파일 추가/수정 후 개발 서버를 재시작하거나, 코드에서 `refreshSeriesRegistry()` 호출 시 반영됩니다.
