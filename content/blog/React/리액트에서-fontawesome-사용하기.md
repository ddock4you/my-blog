---
title: 리액트에서 Font Awesome 사용하기
date: 2020-4-21 23:04:08
category: react
draft: false
---

## 기존의 사용 방식과 다른점

기존에 사용했던 직접 소스를 다운받거나 CDN을 통해 소스를 불러오는 방식은 수천 개에 달하는 아이콘을 모두 로드해야 하는 비효율이 발생합니다. 하지만 JavaScript 기반인 React에서 사용할 때는 특정 카테고리에서 원하는 아이콘만 가져와서 사용할 수 있습니다.
이에 따라 빌드 최적화 작업에 용이하다는 장점이 있습니다.

## 1. 설치하기

저는 npm을 이용하여 한 번에 다섯 개의 Font Awesome 패키지를 설치했습니다. 어떤 패키지를 설치 했는지, 각 패키지의 용도는 어떻게 되는지 알아보겠습니다.

```bash
npm i @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
```

### 1) `@fortawesome/fontawesome-svg-core` (핵심 패키지)

Font Awesome를 사용하기 위해 핵심적인 기능이 담긴 패키지입니다. Font Awesome을 사용하기 위해 필수적으로 설치해야 합니다.

### 2) `@fortawesome/free-solid-svg-icons`</br> `@fortawesome/free-regular-svg-icons`</br> `@fortawesome/free-brands-svg-icons` (아이콘 묶음 패키지)

아이콘 패키지는 크게 Solid, Regular, Light, Duotone, Brands 5개 유/무료 패키지가 존재합니다. 저는 무료로 제공되는 Solid, Regular, Brands 3개의 카테고리에 대한 패키지만 설치하겠습니다. </br>(무조건 3개를 다 설치할 필요는 없습니다. 여러분이 필요로 하는 아이콘이 담긴 패키지만 설치하시면 됩니다.)

### 3)`@fortawesome/react-fontawesome`

Font Awesome을 컴포넌트 형태로 사용할 수 있도록 패키지입니다. 필수적으로 설치해야 합니다.

## 2. 임포트하기

위에서 설명했다시피 원하는 아이콘만을 불러와 사용할 수 있는데 예를 들어 Solid 카테고리에서 check-square와 spinner 아이콘을 임포트하고, Regular 카테고리에서는 square 아이콘을 임포트하고 싶다면 다음과 같이 코딩하면 됩니다.

```javascript
import { faCheckSquare, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome;'
```

## 3. 사용하기

`@fortawesome/react-fontawesome` 패키지에서 FontAwesomeIcon 컴포넌트를 불러옵니다.
그리고 위에서 임포트했던 Font Awesom 아이콘을 icon props로 넘겨줍니다.

```javascript
import React from 'react'
import { faCheckSquare, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faSquare } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome;'

export default () => <FontAwesomeIcon icon={faCamera} />
```

FontAwesomeIcon 컴포넌트는 icon props 외에도 아이콘을 제어하기 위한 여러가지 props을 가지고 있습니다. 아래의 데모화면을 통해 다양한 props를 확인하실 수 있습니다.

<iframe
     src="https://codesandbox.io/embed/react-font-awesome-b6vxt?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="react-font-awesome"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 참조문서

<https://www.daleseo.com/react-font-awesome/>
<https://fontawesome.com/how-to-use/on-the-web/advanced/svg-javascript-core>
