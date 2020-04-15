---
title: react-router-dom 사용방법
date: 2020-04-07 23:44:39
category: react
draft: false
---

react-router-dom은 리액트에서 SPA 구현할 때 편리하게 라우팅 기능을 사용할 수 있게 만들어진 라이브러리입니다.

## 설치 방법

```javascript
npm i react-router-dom
```

</br>

## 기본적인 사용 방법

`src/App.js`

```javascript
import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </BrowserRouter>
  )
}

export default App
```

create-react-app으로 프로젝트를 새로 생성 후 app.js의 내용 안에 뺄 것 다 빼고 화살표 함수 방식으로 바꿨습니다.
또한 react-router-dom을 불러오는데 그 중 BrowserRouter 객체를 불러왔습니다.
그리고 불러온 BrowserRouter를 앱 전체를 감싸줍니다.
마지막으로 BrowserRouter 안에 ul, li를 통해 메뉴를 만들어줬습니다.

### [BrowserRouter]

BrowserRouter 객체엔 여러 기능이 담겨진 집합체라고 보시면 됩니다.
BrowserRouter 외에 HashRouter 라는 또다른 객체도 있는데 주소 뒤에 해시(#)를 붙여 구분하는 라우터 기술입니다.
<https://sports.news.naver.com/wfootball/index.nhn> ->
<https://sports.news.naver.com/#wfootball/#index.nhn></br>
여기선 BrowserRouter로 라우터 기능을 사용하는 것을 중점으로 두겠습니다.

### [Link]

Link는 겉으론 a태그와 비슷해 보일 수도 있습니다. 결과물을 확인해보면 웹브라우저 주소창에 a태그처럼 페이지 이동하는 것처럼 보이나 실제론 to속성에 있는 이름의 라우트로 화면 전환을 요청하는 역할을 합니다. 해당 이름의 라우트가 있다면 그 라우터안의 내용들이 화면이 표시됩니다.

```javascript
import React from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <Switch>
        <Route path="/" exact>
          홈
        </Route>
        <Route path="/about">소개</Route>
        <Route path="/dashboard">게시판</Route>
      </Switch>
    </BrowserRouter>
  )
}
export default App
```

이제 react-router-dom으로부터 Switch, Route 컴포넌트를 추가로 더 가져왔습니다.

### [Route]

아까 Link에서 to속성에 있는 이름의 라우트로 화면 전환을 요청하는 역할을 했었는데 그 라우트가 바로 이겁니다.
라우트에선 Link나 유저가 직접 주소를 입력하는 등 페이지 전환 요청을 받게 되면 해당되는 컴포넌트를 렌더링해주는 역할을 합니다.
어떤 유저가 home이라는 이름의 Link를 클릭하면(요청) home의 이름을 가진 라우트가 자신이 가지고 있는 내용물을 화면에 그려주는 것이죠.(요청받고 응답해줌)

### [Switch]

Route 들을 관리하는 역할을 합니다. 코드에서처럼 Route 컴포넌트들을 감싸주면 됩니다.
