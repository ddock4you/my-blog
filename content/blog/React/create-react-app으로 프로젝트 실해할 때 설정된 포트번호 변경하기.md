---
title: create-react-app으로 프로젝트 실행할 때 설정된 포트번호 변경하기
date: 2020-04-07 23:43:39
category: React
draft: false
---

작업 중인 프로젝트의 package.json 파일을 열어서 환경변수를 추가하면 원하는 포트번호로 바꿀 수 있습니다.

## 윈도우 환경에서 설정

아래 start 부분에 **set PORT='원하는 포트번호'** 를 입력합니다.

```javascript
{
  ...
    "scripts": {
        "start": "set PORT=9090 && react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
  ...
}
```

## 리눅스 환경에서 표현

윈도우에서 사용했던 **set** 명령어를 **export** 로 변경하여 사용한다.

```javascript
{
  ...
    "scripts": {
        "start": "export PORT=9090 && react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    },
  ...
}
```

</br>
아래와 같이 터미널에서 곧바로 같은 1회성 포트번호 변경 후 실행 방식도 있던데 윈도우 환경에선 작동되지 않았습니다. 리눅스나 맥 환경을 접할 기회가 있을 때 확인해봐야겠습니다.

```javascript
PORT 8000 npm start
```
